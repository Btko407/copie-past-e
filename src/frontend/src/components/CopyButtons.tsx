import { Button } from "@/components/ui/button";
import { useAdminSettingsContext } from "@/hooks/useAdminSettings";
import { AlignLeft, Copy, FileText } from "lucide-react";
import { useCallback, useState } from "react";
import { copyText } from "../utils/copyText";

interface CopyButtonsProps {
  title: string;
  description: string;
  price?: string;
}

// ─── Animated Button State ────────────────────────────────────────────────────

type BtnState = "idle" | "loading" | "success" | "error";

interface AnimatedBtnState {
  state: BtnState;
  label: string;
}

function useAnimatedButton(idleLabel: string, successLabel: string) {
  const [btnState, setBtnState] = useState<AnimatedBtnState>({
    state: "idle",
    label: idleLabel,
  });

  const run = useCallback(
    async (action: () => Promise<void>) => {
      setBtnState({ state: "loading", label: successLabel });
      try {
        await action();
        setBtnState({ state: "success", label: successLabel });
      } catch {
        setBtnState({ state: "error", label: "Failed — Try Again" });
      } finally {
        setTimeout(() => {
          setBtnState({ state: "idle", label: idleLabel });
        }, 1500);
      }
    },
    [idleLabel, successLabel],
  );

  return { btnState, run };
}

// ─── Animated Button Classes ──────────────────────────────────────────────────

function getAnimatedClass(state: BtnState, baseClass: string): string {
  if (state === "loading" || state === "success") {
    return `${baseClass} animate-lightning opacity-90`;
  }
  if (state === "error") {
    return "neon-border-red glow-red hover:glow-red transition-smooth font-mono text-xs uppercase tracking-wider text-destructive animate-pulse";
  }
  return baseClass;
}

export function CopyButtons({ title, description, price }: CopyButtonsProps) {
  const { copyButtonsEnabled } = useAdminSettingsContext();

  // Per-button animated states
  const titleBtn = useAnimatedButton("Copy Title", "Copied!");
  const descBtn = useAnimatedButton("Copy Description", "Copied!");
  const fullPostBtn = useAnimatedButton("Copy Full Post", "Copied!");

  if (!copyButtonsEnabled) return null;

  const fullPost = [title, price, description].filter(Boolean).join("\n");

  return (
    <>
      <div className="flex flex-wrap gap-3" data-ocid="copy-buttons-section">
        {/* Copy Title */}
        <Button
          variant="outline"
          size="sm"
          disabled={titleBtn.btnState.state !== "idle"}
          className={getAnimatedClass(
            titleBtn.btnState.state,
            "neon-border-blue hover:glow-blue-sm transition-smooth font-mono text-xs uppercase tracking-wider",
          )}
          onClick={() =>
            titleBtn.run(async () => {
              await copyText(title);
            })
          }
          data-ocid="copy-title-btn"
        >
          {titleBtn.btnState.state === "loading" ||
          titleBtn.btnState.state === "success" ? (
            <span className="mr-1.5">⚡</span>
          ) : (
            <Copy className="w-3.5 h-3.5 mr-1.5" />
          )}
          {titleBtn.btnState.label}
        </Button>

        {/* Copy Description */}
        <Button
          variant="outline"
          size="sm"
          disabled={descBtn.btnState.state !== "idle"}
          className={getAnimatedClass(
            descBtn.btnState.state,
            "neon-border-blue hover:glow-blue-sm transition-smooth font-mono text-xs uppercase tracking-wider",
          )}
          onClick={() =>
            descBtn.run(async () => {
              await copyText(description);
            })
          }
          data-ocid="copy-description-btn"
        >
          {descBtn.btnState.state === "loading" ||
          descBtn.btnState.state === "success" ? (
            <span className="mr-1.5">⚡</span>
          ) : (
            <AlignLeft className="w-3.5 h-3.5 mr-1.5" />
          )}
          {descBtn.btnState.label}
        </Button>

        {/* Copy Full Post */}
        <Button
          variant="outline"
          size="sm"
          disabled={fullPostBtn.btnState.state !== "idle"}
          className={getAnimatedClass(
            fullPostBtn.btnState.state,
            "neon-border-yellow hover:glow-yellow-sm transition-smooth font-mono text-xs uppercase tracking-wider text-accent",
          )}
          onClick={() =>
            fullPostBtn.run(async () => {
              await copyText(fullPost);
            })
          }
          data-ocid="copy-full-post-btn"
        >
          {fullPostBtn.btnState.state === "loading" ||
          fullPostBtn.btnState.state === "success" ? (
            <span className="mr-1.5">⚡</span>
          ) : (
            <FileText className="w-3.5 h-3.5 mr-1.5" />
          )}
          {fullPostBtn.btnState.label}
        </Button>
      </div>
    </>
  );
}
