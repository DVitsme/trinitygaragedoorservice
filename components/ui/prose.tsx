import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Long-form body typography (service pages, blog) styled to the Bold Trade system. */
export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "max-w-[720px] text-[17px] leading-[1.7] text-[#3a3a3a]",
        "[&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:font-heading [&_h2]:text-[clamp(22px,3vw,30px)] [&_h2]:font-extrabold [&_h2]:uppercase [&_h2]:text-ink",
        "[&_h3]:mt-7 [&_h3]:mb-2 [&_h3]:font-heading [&_h3]:text-[19px] [&_h3]:font-bold [&_h3]:text-ink",
        "[&_p]:mb-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1.5",
        "[&_a]:font-semibold [&_a]:text-accent [&_strong]:text-ink",
        className,
      )}
    >
      {children}
    </div>
  );
}
