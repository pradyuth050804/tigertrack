import { AlertTriangle, MapPin, Calendar, Eye, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FilterBar from "@/components/FilterBar";
import { useConflicts } from "@/hooks/use-conflicts";
import { useState } from "react";
import type { FilterParams } from "@/types";

const Conflicts = () => {
  const [filters, setFilters] = useState<FilterParams>({});
  const { data: conflicts = [], isLoading, error } = useConflicts(filters);

  const getSeverityColor = (severity: string) => {
    const colors = {
      High: "bg-destructive/10 text-destructive border-destructive/20",
      Medium: "bg-warning/10 text-warning border-warning/20",
      Low: "bg-muted text-muted-foreground border-muted",
    };
    return colors[severity as keyof typeof colors] || colors.Low;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      Resolved: "bg-secondary/10 text-secondary border-secondary/20",
      "Under Investigation": "bg-warning/10 text-warning border-warning/20",
      Compensated: "bg-primary/10 text-primary border-primary/20",
    };
    return colors[status as keyof typeof colors] || "";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Conflict Reports</h1>
        <p className="text-muted-foreground">Human-wildlife conflict tracking and management</p>
      </div>

      <FilterBar />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-destructive">Error loading conflict data. Using mock data.</p>
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass-card p-6 border-l-4 border-l-destructive">
          <div className="flex items-start justify-between mb-2">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <Badge variant="destructive">High Priority</Badge>
          </div>
          <p className="text-3xl font-bold">5</p>
          <p className="text-sm text-muted-foreground mt-1">Active high-severity cases</p>
        </Card>

        <Card className="glass-card p-6 border-l-4 border-l-warning">
          <div className="flex items-start justify-between mb-2">
            <AlertTriangle className="h-8 w-8 text-warning" />
            <Badge className="bg-warning/10 text-warning border-warning/20">Medium</Badge>
          </div>
          <p className="text-3xl font-bold">12</p>
          <p className="text-sm text-muted-foreground mt-1">Under investigation</p>
        </Card>

        <Card className="glass-card p-6 border-l-4 border-l-secondary">
          <div className="flex items-start justify-between mb-2">
            <AlertTriangle className="h-8 w-8 text-secondary" />
            <Badge className="bg-secondary/10 text-secondary border-secondary/20">Resolved</Badge>
          </div>
          <p className="text-3xl font-bold">143</p>
          <p className="text-sm text-muted-foreground mt-1">This year</p>
        </Card>
      </div>

      <div className="space-y-4">
        {conflicts.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">No conflicts found</p>
          </Card>
        ) : (
          conflicts.map((conflict) => (
          <Card key={conflict.id} className="glass-card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-semibold">{conflict.id}</span>
                  <Badge className={getSeverityColor(conflict.severity)} variant="outline">
                    {conflict.severity} Severity
                  </Badge>
                  <Badge className={getStatusColor(conflict.status)} variant="outline">
                    {conflict.status}
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold">{conflict.type}</h3>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Species Involved</p>
                <p className="font-medium">
                  {conflict.species === "Tiger" ? "🐅" : "🐘"} {conflict.species}
                </p>
                <p className="text-sm text-muted-foreground">{conflict.animal_id || "-"}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Location
                </p>
                <p className="font-medium text-sm">{conflict.location}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Date
                </p>
                <p className="font-medium">{conflict.date}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Casualties</p>
                <p className="font-medium">{conflict.casualties || "None"}</p>
              </div>
            </div>
          </Card>
          ))
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>Showing {conflicts.length} of {conflicts.length} total incidents</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
};

export default Conflicts;
