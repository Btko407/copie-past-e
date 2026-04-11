import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Zap } from "lucide-react";
import { motion } from "motion/react";

export function NotFoundPage() {
  return (
    <Layout>
      <div
        className="flex-1 flex items-center justify-center px-4 py-16"
        data-ocid="not-found-page"
      >
        {/* Background grid */}
        <div className="fixed inset-0 retro-grid opacity-20 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-center max-w-md mx-auto"
        >
          {/* Glitch 404 */}
          <div className="mb-6">
            <h1 className="font-display text-9xl font-black text-primary/20 select-none tracking-tight leading-none">
              404
            </h1>
            <div className="relative -mt-8">
              <Zap className="mx-auto w-12 h-12 text-primary text-glow-blue animate-pulse" />
            </div>
          </div>

          <h2 className="font-display text-2xl font-bold text-foreground tracking-wider mb-3">
            SIGNAL LOST
          </h2>
          <p className="text-muted-foreground font-body text-sm mb-8 leading-relaxed">
            This timeline doesn't exist. The listing you're looking for may have
            been deleted or never created.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/dashboard">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-display text-xs font-bold tracking-widest uppercase glow-blue transition-smooth"
                data-ocid="not-found-dashboard-btn"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <Link to="/">
              <Button
                variant="outline"
                className="neon-border-blue text-primary hover:bg-primary/10 font-display text-xs font-bold tracking-widest uppercase transition-smooth"
              >
                Go Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
