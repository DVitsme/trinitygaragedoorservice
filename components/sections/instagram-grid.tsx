import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { InstagramIcon } from "@/components/social-icons";
import { Reveal } from "@/components/reveal";
import { IG_TILES, SITE, asset } from "@/lib/site";

export function InstagramGrid() {
  return (
    <div className="border-t-2 border-ink bg-white">
      <div className="mx-auto max-w-[1200px] px-8 py-[92px]">
        <Reveal className="flex flex-wrap items-end justify-between gap-[18px]">
          <div>
            <div className="inline-flex items-center gap-[9px] text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent">
              <InstagramIcon className="h-[17px] w-[17px]" />
              Follow Us
            </div>
            <h2 className="m-0 mt-2 font-heading text-[clamp(22px,3vw,34px)] font-extrabold uppercase leading-[1.04] text-ink">
              @trinitygaragedoorservice
            </h2>
          </div>
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-[9px] rounded-[7px] bg-ink px-6 py-3.5 text-[14px] font-extrabold uppercase tracking-[0.04em] text-white no-underline"
          >
            Follow on Instagram
            <ArrowRight className="h-4 w-4" strokeWidth={2.6} />
          </a>
        </Reveal>
        <Reveal className="mt-[30px] grid grid-cols-2 gap-3 min-[561px]:grid-cols-6">
          {IG_TILES.map((tile) => (
            <a
              key={tile.file}
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden rounded-lg border-2 border-ink"
            >
              <Image
                src={asset(tile.file)}
                alt={tile.alt}
                fill
                sizes="(max-width: 560px) 50vw, 16vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.07]"
              />
            </a>
          ))}
        </Reveal>
      </div>
    </div>
  );
}
