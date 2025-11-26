import { useParams, useNavigate } from "react-router-dom";
import { useConflict } from "@/hooks/use-conflicts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, Calendar, ArrowLeft, Loader2 } from "lucide-react";
import BackButton from "@/components/BackButton";

const ConflictDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: conflict, isLoading, error } = useConflict(id || "");

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
      Pending: "bg-muted text-muted-foreground border-muted",
    };
    return colors[status as keyof typeof colors] || "";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !conflict) {
    return (
      <div className="space-y-6">
        <BackButton fallbackPath="/conflicts" />
        <Card className="p-6 text-center border-destructive/50 bg-destructive/10">
          <p className="text-destructive">Conflict not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <BackButton fallbackPath="/conflicts" />
      
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">{conflict.id}</h1>
            <Badge className={getSeverityColor(conflict.severity)} variant="outline">
              {conflict.severity} Severity
            </Badge>
            <Badge className={getStatusColor(conflict.status)} variant="outline">
              {conflict.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">Conflict details and information</p>
        </div>
      </div>

      <Card className="glass-card p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              {conflict.type}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Species Involved</p>
                <p className="text-lg font-medium">
                  {conflict.species === "Tiger" ? "🐅" : conflict.species === "Elephant" ? "🐘" : "🦁"} {conflict.species}
                </p>
                {conflict.animal_id && (
                  <p className="text-sm text-muted-foreground mt-1">ID: {conflict.animal_id}</p>
                )}
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Location
                </p>
                <p className="text-lg font-medium">{conflict.location}</p>
                {conflict.latitude && conflict.longitude && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {conflict.latitude.toFixed(4)}° N, {conflict.longitude.toFixed(4)}° E
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Date of Incident
                </p>
                <p className="text-lg font-medium">{conflict.date}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Casualties</p>
                <p className="text-lg font-medium">{conflict.casualties || "None"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge className={getStatusColor(conflict.status)} variant="outline">
                  {conflict.status}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Severity Level</p>
                <Badge className={getSeverityColor(conflict.severity)} variant="outline">
                  {conflict.severity}
                </Badge>
              </div>
            </div>
          </div>

          {conflict.description && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Description</p>
              <p className="text-base">{conflict.description}</p>
            </div>
          )}

          {conflict.latitude && conflict.longitude && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Map Location</p>
              <div className="bg-muted rounded-lg p-4 text-center">
                <p className="text-sm">
                  <a
                    href={`https://www.google.com/maps?q=${conflict.latitude},${conflict.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View on Google Maps →
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ConflictDetail;
