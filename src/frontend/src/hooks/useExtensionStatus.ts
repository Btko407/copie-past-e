/**
 * useExtensionStatus — polls window.__COPIE_PASTE_INSTALLED__ on mount,
 * on window focus, and every 30 seconds. Desktop-only: returns false on mobile
 * without any detection logic. Non-blocking, no console noise.
 */
import { useEffect, useState } from "react";
import { useDevice } from "./useDevice";

function readFlag(): boolean {
  try {
    return (
      (window as unknown as Record<string, unknown>)
        .__COPIE_PASTE_INSTALLED__ === true
    );
  } catch {
    return false;
  }
}

export function useExtensionStatus(): { extensionInstalled: boolean } {
  const { isMobile } = useDevice();

  const [extensionInstalled, setExtensionInstalled] = useState<boolean>(() => {
    if (isMobile) return false;
    return readFlag();
  });

  useEffect(() => {
    // Mobile: skip entirely
    if (isMobile) {
      setExtensionInstalled(false);
      return;
    }

    // Check immediately
    setExtensionInstalled(readFlag());

    // Check on window focus (user may install extension while browsing)
    function onFocus() {
      setExtensionInstalled(readFlag());
    }

    // Check every 30 seconds
    const interval = setInterval(() => {
      setExtensionInstalled(readFlag());
    }, 30_000);

    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [isMobile]);

  return { extensionInstalled };
}
