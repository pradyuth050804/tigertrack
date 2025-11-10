import { useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, MapPin, Activity, Heart, Scale, Clock, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTiger } from "@/hooks/use-tigers";
import { useNavigate } from "react-router-dom";

const TigerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: tiger, isLoading, error } = useTiger(id || "");
  const [selectedYear, setSelectedYear] = useState("2023");

  console.log('TigerProfile - id:', id);
  console.log('TigerProfile - tiger:', tiger);
  console.log('TigerProfile - error:', error);

  const getStatusColor = (status: string) => {
    const colors = {
      Alive: "bg-secondary/10 text-secondary border-secondary/20",
      Monitoring: "bg-warning/10 text-warning border-warning/20",
      Missing: "bg-destructive/10 text-destructive border-destructive/20",
      Dead: "bg-muted text-muted-foreground border-muted",
    };
    return colors[status as keyof typeof colors] || colors.Alive;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!tiger) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-2">Tiger Not Found</h2>
        <p className="text-muted-foreground mb-4">The tiger you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/tigers")}>Back to Tigers</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{tiger.name || tiger.id}</h1>
            <Badge className={getStatusColor(tiger.status)} variant="outline">
              {tiger.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {tiger.sex}, {tiger.age_class} • {tiger.reserve}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Scale className="h-4 w-4" />
            <span className="text-sm">Weight</span>
          </div>
          <div className="text-2xl font-bold">135 kg</div>
          <div className="text-xs text-muted-foreground">Last recorded Jan 2025</div>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Heart className="h-4 w-4" />
            <span className="text-sm">Health Status</span>
          </div>
          <div className="text-2xl font-bold">Excellent</div>
          <div className="text-xs text-muted-foreground">Regular checkups done</div>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Activity className="h-4 w-4" />
            <span className="text-sm">Activity Level</span>
          </div>
          <div className="text-2xl font-bold">High</div>
          <div className="text-xs text-muted-foreground">Based on recent movements</div>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">Conflicts</span>
          </div>
          <div className="text-2xl font-bold">{tiger.conflicts || 0}</div>
          <div className="text-xs text-muted-foreground">Human-wildlife incidents</div>
        </Card>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Tiger Info */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Tiger Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="text-muted-foreground">Tiger ID</div>
                  <div className="font-mono font-medium">{tiger.id}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Stripe Match ID</div>
                  <div className="font-mono font-medium">{tiger.stripe_match_id || "N/A"}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Match Confidence</div>
                  <div>{tiger.confidence ? `${tiger.confidence}%` : "N/A"}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Images Available</div>
                  <div>{tiger.image_count}</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Location Info */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Location Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="text-muted-foreground">Reserve</div>
                  <div>{tiger.reserve}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">District</div>
                  <div>{tiger.district}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">State</div>
                  <div>{tiger.state}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Last Seen</div>
                  <div>{tiger.last_seen}</div>
                </div>
              </div>
              <div className="pt-2">
                <div className="text-muted-foreground text-sm mb-1">Current Location</div>
                <Button variant="outline" className="w-full">
                  <MapPin className="h-4 w-4 mr-2" />
                  {tiger.coordinates}
                </Button>
              </div>
            </div>
          </Card>

          {/* Collar Info */}
          {tiger.collared && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Collar Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Collar ID</div>
                    <div className="font-mono font-medium">{tiger.collar_id}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Battery Level</div>
                    <div>{tiger.battery}%</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Signal Strength</div>
                    <div>{tiger.signal}</div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Reference Images */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Reference Images</h2>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Left Flank</p>
                </div>
              </div>
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Right Flank</p>
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Select a year to view historical images
            </div>
          </Card>

          {/* Movement Map */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Movement History</h2>
            <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Map view will be displayed here</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TigerProfile;