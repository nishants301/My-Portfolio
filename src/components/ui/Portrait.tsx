"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Portrait with a graceful placeholder.
 *
 * Drop a file at /public/portrait.jpg and it appears — no flag to flip. If the
 * file is absent the frame shows a labelled monogram instead of a broken
 * image, so the layout never collapses mid-edit.
 */
export default function Portrait({
  src = "/portrait.jpg",
  alt,
}: {
  src?: string;
  alt: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <div className="grid-field absolute inset-0 opacity-70" aria-hidden />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-rule-strong">
          <span className="font-mono text-lg text-ink-faint">NS</span>
        </div>
        <p className="mono-label relative">Portrait · /public/portrait.jpg</p>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 1024px) 100vw, 32vw"
      className="object-cover"
      priority={false}
      onError={() => setFailed(true)}
    />
  );
}
