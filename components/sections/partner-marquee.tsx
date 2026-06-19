import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { BRANDS, asset } from "@/lib/site";

function BrandCard({ file, name, hidden }: { file: string; name: string; hidden?: boolean }) {
  return (
    <span
      aria-hidden={hidden}
      className="flex h-[88px] w-[172px] shrink-0 items-center justify-center rounded-lg border-2 border-ink bg-white p-4"
    >
      <span className="relative h-full w-full">
        <Image
          src={asset(file)}
          alt={hidden ? "" : name}
          fill
          sizes="140px"
          className="object-contain"
        />
      </span>
    </span>
  );
}

export function PartnerMarquee() {
  return (
    <div id="services" className="border-y-2 border-ink bg-sand">
      <div className="mx-auto max-w-[1200px] py-14">
        <Reveal className="px-8 text-center">
          <div className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent">
            Who We Work With
          </div>
          <h2 className="m-0 mt-2.5 font-heading text-[clamp(24px,3vw,34px)] font-extrabold uppercase leading-[1.05] text-ink">
            Trusted Brands &amp; Partners
          </h2>
        </Reveal>
        <div className="marquee-mask mt-[34px] overflow-hidden">
          <div className="marquee">
            {BRANDS.map((b) => (
              <BrandCard key={b.file} file={b.file} name={b.name} />
            ))}
            {BRANDS.map((b) => (
              <BrandCard key={`dup-${b.file}`} file={b.file} name={b.name} hidden />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
