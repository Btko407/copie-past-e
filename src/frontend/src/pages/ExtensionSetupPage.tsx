/**
 * ExtensionSetupPage — Chrome extension download + Driver.js interactive tour.
 *
 * Tour steps target IDs:
 *   #download-zip-button, #chrome-extensions-link, #developer-mode-step, #load-unpacked-step
 *
 * Tour completion stored in localStorage('extension_tour_completed').
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isMobile } from "@/hooks/useExtension";
import { Link } from "@tanstack/react-router";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Chrome,
  Download,
  ExternalLink,
  MonitorSpeaker,
  Puzzle,
  ToggleRight,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

// ─── Platform injection info ──────────────────────────────────────────────────

const PLATFORM_DEMOS = [
  {
    name: "Facebook",
    color: "border-blue-500/40 bg-blue-950/30",
    fields: [
      "Title (200 chars)",
      "Condition",
      "Location",
      "Category",
      "Price",
      "Local Pickup",
    ],
  },
  {
    name: "Mercari",
    color: "border-pink-500/40 bg-pink-950/30",
    fields: [
      "Title (80 chars)",
      "Brand",
      "Condition (1–5)",
      "Shipping Type",
      "Delivery Days",
      "Category",
    ],
  },
  {
    name: "eBay",
    color: "border-red-500/40 bg-red-950/30",
    fields: [
      "Title (80 chars)",
      "Condition ID",
      "Price",
      "Quantity",
      "Listing Type",
      "Shipping Service",
    ],
  },
  {
    name: "Poshmark",
    color: "border-rose-500/40 bg-rose-950/30",
    fields: [
      "Title (141 chars)",
      "Brand",
      "Size",
      "Department",
      "Color",
      "Original Price",
    ],
  },
  {
    name: "Depop",
    color: "border-orange-500/40 bg-orange-950/30",
    fields: [
      "Title (70 chars)",
      "Condition",
      "Color",
      "Brand",
      "Size",
      "Gender",
    ],
  },
  {
    name: "Etsy",
    color: "border-amber-500/40 bg-amber-950/30",
    fields: [
      "Title (140 chars)",
      "Tags (×13)",
      "Materials",
      "Who Made",
      "When Made",
      "Is Supply",
    ],
  },
];

// ─── Steps (static info — tour targets IDs in DOM) ───────────────────────────

const STEPS = [
  {
    number: "01",
    icon: Download,
    id: "download-zip-button",
    title: "Download the Extension",
    description:
      'Click "DOWNLOAD EXTENSION (.ZIP)" to save the archive to your computer.',
    color: "text-primary",
    glowClass: "glow-blue-sm neon-border-blue",
    tourTitle: "Step 1 — Download",
    tourDesc:
      "Click here to download the Copie Past-e extension as a .zip file.",
  },
  {
    number: "02",
    icon: Chrome,
    id: "chrome-extensions-link",
    title: "Open Chrome Extensions",
    description: "Navigate to chrome://extensions in your Chrome browser.",
    color: "text-accent",
    glowClass: "glow-yellow-sm neon-border-yellow",
    tourTitle: "Step 2 — Chrome Extensions",
    tourDesc:
      "Open chrome://extensions (or click the puzzle icon → Manage Extensions).",
  },
  {
    number: "03",
    icon: ToggleRight,
    id: "developer-mode-step",
    title: "Enable Developer Mode",
    description:
      'Toggle "Developer mode" ON in the top-right corner of the Extensions page.',
    color: "text-primary",
    glowClass: "glow-blue-sm neon-border-blue",
    tourTitle: "Step 3 — Developer Mode",
    tourDesc:
      'Toggle "Developer mode" in the top-right corner. The switch turns blue when active.',
  },
  {
    number: "04",
    icon: MonitorSpeaker,
    id: "load-unpacked-step",
    title: "Load Unpacked Folder",
    description:
      'Click "Load unpacked", select the unzipped folder. The icon appears in your toolbar.',
    color: "text-accent",
    glowClass: "glow-yellow-sm neon-border-yellow",
    tourTitle: "Step 4 — Load Unpacked",
    tourDesc:
      'Click "Load unpacked" and select the unzipped extension folder. Done!',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function ExtensionSetupPage() {
  const mobile = isMobile();
  const [activeStep, setActiveStep] = useState(0);
  const [downloaded, setDownloaded] = useState(false);
  const [tourCompleted, setTourCompleted] = useState(() => {
    try {
      return localStorage.getItem("extension_tour_completed") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (downloaded && activeStep === 0) setActiveStep(1);
  }, [downloaded, activeStep]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/assets/extension/copie-paste-extension.zip";
    link.download = "copie-paste-extension.zip";
    link.click();
    setDownloaded(true);
    setActiveStep(1);
  };

  const startTour = useCallback(() => {
    const driverInstance = driver({
      animate: true,
      showProgress: true,
      steps: STEPS.map((step) => ({
        element: `#${step.id}`,
        popover: {
          title: step.tourTitle,
          description: step.tourDesc,
          side: "bottom" as const,
        },
      })),
      onDestroyStarted: () => {
        driverInstance.destroy();
        try {
          localStorage.setItem("extension_tour_completed", "true");
        } catch {
          /* ignore */
        }
        setTourCompleted(true);
      },
    });

    driverInstance.drive();
  }, []);

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="extension-setup.page"
    >
      {/* Background */}
      <div className="fixed inset-0 retro-grid opacity-30 pointer-events-none" />
      <div className="fixed inset-0 scanlines opacity-20 pointer-events-none" />
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-primary/5 blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full bg-card border-b border-primary/20 py-4 px-6 flex items-center gap-4">
        <Link to="/" data-ocid="extension-setup.back_link">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" strokeWidth={2.5} />
          <span className="font-display text-xl font-bold text-primary text-glow-blue tracking-wide">
            COPIE PAST-E
          </span>
        </div>
        <Badge className="ml-auto bg-accent/20 text-accent border-accent/40 font-mono text-xs">
          EXPANSION MODULE
        </Badge>
      </header>

      <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-4 py-10 space-y-16">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
          data-ocid="extension-setup.hero_section"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5">
            <Puzzle className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs text-primary tracking-widest uppercase">
              Chrome Extension Setup
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground tracking-tight text-glow-blue">
            INSTALL THE AUTOFILL MODULE
          </h1>
          <p className="text-muted-foreground font-body max-w-xl mx-auto leading-relaxed">
            The Copie Past-e extension injects your saved listings directly into
            marketplace forms across all 6 platforms — zero copy-paste required.
          </p>
          {mobile && (
            <div
              className="inline-flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded px-4 py-2 mt-2"
              data-ocid="extension-setup.mobile_warning"
            >
              <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
              <span className="font-mono text-xs text-destructive">
                Mobile detected — extension requires Chrome desktop
              </span>
            </div>
          )}
        </motion.section>

        {/* Download CTA */}
        {!mobile && (
          <motion.section
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            data-ocid="extension-setup.download_section"
          >
            <Button
              id="download-zip-button"
              onClick={handleDownload}
              size="lg"
              className="gap-3 bg-primary text-primary-foreground hover:bg-primary/90 font-display tracking-widest text-sm uppercase glow-blue neon-border-blue h-14 px-8 transition-smooth"
              data-ocid="extension-setup.download_button"
            >
              <Download className="w-5 h-5" />
              Download Extension (.zip)
            </Button>

            <Button
              variant="outline"
              size="lg"
              asChild
              className="gap-3 border-border/50 text-muted-foreground hover:text-foreground h-14 px-8"
              data-ocid="extension-setup.webstore_button"
            >
              <a
                id="chrome-extensions-link"
                href="https://chrome.google.com/webstore"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4" />
                Chrome Web Store (Pending Review)
              </a>
            </Button>

            {/* Start interactive tour */}
            <Button
              variant="outline"
              size="lg"
              onClick={startTour}
              className="gap-3 border-accent/40 text-accent hover:bg-accent/10 h-14 px-6 font-mono text-xs tracking-widest uppercase"
              data-ocid="extension-setup.start_tour_button"
            >
              {tourCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Replay Tour
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Start Tour
                </>
              )}
            </Button>

            {downloaded && (
              <div
                className="flex items-center gap-2 text-green-400 font-mono text-sm"
                data-ocid="extension-setup.download_success"
              >
                <CheckCircle2 className="w-4 h-4" />
                Downloaded!
              </div>
            )}
          </motion.section>
        )}

        {/* Sideloading guide */}
        {!mobile && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            data-ocid="extension-setup.steps_section"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl font-bold text-foreground tracking-wide">
                SIDELOADING GUIDE
              </h2>
              {tourCompleted && (
                <Badge className="bg-green-400/20 text-green-400 border-green-400/40 font-mono text-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Tour Complete
                </Badge>
              )}
            </div>

            <div className="space-y-4">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                const isActive = i === activeStep;
                const isDone = i < activeStep;
                return (
                  <motion.div
                    key={step.number}
                    id={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    onClick={() => setActiveStep(i)}
                    className={`cursor-pointer rounded-lg p-5 flex items-start gap-5 transition-smooth border ${
                      isActive
                        ? `bg-card ${step.glowClass}`
                        : isDone
                          ? "bg-card/40 border-green-400/20"
                          : "bg-card/20 border-border/30 hover:border-border/60"
                    }`}
                    data-ocid={`extension-setup.step.${i + 1}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 font-mono text-sm font-bold ${
                        isDone
                          ? "border-green-400/50 bg-green-400/10 text-green-400"
                          : isActive
                            ? `border-current ${step.color} bg-current/10`
                            : "border-border/40 text-muted-foreground"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        step.number
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <Icon
                          className={`w-4 h-4 ${isActive ? step.color : "text-muted-foreground"}`}
                        />
                        <h3
                          className={`font-display text-sm font-bold tracking-wide ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {step.title}
                        </h3>
                        {isActive && (
                          <Badge className="bg-accent/20 text-accent border-accent/40 text-xs font-mono">
                            CURRENT
                          </Badge>
                        )}
                      </div>
                      <p
                        className={`font-body text-sm leading-relaxed ${isActive ? "text-foreground/80" : "text-muted-foreground/60"}`}
                      >
                        {step.description}
                      </p>
                      {i === 0 && isActive && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload();
                          }}
                          size="sm"
                          className="mt-3 gap-2 bg-primary text-primary-foreground text-xs font-mono"
                          data-ocid="extension-setup.step_download_button"
                        >
                          <Download className="w-3 h-3" />
                          Download Now
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* Dummy anchor targets for Driver.js */}
        <div className="sr-only">
          <span id="developer-mode-step" aria-hidden="true" />
          <span id="load-unpacked-step" aria-hidden="true" />
        </div>

        {/* Platform injection demo */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          data-ocid="extension-setup.platforms_section"
        >
          <h2 className="font-display text-2xl font-bold text-foreground mb-2 tracking-wide">
            SUPPORTED PLATFORMS
          </h2>
          <p className="text-muted-foreground font-body text-sm mb-8">
            Full field mapping for all 6 marketplaces — every required field
            autofilled.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PLATFORM_DEMOS.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`rounded-lg p-4 space-y-3 border ${p.color}`}
                data-ocid={`extension-setup.platform.${i + 1}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-bold text-foreground tracking-wide">
                    {p.name}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                </div>
                <div className="space-y-1">
                  {p.fields.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-primary/60 shrink-0" />
                      <span className="font-mono text-xs text-muted-foreground">
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center pb-8"
        >
          <Link to="/dashboard" data-ocid="extension-setup.dashboard_link">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-primary/30 text-primary hover:bg-primary/10 font-mono tracking-widest uppercase text-sm"
            >
              <Zap className="w-4 h-4" />
              Proceed to Dashboard
            </Button>
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-card border-t border-border/40 py-4 px-6">
        <p className="text-center text-muted-foreground text-xs font-body">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-accent transition-smooth hover:underline underline-offset-2"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
