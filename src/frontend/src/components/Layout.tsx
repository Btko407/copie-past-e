import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export function Layout({ children, showNav = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showNav && <Navbar />}
      <main className="flex-1 flex flex-col">{children}</main>
      <footer className="bg-card/60 border-t border-border/50 py-4 px-6">
        <p className="text-center text-muted-foreground text-xs font-body">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-accent transition-smooth underline-offset-2 hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: "bg-card border-primary/30 text-foreground font-body",
            title: "text-foreground",
            description: "text-muted-foreground",
          },
        }}
      />
    </div>
  );
}
