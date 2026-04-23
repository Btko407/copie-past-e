import { createActor } from "@/backend";
import { Layout } from "@/components/Layout";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, Eye, ShoppingCart, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Local types ──────────────────────────────────────────────────────────────

interface UniversalListing {
  metrics: {
    totalViews: bigint;
    totalLikes: bigint;
    totalOffers: bigint;
    totalSales: bigint;
    viewsPerPlatform: Array<[string, bigint]>;
    likesPerPlatform: Array<[string, bigint]>;
    offersPerPlatform: Array<[string, bigint]>;
    salesPerPlatform: Array<[string, bigint]>;
  };
  price: [] | [string];
  quantitySold: bigint;
  targetPlatforms: Array<{ platform: string; status: unknown }>;
  status: unknown;
}

interface PlatformStat {
  platform: string;
  views: number;
  sales: number;
}

const COLORS = [
  "#3b82f6",
  "#ec4899",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f59e0b",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPlatformSummary(listings: UniversalListing[]): PlatformStat[] {
  const map = new Map<string, PlatformStat>();

  for (const listing of listings) {
    for (const target of listing.targetPlatforms) {
      const name = target.platform;
      if (!map.has(name)) {
        map.set(name, { platform: name, views: 0, sales: 0 });
      }
      const entry = map.get(name)!;

      const viewEntry = listing.metrics.viewsPerPlatform.find(
        ([p]) => p === name,
      );
      const saleEntry = listing.metrics.salesPerPlatform.find(
        ([p]) => p === name,
      );

      entry.views += viewEntry ? Number(viewEntry[1]) : 0;
      entry.sales += saleEntry ? Number(saleEntry[1]) : 0;
    }
  }

  return Array.from(map.values());
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  borderColor: string;
}

function KpiCard({ label, value, icon, borderColor }: KpiCardProps) {
  return (
    <div className={`bg-card p-4 rounded-lg border ${borderColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold mt-1 text-foreground">{value}</p>
        </div>
        <div className="opacity-60">{icon}</div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function CrossListingAnalyticsPage() {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  const { data: listings = [], isLoading } = useQuery<UniversalListing[]>({
    queryKey: ["universalListings"],
    queryFn: async () => {
      if (!actor) return [];
      return (
        actor as unknown as {
          getUserUniversalListings: () => Promise<UniversalListing[]>;
        }
      ).getUserUniversalListings();
    },
    enabled: !!actor && !actorFetching,
  });

  // ── Aggregations ────────────────────────────────────────────────────────────
  const totalViews = listings.reduce(
    (sum, l) => sum + Number(l.metrics.totalViews),
    0,
  );
  const totalSales = listings.reduce(
    (sum, l) => sum + Number(l.metrics.totalSales),
    0,
  );
  const totalRevenue = listings.reduce((sum, l) => {
    const price = l.price.length > 0 ? Number.parseFloat(l.price[0] ?? "0") : 0;
    return sum + price * Number(l.quantitySold);
  }, 0);
  const activeListings = listings.length;

  const platformSummary = getPlatformSummary(listings);

  // ── Empty state ─────────────────────────────────────────────────────────────
  const isEmpty = !isLoading && listings.length === 0;

  return (
    <Layout>
      <div
        className="max-w-7xl mx-auto px-4 py-6 space-y-6"
        data-ocid="cross-listing-analytics.page"
      >
        {/* Page title */}
        <h1 className="text-3xl font-bold flex items-center gap-2 text-foreground font-display">
          <TrendingUp className="h-8 w-8 text-primary" />
          Cross-Listing Analytics
        </h1>

        {isEmpty ? (
          /* Empty state */
          <div
            className="flex flex-col items-center justify-center py-24 gap-4 text-center"
            data-ocid="cross-listing-analytics.empty_state"
          >
            <TrendingUp className="h-16 w-16 text-muted-foreground/30" />
            <p className="text-xl font-semibold text-muted-foreground">
              No cross-listings yet
            </p>
            <p className="text-sm text-muted-foreground/70 max-w-xs">
              Create a universal listing from the dashboard to start tracking
              performance across platforms.
            </p>
          </div>
        ) : (
          <>
            {/* KPI cards */}
            <div
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
              data-ocid="cross-listing-analytics.section"
            >
              <KpiCard
                label="Total Views"
                value={totalViews.toLocaleString()}
                icon={<Eye className="h-8 w-8 text-primary" />}
                borderColor="border-primary/20"
              />
              <KpiCard
                label="Total Sales"
                value={totalSales.toLocaleString()}
                icon={<ShoppingCart className="h-8 w-8 text-accent" />}
                borderColor="border-accent/20"
              />
              <KpiCard
                label="Total Revenue"
                value={`$${totalRevenue.toFixed(2)}`}
                icon={<DollarSign className="h-8 w-8 text-green-500" />}
                borderColor="border-green-500/20"
              />
              <KpiCard
                label="Active Listings"
                value={activeListings.toLocaleString()}
                icon={<TrendingUp className="h-8 w-8 text-primary" />}
                borderColor="border-primary/20"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales by Platform */}
              <div className="bg-card p-6 rounded-lg border border-border/40">
                <h2 className="font-bold text-lg mb-4 text-foreground">
                  Sales by Platform
                </h2>
                {platformSummary.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={platformSummary}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.08)"
                      />
                      <XAxis
                        dataKey="platform"
                        tick={{
                          fill: "oklch(var(--muted-foreground))",
                          fontSize: 12,
                        }}
                        axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                      />
                      <YAxis
                        tick={{
                          fill: "oklch(var(--muted-foreground))",
                          fontSize: 12,
                        }}
                        axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(var(--card))",
                          border: "1px solid oklch(var(--border))",
                          borderRadius: "6px",
                          color: "oklch(var(--foreground))",
                        }}
                      />
                      <Bar
                        dataKey="sales"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground/50 text-sm">
                    No platform data
                  </div>
                )}
              </div>

              {/* View Distribution */}
              <div className="bg-card p-6 rounded-lg border border-border/40">
                <h2 className="font-bold text-lg mb-4 text-foreground">
                  View Distribution
                </h2>
                {platformSummary.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={platformSummary}
                        dataKey="views"
                        nameKey="platform"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ platform }) => platform}
                        labelLine={{ stroke: "rgba(255,255,255,0.3)" }}
                      >
                        {platformSummary.map((entry, index) => (
                          <Cell
                            key={entry.platform}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(var(--card))",
                          border: "1px solid oklch(var(--border))",
                          borderRadius: "6px",
                          color: "oklch(var(--foreground))",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground/50 text-sm">
                    No platform data
                  </div>
                )}
              </div>
            </div>

            {/* Platform details table */}
            <div
              className="bg-card rounded-lg border border-border/40 overflow-hidden"
              data-ocid="cross-listing-analytics.table"
            >
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-secondary/50">
                    <th className="px-4 py-3 text-left font-semibold text-foreground">
                      Platform
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-foreground">
                      Views
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-foreground">
                      Sales
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-foreground">
                      Conversion
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {platformSummary.map((platform, i) => (
                    <tr
                      key={platform.platform}
                      className="border-b border-border/20 hover:bg-secondary/20 transition-colors"
                      data-ocid={`cross-listing-analytics.row.${i + 1}`}
                    >
                      <td className="px-4 py-3 font-semibold text-foreground capitalize">
                        {platform.platform}
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground">
                        {platform.views.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground">
                        {platform.sales}
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground">
                        {platform.views > 0
                          ? `${((platform.sales / platform.views) * 100).toFixed(2)}%`
                          : "0%"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
