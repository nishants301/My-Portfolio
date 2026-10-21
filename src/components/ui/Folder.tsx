import type { ReactNode } from "react";

/**
 * The structural unit of the whole page: a rounded card with a folder tab on
 * its top edge, carrying a meta strip.
 *
 * Tonal, not chromatic. The reference distinguishes its folders with four
 * hues; we distinguish them with four elevation steps and keep the single
 * signal green for the active tab only (docs/spec.md §5①). On a near-black
 * ground, tonal separation reads as depth where four competing hues would read
 * as noise.
 */

/** Elevation steps, darkest to lightest. Index by section order. */
const TONE = [
  "bg-surface",
  "bg-panel",
  "bg-raised",
  "bg-[#1f242a]",
] as const;

export type FolderProps = {
  /** Two-digit chapter number, e.g. "01". */
  index: string;
  /** Total chapters, for the "01 / 07" counter. */
  total: string;
  /** Short uppercase label shown on the tab itself. */
  tab: string;
  /** Mid-strip breadcrumbs. Kept short — they truncate on mobile. */
  meta?: string[];
  tone?: 0 | 1 | 2 | 3;
  /** Marks this folder's tab with the signal accent. */
  active?: boolean;
  id?: string;
  children: ReactNode;
};

export default function Folder({
  index,
  total,
  tab,
  meta = [],
  tone = 0,
  active = false,
  id,
  children,
}: FolderProps) {
  return (
    // content-visibility lets the browser skip layout and paint for folders
    // that are off-screen. With seven tall sections carrying ~50 per-glyph
    // SVGs between them, this was the single largest Style & Layout cost.
    // contain-intrinsic-size supplies a placeholder height so skipping cannot
    // introduce scroll jump or CLS; `auto` lets it remember the real size once
    // measured.
    <section
      id={id}
      className="scroll-mt-24 px-3 [contain-intrinsic-size:auto_900px] [content-visibility:auto] sm:px-4"
    >
      <div className="mx-auto w-full max-w-[96rem]">
        {/* ---------- Tab ---------- */}
        <div className="flex items-end gap-1.5 pl-4 sm:pl-8">
          <div
            className={[
              "flex items-center gap-2.5 rounded-t-[12px] px-4 py-2 sm:px-5",
              TONE[tone],
              active ? "text-signal" : "text-ink-dim",
            ].join(" ")}
          >
            {active && (
              <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />
            )}
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em]">
              {tab}
            </span>
          </div>

          {/* Index tab — the reference's "01 / 07" counter, pushed right. */}
          <div
            className={`ml-auto rounded-t-[12px] px-4 py-2 ${TONE[tone]} text-ink-faint`}
          >
            <span className="font-mono text-[0.6875rem] tracking-[0.1em]">
              {index} / {total}
            </span>
          </div>
        </div>

        {/* ---------- Body ---------- */}
        <div
          className={`rounded-[18px] rounded-tl-none border border-rule ${TONE[tone]} pb-12 pt-[22px] sm:pb-14`}
        >
          {/* Meta strip. Horizontally scrollable rather than wrapped, so the
              rhythm of a single thin line survives on a phone. */}
          {meta.length > 0 && (
            <div className="mb-10 overflow-x-auto border-b border-rule px-5 pb-[22px] sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex w-max items-center gap-6">
                {meta.map((m) => (
                  <span
                    key={m}
                    className="whitespace-nowrap font-mono text-[0.65625rem] uppercase tracking-[0.14em] text-ink-faint"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="px-5 sm:px-8">{children}</div>
        </div>
      </div>
    </section>
  );
}
