import type { SVGProps } from "react";

/* Brand/social glyphs as inline SVGs (ported from the original markup). lucide-react 1.x
   no longer ships brand icons, so these live here. */

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M14 9h3V5.5h-3c-2 0-3.5 1.6-3.5 3.6V11H8v3.5h2.5V22H14v-7.5h2.6l.4-3.5H14V9.6c0-.4.3-.6.6-.6z" />
    </svg>
  );
}

export function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0zM3.4 8.5h3.1V21H3.4zM9.3 8.5h2.97v1.7h.04c.41-.78 1.42-1.6 2.93-1.6 3.13 0 3.71 2.06 3.71 4.74V21h-3.1v-5.36c0-1.28-.02-2.92-1.78-2.92-1.78 0-2.05 1.39-2.05 2.83V21H9.3z" />
    </svg>
  );
}

export function YelpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M11.3 3.2c.1-.7-.5-1.3-1.2-1.1L6.3 3.4c-.6.2-.9.9-.5 1.4l3 4.6c.5.8 1.8.4 1.8-.5zM10.9 12.4c-.2-.6-.9-.8-1.4-.5L5.6 14c-.6.4-.6 1.3.1 1.5l3.6 1.1c.8.2 1.5-.5 1.3-1.3zM13.2 13.6c-.7-.4-1.6.1-1.6.9v4.9c0 .8.9 1.2 1.5.7l3-2.4c.5-.4.4-1.2-.2-1.5zM14 11.3c.1.8 1 1.2 1.6.7l3-2.4c.5-.4.4-1.2-.2-1.5l-4.4-2.4c-.7-.4-1.6.2-1.5 1z" />
    </svg>
  );
}

export function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M21.6 12.2c0-.6-.1-1.2-.2-1.8H12v3.5h5.4c-.2 1.2-.9 2.3-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.2zM12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6C4.7 19.8 8.1 22 12 22zM6.4 13.9c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V7.5H3.1A10 10 0 0 0 2 12c0 1.6.4 3.2 1.1 4.5zM12 6c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 3.1 14.7 2 12 2 8.1 2 4.7 4.2 3.1 7.5l3.3 2.6C7.2 7.7 9.4 6 12 6z" />
    </svg>
  );
}
