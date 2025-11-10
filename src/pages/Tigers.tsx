import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Plus, Search, Download, MapPin, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FilterBar from "@/components/FilterBar";
import { useTigers } from "@/hooks/use-tigers";
import type { FilterParams } from "@/types";

const Tigers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterParams>({});
  
  const { data: tigerData = [], isLoading, error } = useTigers({
    ...filters,
    search: searchQuery || undefined,
  });

  const getStatusColor = (status: string) => {
    const colors = {
      Alive: "bg-secondary/10 text-secondary border-secondary/20",
      Monitoring: "bg-warning/10 text-warning border-warning/20",
      Missing: "bg-destructive/10 text-destructive border-destructive/20",
      Dead: "bg-muted text-muted-foreground border-muted",
    };
    return colors[status as keyof typeof colors] || colors.Alive;
  };

  const getSignalColor = (signal: string) => {
    const colors = {
      Strong: "text-secondary",
      Medium: "text-warning",
      Weak: "text-destructive",
    };
    return colors[signal as keyof typeof colors] || "";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Tiger Records</h1>
          <p className="text-muted-foreground">Comprehensive tracking of all tigers across India</p>
        </div>
        <Button className="gradient-tiger">
          <Plus className="h-4 w-4 mr-2" />
          Identify New Tiger
        </Button>
      </div>

      <FilterBar />

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID, name, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-destructive">Error loading tiger data. Using mock data.</p>
        </div>
      ) : null}

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Tiger ID</TableHead>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Sex/Age</TableHead>
                <TableHead className="font-semibold">Location</TableHead>
                <TableHead className="font-semibold">Stripe Match</TableHead>
                <TableHead className="font-semibold">Images</TableHead>
                <TableHead className="font-semibold">Last Seen</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Collar Info</TableHead>
                <TableHead className="font-semibold">Signal</TableHead>
                <TableHead className="font-semibold">Conflicts</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tigerData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                    No tigers found
                  </TableCell>
                </TableRow>
              ) : (
                tigerData.map((tiger) => (
                  <TableRow 
                    key={tiger.id} 
                    onClick={(e) => {
                      const el = e.target as HTMLElement | null;
                      if (el && el.closest && el.closest('button, a, [role="button"], [data-no-row-click]')) return;
                      navigate(`/tigers/${tiger.id}`);
                    }}
                    className="hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                  <TableCell className="font-mono font-medium">{tiger.id}</TableCell>
                <TableCell className="font-medium">{tiger.name || "-"}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{tiger.sex}</div>
                    <div className="text-muted-foreground">{tiger.age_class}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">{tiger.reserve}</div>
                    <div className="text-muted-foreground">{tiger.district}, {tiger.state}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-mono">{tiger.stripe_match_id || "-"}</div>
                    {tiger.confidence && (
                      <div className="text-muted-foreground">{tiger.confidence}% match</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{tiger.image_count}</Badge>
                </TableCell>
                <TableCell className="text-sm">{tiger.last_seen}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(tiger.status)} variant="outline">
                    {tiger.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {tiger.collared ? (
                    <div className="text-sm">
                      <div className="font-mono">{tiger.collar_id || "-"}</div>
                      {tiger.battery !== null && (
                        <div className="text-muted-foreground">Battery: {tiger.battery}%</div>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">No collar</span>
                  )}
                </TableCell>
                <TableCell>
                  {tiger.signal && (
                    <span className={`text-sm font-medium ${getSignalColor(tiger.signal)}`}>
                      {tiger.signal}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {tiger.conflicts > 0 ? (
                    <Badge variant="destructive">{tiger.conflicts}</Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">None</span>
                  )}
                </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        data-no-row-click
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MapPin className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        data-no-row-click
                        onClick={(e) => { e.stopPropagation(); navigate(`/tigers/${tiger.id}`); }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" data-no-row-click onClick={(e) => e.stopPropagation()}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>Showing {tigerData.length} of {tigerData.length} total records</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
};

export default Tigers;
