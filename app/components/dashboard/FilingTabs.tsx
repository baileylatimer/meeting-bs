/**
 * FilingTabs — Manila folder / filing cabinet style tab navigation.
 *
 * Shape: Symmetric trapezoid — wider at bottom, narrower at top.
 * Left side angles inward (bottom-left → top-right).
 * Right side angles inward (bottom-right → top-left).
 *
 * Border technique: double-layer clip-path.
 * - Outer div: clipped to trapezoid, background = #0A0A0A (border color)
 * - Inner div: clipped to slightly smaller trapezoid (2px inset), background = #EDE8E1 (fill)
 * - Active tab: inner fill extends to bottom → no bottom border (bleeds into content)
 * - Inactive tabs: inner fill stops 2px from bottom → bottom border visible
 *
 * Overlap: tabs overlap at the bottom (negative margin) but tops are narrower so they separate.
 */

export type TabId = "yappers" | "tangents" | "buzzwords" | "trends";

interface Tab {
  id: TabId;
  label: string;
}

const TABS: Tab[] = [
  { id: "yappers", label: "Yappers" },
  { id: "tangents", label: "Tangents" },
  { id: "buzzwords", label: "Buzzwords" },
  { id: "trends", label: "Trends" },
];

// How many px the top edge is inset on each side (controls the trapezoid angle)
const INSET = 16; // px — larger = steeper angle
// How much tabs overlap each other at the bottom
const OVERLAP = 20; // px

interface FilingTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

/**
 * Returns a CSS clip-path polygon string for a symmetric trapezoid.
 * @param inset - how many px the top corners are inset from the sides
 * @param bottomInset - extra inset at the bottom (for the inner fill layer)
 * @param topInset - extra inset at the top (for the inner fill layer)
 */
function trapezoidPath(inset: number, sideInset = 0, topInset = 0, bottomInset = 0): string {
  const tl = `${inset + sideInset}px ${topInset}px`;
  const tr = `calc(100% - ${inset + sideInset}px) ${topInset}px`;
  const br = `calc(100% - ${sideInset}px) calc(100% - ${bottomInset}px)`;
  const bl = `${sideInset}px calc(100% - ${bottomInset}px)`;
  return `polygon(${tl}, ${tr}, ${br}, ${bl})`;
}

export function FilingTabs({ activeTab, onTabChange }: FilingTabsProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        position: "relative",
        // The tab row sits directly above the content border
        // Active tab will extend 2px below to cover the content border
      }}
    >
      {TABS.map((tab, i) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              // Overlap tabs at the bottom
              marginLeft: i === 0 ? 0 : -OVERLAP,
              // Active tab sits on top of inactive ones
              zIndex: isActive ? 10 : 5 - i,
              position: "relative",
              // Active tab extends 2px below to cover the content area's top border
              marginBottom: isActive ? "-2px" : "0",
              // No native border/bg — we handle it with the double-layer inside
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              outline: "none",
              // Tab dimensions
              width: 148,
              height: 48,
              flexShrink: 0,
            }}
          >
            {/* OUTER layer — the "border" (full trapezoid, ink color) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "#0A0A0A",
                clipPath: trapezoidPath(INSET),
              }}
            />

            {/* INNER layer — the "fill" (inset trapezoid, parchment color)
                Active: extends to bottom (no bottom border)
                Inactive: stops 2px from bottom (shows bottom border) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "#EDE8E1",
                clipPath: isActive
                  ? trapezoidPath(INSET, 2, 2, 0)   // no bottom border
                  : trapezoidPath(INSET, 2, 2, 1),   // 1px bottom border (matches other borders)
              }}
            />

            {/* Label — centered, on top of both layers */}
            <span
              style={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                  fontFamily: "PP Neue Montreal, Neue Montreal, Helvetica Neue, Arial, sans-serif",
                fontSize: "1rem",
                color: "#0A0A0A",
                letterSpacing: "-0.01em",
                userSelect: "none",
                paddingBottom: "2px",
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}

      {/* Right-side border line — extends from last tab to the right edge */}
      <div
        style={{
          flex: 1,
          height: 0,
          borderBottom: "2px solid #0A0A0A",
          alignSelf: "flex-end",
          position: "relative",
          zIndex: 1,
        }}
      />
    </div>
  );
}
