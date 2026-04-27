/**
 * useDevice — detects mobile / tablet / desktop from userAgent + window.innerWidth.
 * Updates on resize and orientation change. No SSR needed.
 */
import { useEffect, useState } from "react";

export interface DeviceState {
  isMobile: boolean; // max 768px
  isTablet: boolean; // 768–1024px
  isDesktop: boolean; // 1024px+
}

function detectDevice(): DeviceState {
  if (typeof window === "undefined") {
    return { isMobile: false, isTablet: false, isDesktop: true };
  }

  const ua = navigator.userAgent;
  const isMobileUA =
    /Mobile|Android|iPhone|iPod|BlackBerry|Windows Phone/i.test(ua);
  const isTabletUA = /iPad|Tablet|Android(?!.*Mobile)/i.test(ua);
  const width = window.innerWidth;

  const isMobile = isMobileUA && !isTabletUA ? true : width < 768;
  const isTablet =
    !isMobile && (isTabletUA ? true : width >= 768 && width < 1024);
  const isDesktop = !isMobile && !isTablet;

  return { isMobile, isTablet, isDesktop };
}

export function useDevice(): DeviceState {
  const [device, setDevice] = useState<DeviceState>(detectDevice);

  useEffect(() => {
    function update() {
      setDevice(detectDevice());
    }

    window.addEventListener("resize", update, { passive: true });
    window.addEventListener("orientationchange", update, { passive: true });

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return device;
}
