import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Radio, AlertTriangle, Eye, Key, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAnimalLocations } from "@/hooks/use-locations";

const MapView = () => {
  const [apiKey, setApiKey] = useState("");
  const [hasApiKey, setHasApiKey] = useState(false);
  
  const { data: markers = [], isLoading } = useAnimalLocations();

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      setHasApiKey(true);
      // In a real app, this would be saved to settings/backend
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Live Map View</h1>
        <p className="text-muted-foreground">Real-time tracking of collared animals across India</p>
      </div>

      {!hasApiKey ? (
        <Alert className="border-warning/50 bg-warning/5">
          <Key className="h-4 w-4 text-warning" />
          <AlertDescription className="flex items-center gap-4">
            <span className="flex-1">
              To view the interactive map, please enter your Google Maps API key in Settings or below.
            </span>
            <div className="flex gap-2">
              <Input
                placeholder="Enter Google Maps API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-80"
              />
              <Button onClick={handleSaveApiKey} variant="default">
                Save Key
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card className="glass-card p-1 h-[600px] relative overflow-hidden">
            {!hasApiKey ? (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/20 backdrop-blur-sm">
                <div className="text-center space-y-4">
                  <MapPin className="h-16 w-16 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Map Integration Required</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Configure your Google Maps API key to enable live tracking visualization
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-muted/30 to-background/50 rounded-lg flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxNTUsMTU1LDE1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />
                    <div className="relative">
                      <MapPin className="h-24 w-24 text-primary animate-pulse" />
                      <p className="mt-4 text-sm text-muted-foreground">
                        Map integration active - Ready to display animal locations
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="glass-card p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Radio className="h-4 w-4 text-primary" />
              Live Tracking
            </h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-3">
                {markers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No active locations</p>
                ) : (
                  markers.map((marker) => (
                <div
                  key={marker.id}
                  className="p-3 rounded-lg bg-background/50 hover:bg-background transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${
                        marker.status === "Active" ? "bg-secondary animate-pulse" : "bg-warning"
                      }`} />
                      <span className="font-mono text-sm font-medium">{marker.id}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        marker.type === "tiger"
                          ? "gradient-tiger border-0 text-xs"
                          : "gradient-elephant border-0 text-xs"
                      }
                    >
                      {marker.type === "tiger" ? "🐅" : "🐘"}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium mb-1">{marker.name}</p>
                  <p className="text-xs text-muted-foreground">{marker.location}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {marker.lat.toFixed(4)}° N, {marker.lng.toFixed(4)}° E
                  </p>
                </div>
                  ))
                )}
              </div>
            )}
          </Card>

          <Card className="glass-card p-4">
            <h3 className="font-semibold mb-4">Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-3 w-3 rounded-full bg-tiger" />
                <span>Tiger</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-3 w-3 rounded-full bg-elephant" />
                <span>Elephant</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-3 w-3 rounded-full bg-secondary animate-pulse" />
                <span>Active</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-3 w-3 rounded-full bg-warning" />
                <span>Monitoring</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-3 w-3 rounded-full bg-destructive" />
                <span>Missing</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MapView;
