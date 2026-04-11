import { ImportForm } from "@/components/ImportForm";
import { Layout } from "@/components/Layout";
import { useAdminSettingsContext } from "@/hooks/useAdminSettings";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";

export function ImportPage() {
  const navigate = useNavigate();
  const { uploadEnabled } = useAdminSettingsContext();

  const handleCancel = () => {
    navigate({ to: "/dashboard" });
  };

  if (!uploadEnabled) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="font-display text-2xl font-bold text-muted-foreground text-glow-blue mb-3 uppercase tracking-wider">
              Uploads Disabled
            </p>
            <p className="font-mono text-sm text-muted-foreground">
              The site administrator has temporarily disabled uploads. Check
              back later.
            </p>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        className="max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full"
        data-ocid="import-page"
      >
        {/* Page header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <h1 className="font-display text-3xl font-bold tracking-wider text-foreground text-glow-blue mb-2">
            New Listing
          </h1>
          <p className="text-muted-foreground text-sm">
            Upload a screenshot, paste listing text, or enter everything
            manually. Copie Past-e fills in the details. Under 30 seconds.
          </p>

          {/* Decorative neon divider */}
          <div className="mt-4 h-px w-full bg-gradient-to-r from-primary/60 via-accent/40 to-transparent" />
        </motion.div>

        {/* Form card */}
        <motion.div
          className="bg-card rounded-xl neon-border-blue p-5 sm:p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          style={{
            boxShadow:
              "0 0 40px oklch(0.65 0.22 262 / 0.08), 0 8px 32px oklch(0 0 0 / 0.4)",
          }}
        >
          <ImportForm onCancel={handleCancel} />
        </motion.div>

        {/* Retro grid accent */}
        <div
          className="fixed inset-0 -z-10 opacity-30 pointer-events-none retro-grid"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent, oklch(0 0 0 / 0.6))",
          }}
        />
      </div>
    </Layout>
  );
}
