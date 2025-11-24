import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, AlertCircle } from "lucide-react";

interface TerritoryInformationProps {
  primaryReserve?: string;
  district?: string;
  territoryRange?: string;
  recentSightings?: number;
}

const TerritoryInformation = ({
  primaryReserve = "Bandipur",
  district = "Mysuru",
  territoryRange = "110.50 sq. km",
  recentSightings = 2,
}: TerritoryInformationProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-green-600" />
        <h2 className="text-lg font-semibold">Territory Information</h2>
      </div>

      {/* Primary Reserve and District */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-950/20 dark:to-blue-950/10 border-blue-200/50 dark:border-blue-800/30">
          <p className="text-xs text-muted-foreground mb-2">Primary Reserve</p>
          <p className="font-semibold text-sm">{primaryReserve}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-50/50 dark:from-purple-950/20 dark:to-purple-950/10 border-purple-200/50 dark:border-purple-800/30">
          <p className="text-xs text-muted-foreground mb-2">District</p>
          <p className="font-semibold text-sm">{district}</p>
        </Card>
      </div>

      {/* Territory Range Visualization */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200/50 dark:border-blue-800/30">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-sm">Territory Range</p>
            <Badge variant="secondary" className="text-xs">{territoryRange}</Badge>
          </div>

          {/* Map Placeholder */}
          <div className="relative w-full aspect-square bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-lg border-2 border-dashed border-blue-300/50 dark:border-blue-700/50 flex items-center justify-center">
            {/* Territory Boundary */}
            <div className="absolute inset-8 rounded-full border-2 border-dashed border-blue-400/60 dark:border-blue-600/60"></div>

            {/* Center Tiger Icon */}
            <div className="absolute flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center shadow-lg">
                <span className="text-xl">🐯</span>
              </div>
              <p className="text-xs font-semibold mt-2 text-foreground">Core Territory</p>
            </div>

            {/* Sighting Indicators */}
            <div className="absolute top-1/4 left-1/3 w-3 h-3 rounded-full bg-red-500 shadow-md" title="Recent Sighting"></div>
            <div className="absolute bottom-1/3 right-1/4 w-3 h-3 rounded-full bg-red-500 shadow-md" title="Recent Sighting"></div>

            {/* Legend */}
            <div className="absolute bottom-3 right-3 space-y-1 text-xs bg-white/80 dark:bg-slate-900/80 px-2 py-2 rounded shadow">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span>Core Territory</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span>Recent Sightings</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Movement History */}
      <div>
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-600" />
          Recent Movement History
        </h3>
        <div className="space-y-2">
          <Card className="p-3 bg-green-50/50 dark:bg-green-950/20 border-green-200/50 dark:border-green-800/30">
            <p className="text-xs font-semibold text-foreground">Bandipur Core Zone - Sector A</p>
            <p className="text-xs text-muted-foreground mt-1">Jan 22, 2025 09:15</p>
          </Card>
          <Card className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-800/30">
            <p className="text-xs font-semibold text-foreground">Mangsik Range</p>
            <p className="text-xs text-muted-foreground mt-1">Jan 15, 2025 04:30</p>
          </Card>
        </div>
      </div>

      {/* Territory Monitoring Info */}
      <Card className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/50 dark:border-blue-800/30 border-l-4 border-l-blue-500">
        <div className="flex gap-3">
          <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-blue-900 dark:text-blue-100">Territory Monitoring</p>
            <p className="text-blue-800/80 dark:text-blue-200/80">
              Tigers typically have territories ranging 20-100 sq. km for females and 50-250 sq. km for males depending on prey availability and habitat quality. Location data helps in understanding movement patterns and habitat use.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TerritoryInformation;
