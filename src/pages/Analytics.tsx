import { Card } from "@/components/ui/card";
import { TrendingUp, Users, AlertTriangle, Activity } from "lucide-react";
import StatCard from "@/components/StatCard";
import FilterBar from "@/components/FilterBar";

const Analytics = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Analytics & Trends</h1>
        <p className="text-muted-foreground">Wildlife population trends and movement patterns</p>
      </div>

      <FilterBar />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Population Growth"
          value="+5.8%"
          icon={TrendingUp}
          trend="Year over year"
          trendUp={true}
          variant="default"
        />
        <StatCard
          title="Active Reserves"
          value="52"
          icon={Users}
          trend="Across all states"
          trendUp={true}
          variant="tiger"
        />
        <StatCard
          title="Conflict Incidents"
          value="156"
          icon={AlertTriangle}
          trend="-12% from last quarter"
          trendUp={true}
          variant="warning"
        />
        <StatCard
          title="Tracking Coverage"
          value="87%"
          icon={Activity}
          trend="Of protected areas"
          trendUp={true}
          variant="elephant"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">Population Trends (2020-2024)</h2>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Chart visualization will be displayed here</p>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">Movement Heatmap</h2>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Movement patterns will be visualized here</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4">Conflict Incident Trends</h2>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Conflict data visualization coming soon</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
