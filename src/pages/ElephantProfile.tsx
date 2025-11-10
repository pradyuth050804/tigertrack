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
import { useElephant } from "@/hooks/use-elephants";
import { useNavigate } from "react-router-dom";

const ElephantProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: elephant, isLoading, error } = useElephant(id || "");
  const [selectedYear, setSelectedYear] = useState("2023");

  console.log('ElephantProfile - id:', id);
  console.log('ElephantProfile - elephant:', elephant);
  console.log('ElephantProfile - error:', error);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!elephant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-2">Elephant Not Found</h2>
        <p className="text-muted-foreground mb-4">The elephant you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/elephants")}>Back to Elephants</Button>
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
            <h1 className="text-3xl font-bold tracking-tight">{elephant.name || elephant.id}</h1>
            <Badge variant="outline">
              {elephant.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {elephant.sex}, {elephant.age_class} • {elephant.reserve}
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
          <div className="text-2xl font-bold">{elephant.weight || "Unknown"} kg</div>
          <div className="text-xs text-muted-foreground">Last recorded weight</div>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Heart className="h-4 w-4" />
            <span className="text-sm">Health Status</span>
          </div>
          <div className="text-2xl font-bold">{elephant.health_status || "Good"}</div>
          <div className="text-xs text-muted-foreground">Based on last assessment</div>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Activity className="h-4 w-4" />
            <span className="text-sm">Activity Level</span>
          </div>
          <div className="text-2xl font-bold">Normal</div>
          <div className="text-xs text-muted-foreground">Based on recent movements</div>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">Conflicts</span>
          </div>
          <div className="text-2xl font-bold">{elephant.conflicts || 0}</div>
          <div className="text-xs text-muted-foreground">Human-wildlife incidents</div>
        </Card>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Elephant Info */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Elephant Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="text-muted-foreground">Elephant ID</div>
                  <div className="font-mono font-medium">{elephant.id}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Name</div>
                  <div>{elephant.name || "Not named"}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Sex</div>
                  <div>{elephant.sex}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Age Class</div>
                  <div>{elephant.age_class}</div>
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
                  <div>{elephant.reserve}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">District</div>
                  <div>{elephant.district}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">State</div>
                  <div>{elephant.state}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Last Seen</div>
                  <div>{elephant.last_seen}</div>
                </div>
              </div>
              <div className="pt-2">
                <div className="text-muted-foreground text-sm mb-1">Current Location</div>
                <Button variant="outline" className="w-full">
                  <MapPin className="h-4 w-4 mr-2" />
                  {elephant.coordinates}
                </Button>
              </div>
            </div>
          </Card>

          {/* Collar Info */}
          {elephant.collared && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Collar Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Collar ID</div>
                    <div className="font-mono font-medium">{elephant.collar_id}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Battery Level</div>
                    <div>{elephant.battery}%</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Signal Strength</div>
                    <div>{elephant.signal}</div>
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
                  <p className="text-sm">Left Side</p>
                </div>
              </div>
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Right Side</p>
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

export default ElephantProfile;