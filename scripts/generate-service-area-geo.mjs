#!/usr/bin/env node
/**
 * Service-area map generator. Writes lib/service-area-geo.json.
 *
 * WHY THIS EXISTS: the site used to ship a hand-drawn CSS "map" (grid lines, two rotated bars as
 * roads, pins at hardcoded percentages) that depicted nothing. This builds the REAL footprint of
 * Trinity's Housecall Pro service zone from public-domain US Census boundaries.
 *
 * The output is SVG path `d` strings already projected to viewBox coordinates, NOT GeoJSON. That
 * means no projection library, no map library and no tiles ever reach the browser. The map renders
 * from a server component at 0 KB of client JavaScript.
 *
 * Measured output: ~1 KB gzipped for the footprint plus all five county outlines. For comparison,
 * Mapbox GL JS v3 is 499 KB gzipped before it draws anything.
 *
 * ⚠️ REFRESH-ONLY. Deliberately NOT chained to `pnpm build` (unlike generate-blog.mjs, which has
 * to run every build because the Worker cannot read content/blog with fs). County and ZCTA
 * boundaries change on a decennial cadence, so re-running this on every deploy would download
 * 78 MB to produce a byte-identical file, and would make a Census outage a failed deploy.
 *
 *   pnpm geo:gen        # re-run by hand if the zip list or the Census vintage changes
 *
 * Sources, all public domain (US Government works, no key, no account, no attribution required):
 *   - Counties: Census Cartographic Boundary Files, 500k
 *   - ZIPs:     Census ZCTA 2020 Cartographic Boundary File, 500k
 *               (ZIPs are USPS delivery routes, not polygons. ZCTA is the standard Census proxy.)
 *   - Cities:   Census Gazetteer Places, Florida
 *
 * The 130 zips come from lib/service-area-zips.json, which is itself verified 130/130 against
 * their live Housecall Pro service zone. That file stays the single source of truth.
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const CACHE = path.join(ROOT, ".geo-cache");
const OUT = path.join(ROOT, "lib", "service-area-geo.json");
const LOOKUP_OUT = path.join(ROOT, "lib", "service-area-lookup.json");
const ZIPS_SRC = path.join(ROOT, "lib", "service-area-zips.json");

/** Census vintages. Bump deliberately; county lines are stable year to year. */
const COUNTY_URL = "https://www2.census.gov/geo/tiger/GENZ2023/shp/cb_2023_us_county_500k.zip";
const ZCTA_URL = "https://www2.census.gov/geo/tiger/GENZ2020/shp/cb_2020_us_zcta520_500k.zip";
const GAZ_URL = "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2024_Gazetteer/2024_gaz_place_12.txt";

/** FIPS for the five counties in the zone. STATEFP 12 = Florida. */
const COUNTIES = [
  { fips: "12057", name: "Hillsborough" },
  { fips: "12103", name: "Pinellas" },
  { fips: "12101", name: "Pasco" },
  { fips: "12053", name: "Hernando" },
  { fips: "12105", name: "Polk" },
];

/**
 * The six towns with a real page. Mirrors AREAS in lib/site.ts. Pins link there, so this list must
 * only ever contain routes that exist: inventing anchors to pages we have not built is the doorway
 * pattern Google names explicitly.
 *
 * `gaz` is the Census Gazetteer NAME when it differs from ours. "Land O' Lakes" needs the
 * apostrophe to match "Land O' Lakes CDP".
 */
const PIN_CITIES = [
  { name: "Lutz", slug: "lutz", gaz: "Lutz CDP", hq: true },
  { name: "Land O' Lakes", slug: "land-o-lakes", gaz: "Land O' Lakes CDP" },
  { name: "Wesley Chapel", slug: "wesley-chapel", gaz: "Wesley Chapel CDP" },
  { name: "Palm Harbor", slug: "palm-harbor", gaz: "Palm Harbor CDP" },
  { name: "Oldsmar", slug: "oldsmar", gaz: "Oldsmar city" },
  { name: "Tampa", slug: "tampa", gaz: "Tampa city" },
];

/** Their actual dispatch address, verified from the Housecall Pro company record. */
const HQ = { lon: -82.4625826, lat: 28.1372004 };

/**
 * viewBox width. Height is derived from the real aspect ratio of the footprint, which comes out
 * portrait (roughly 1000x1200): their zone runs further north to south than east to west. Do not
 * force it landscape, that would mean cropping real coverage.
 *
 * The padding keeps the outline off the panel edges, where it otherwise reads as clipped.
 */
const VW = 1000;
const PAD = 34;

// ---------------------------------------------------------------------------- helpers

const log = (m) => console.log(`[geo] ${m}`);

function download(url, dest) {
  if (fs.existsSync(dest)) return dest;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  log(`downloading ${path.basename(dest)} ...`);
  execFileSync("curl", ["-sSL", "--fail", "-o", dest, url], { stdio: ["ignore", "ignore", "inherit"] });
  return dest;
}

/** Run mapshaper via npx so the repo needs no new dependency, runtime or dev. */
function mapshaper(args) {
  return execFileSync("npx", ["-y", "mapshaper", ...args], { encoding: "utf8", maxBuffer: 1 << 28 });
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

/** GeoJSON docs come back as either a FeatureCollection or a bare GeometryCollection. */
function geometriesOf(doc) {
  if (doc.type === "GeometryCollection") return doc.geometries;
  if (doc.type === "FeatureCollection") return doc.features.map((f) => f.geometry);
  return [doc];
}

function ringsOf(g) {
  if (!g) return [];
  if (g.type === "Polygon") return [g.coordinates];
  if (g.type === "MultiPolygon") return g.coordinates;
  return [];
}

/** Spherical Web Mercator. Only used here at build time; never shipped. */
const mercX = (lon) => (lon * Math.PI) / 180;
const mercY = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));

// ---------------------------------------------------------------------------- build

const zipData = readJson(ZIPS_SRC);
const ZIPS = Object.keys(zipData.zips);
log(`${ZIPS.length} zips from lib/service-area-zips.json`);

const countyZip = download(COUNTY_URL, path.join(CACHE, "county.zip"));
const zctaZip = download(ZCTA_URL, path.join(CACHE, "zcta.zip"));
const gazTxt = download(GAZ_URL, path.join(CACHE, "gaz_place_12.txt"));

// --- footprint: filter to our zips, dissolve, THEN simplify.
// Dissolve-first is not a style preference: it deletes the duplicated shared edges between
// adjacent zips before the simplifier ever sees them. Measured 2.9 KB dissolve-then-simplify
// versus 6.0 KB simplify-then-dissolve, and the dissolve-first result also looks cleaner.
const zipSet = `["${ZIPS.join('","')}"]`;
const footprintPath = path.join(CACHE, "footprint.geojson");
log("building footprint (filter -> dissolve -> simplify) ...");
mapshaper([
  zctaZip,
  "-filter", `${zipSet}.indexOf(ZCTA5CE20) > -1`,
  "-dissolve",
  "-simplify", "dp", "5%",
  "-o", "precision=0.0001", `${footprintPath}`, "force",
]);

const countyPath = path.join(CACHE, "counties.geojson");
log("building county outlines ...");
mapshaper([
  countyZip,
  "-filter", `["${COUNTIES.map((c) => c.fips).join('","')}"].indexOf(GEOID) > -1`,
  "-simplify", "dp", "3%",
  "-o", "precision=0.0001", `${countyPath}`, "force",
]);

const footprintDoc = readJson(footprintPath);
const countyDoc = readJson(countyPath);

// --- projection fitted to the FOOTPRINT bounds, not the counties.
// The counties sprawl well past where Trinity actually works (Polk alone is huge and they serve
// five zips of it), so fitting to counties would shrink the thing the section is about.
const fpPoints = [];
for (const g of geometriesOf(footprintDoc))
  for (const poly of ringsOf(g)) for (const ring of poly) for (const [lon, lat] of ring) fpPoints.push([mercX(lon), mercY(lat)]);

const xs = fpPoints.map((p) => p[0]);
const ys = fpPoints.map((p) => p[1]);
const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
const scale = (VW - 2 * PAD) / (maxX - minX);
const VH = Math.round((maxY - minY) * scale + 2 * PAD);

const project = (lon, lat) => [
  +(PAD + (mercX(lon) - minX) * scale).toFixed(1),
  +(PAD + (maxY - mercY(lat)) * scale).toFixed(1),
];

function toPath(doc) {
  const out = [];
  for (const g of geometriesOf(doc)) {
    for (const poly of ringsOf(g)) {
      for (const ring of poly) {
        const pts = ring.map(([lon, lat]) => project(lon, lat).join(","));
        if (pts.length) out.push(`M${pts.join("L")}Z`);
      }
    }
  }
  return out.join("");
}

const footprint = toPath(footprintDoc);

const counties = COUNTIES.map(({ fips, name }) => {
  const feat = countyDoc.features.find((f) => f.properties.GEOID === fips);
  if (!feat) throw new Error(`county ${name} (${fips}) not found in the Census extract`);
  return { name, d: toPath({ type: "FeatureCollection", features: [feat] }) };
});

// --- city pins from the Gazetteer
const gazRows = fs.readFileSync(gazTxt, "utf8").trim().split("\n").slice(1).map((line) => {
  const c = line.split("\t").map((s) => s.trim());
  return { name: c[3], lat: +c[10], lon: +c[11] };
});

const cities = PIN_CITIES.map((c) => {
  if (c.hq) {
    const [x, y] = project(HQ.lon, HQ.lat);
    return { name: c.name, slug: c.slug, x, y, hq: true };
  }
  const row = gazRows.find((r) => r.name === c.gaz);
  if (!row) throw new Error(`Gazetteer has no place named "${c.gaz}" (for ${c.name})`);
  const [x, y] = project(row.lon, row.lat);
  return { name: c.name, slug: c.slug, x, y };
});

// --- per-zip points, so the Phase 2 checker can drop a marker on the matched zip.
// Uses each ZCTA's own interior point rather than a bounding-box centre, which for the coastal
// zips would otherwise land in the Gulf.
log("computing zip interior points ...");
const zipPtsPath = path.join(CACHE, "zip-points.geojson");
mapshaper([
  zctaZip,
  "-filter", `${zipSet}.indexOf(ZCTA5CE20) > -1`,
  "-points", "inner",
  "-o", "precision=0.0001", `${zipPtsPath}`, "force",
]);
const zipPtDoc = readJson(zipPtsPath);
const zipPoints = {};
for (const f of zipPtDoc.features ?? []) {
  const [lon, lat] = f.geometry.coordinates;
  // Rounded to whole viewBox units. These ride in the CLIENT bundle, and at the sizes this map
  // renders one unit is under half a pixel, so the decimal was costing bytes to move a marker by
  // an invisible amount.
  zipPoints[f.properties.ZCTA5CE20] = project(lon, lat).map(Math.round);
}

const missing = ZIPS.filter((z) => !zipPoints[z]);
if (missing.length) log(`⚠️  ${missing.length} zip(s) had no ZCTA polygon: ${missing.join(", ")}`);

const SOURCE =
  "US Census Cartographic Boundary Files (counties 2023 500k, ZCTA 2020 500k) and Gazetteer Places 2024, all public domain. Zip list from lib/service-area-zips.json, verified against Trinity's live Housecall Pro service zone.";

// ---- 1. the map, imported by a SERVER component only.
// Holds every path string, so it must never be imported from a "use client" module or the whole
// geometry ends up in the browser bundle.
fs.writeFileSync(
  OUT,
  JSON.stringify({
    _generated: "pnpm geo:gen — do not edit by hand",
    _source: SOURCE,
    _note:
      "Paths are already projected to viewBox coordinates (Web Mercator). No projection or map library is needed at runtime. SERVER ONLY: importing this from a client component ships every path to the browser.",
    viewBox: `0 0 ${VW} ${VH}`,
    footprint,
    counties,
    cities,
  }),
);

// ---- 2. the zip lookup, imported by the CLIENT checker.
// Deliberately a separate file from the map: the checker needs zip -> city/county/point and
// nothing else, and bundling it with the geometry would multiply its cost for no reason.
// City and county names are interned into arrays and referenced by index, which is most of the
// saving given how many zips share a city (Tampa alone has 27).
const cityNames = [...new Set(Object.values(zipData.zips).map((z) => z.city))].sort();
const countyNames = [...new Set(Object.values(zipData.zips).map((z) => z.county))].sort();
const lookup = {};
for (const [zip, { city, county }] of Object.entries(zipData.zips)) {
  const pt = zipPoints[zip];
  lookup[zip] = [cityNames.indexOf(city), countyNames.indexOf(county), ...(pt ?? [])];
}
fs.writeFileSync(
  LOOKUP_OUT,
  JSON.stringify({
    _generated: "pnpm geo:gen — do not edit by hand",
    _source: SOURCE,
    _note:
      "zips[zip] = [cityIndex, countyIndex, x, y]. x/y are viewBox coordinates matching viewBox below, so an overlay SVG using the same viewBox lines up with the map exactly.",
    viewBox: `0 0 ${VW} ${VH}`,
    cities: cityNames,
    counties: countyNames,
    zips: lookup,
  }),
);

const gz = (p) => zlib.gzipSync(fs.readFileSync(p), { level: 9 }).length;
log(`wrote lib/service-area-geo.json    ${fs.statSync(OUT).size.toLocaleString()} bytes (${gz(OUT).toLocaleString()} gzipped) — server only`);
log(`wrote lib/service-area-lookup.json ${fs.statSync(LOOKUP_OUT).size.toLocaleString()} bytes (${gz(LOOKUP_OUT).toLocaleString()} gzipped) — client`);
log(`viewBox 0 0 ${VW} ${VH} | footprint ${footprint.length} chars | counties ${counties.reduce((n, c) => n + c.d.length, 0)} chars | ${Object.keys(zipPoints).length} zip points | ${cityNames.length} cities`);
