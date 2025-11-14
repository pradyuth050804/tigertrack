import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Search, Download, Eye, Edit, Trash2, MapPin, Loader2 } from "lucide-react";
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
import { useElephants } from "@/hooks/use-elephants";
import type { FilterParams } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

const Elephants = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterParams>({});
  
  const { data: elephantData = [], isLoading, error } = useElephants({
    ...filters,
    search: searchQuery || undefined,
  });
  const { user } = useAuth();
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
          <h1 className="text-3xl font-bold tracking-tight mb-2">Elephant Records</h1>
          <p className="text-muted-foreground">Comprehensive tracking of all elephants across India</p>
        </div>
        {user?.role === 'administrator' && (
          <Button className="gradient-elephant" onClick={() => navigate('/add-new-elephant')}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Elephant
          </Button>
        )}
      </div>

      <FilterBar />

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID, location, or status..."
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
          <p className="text-destructive">Error loading elephant data. Using mock data.</p>
        </div>
      ) : null}

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Elephant ID</TableHead>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Sex/Age</TableHead>
                <TableHead className="font-semibold">Location</TableHead>
                <TableHead className="font-semibold">Collar Status</TableHead>
                <TableHead className="font-semibold">Last Position</TableHead>
                <TableHead className="font-semibold">Movement</TableHead>
                <TableHead className="font-semibold">Battery</TableHead>
                <TableHead className="font-semibold">Signal</TableHead>
                <TableHead className="font-semibold">Last Transmission</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {elephantData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                    No elephants found
                  </TableCell>
                </TableRow>
              ) : (
                elephantData.map((elephant) => (
                <TableRow
                  key={elephant.id}
                  onClick={(e) => {
                    // Ignore clicks that originate from interactive elements
                    const el = e.target as HTMLElement | null;
                    if (el && el.closest && el.closest('button, a, [role="button"], [data-no-row-click]')) return;
                    navigate(`/elephants/${elephant.id}`);
                  }}
                  className="hover:bg-muted/30 cursor-pointer transition-colors"
                >
                  <TableCell className="font-mono font-medium">
                    <Link to={`/elephants/${elephant.id}`} className="block w-full h-full">{elephant.id}</Link>
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link to={`/elephants/${elephant.id}`} className="block w-full h-full">{elephant.name || "-"}</Link>
                  </TableCell>
                  <TableCell>
                    <Link to={`/elephants/${elephant.id}`} className="block w-full h-full">
                      <div className="text-sm">
                        <div>{elephant.sex}</div>
                        <div className="text-muted-foreground">{elephant.age_class}</div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link to={`/elephants/${elephant.id}`} className="block w-full h-full">
                      <div className="text-sm">
                        <div className="font-medium">{elephant.reserve}</div>
                        <div className="text-muted-foreground">{elephant.district}, {elephant.state}</div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link to={`/elephants/${elephant.id}`} className="block w-full h-full">
                      {elephant.collared ? (
                        <div className="text-sm">
                          <Badge variant="outline" className="bg-secondary/10">Collared</Badge>
                          <div className="font-mono text-xs mt-1">{elephant.collar_id || "-"}</div>
                        </div>
                      ) : (
                        <Badge variant="outline" className="bg-muted/50">No Collar</Badge>
                      )}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm font-mono">
                    <Link to={`/elephants/${elephant.id}`} className="block w-full h-full">{elephant.last_location}</Link>
                  </TableCell>
                  <TableCell className="text-sm">
                    <Link to={`/elephants/${elephant.id}`} className="block w-full h-full">{elephant.movement_distance !== null ? `${elephant.movement_distance} km` : "-"}</Link>
                  </TableCell>
                  <TableCell>
                    <Link to={`/elephants/${elephant.id}`} className="block w-full h-full">
                      {elephant.battery !== null ? (
                        <div className="text-sm">
                          <span className="font-medium">{elephant.battery}%</span>
                          <div className="h-1.5 w-16 bg-muted rounded-full mt-1 overflow-hidden">
                            <div
                              className="h-full bg-secondary"
                              style={{ width: `${elephant.battery}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link to={`/elephants/${elephant.id}`} className="block w-full h-full">
                      {elephant.signal ? (
                        <span className={`text-sm font-medium ${getSignalColor(elephant.signal)}`}>
                          {elephant.signal}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm">
                    <Link to={`/elephants/${elephant.id}`} className="block w-full h-full">{elephant.last_transmission || "-"}</Link>
                  </TableCell>
                  <TableCell>
                    <Link to={`/elephants/${elephant.id}`} className="block w-full h-full">
                      <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                        {elephant.status}
                      </Badge>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        data-no-row-click
                        onClick={(e) => { e.stopPropagation(); navigate(`/elephants/${elephant.id}`); }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" data-no-row-click onClick={(e) => e.stopPropagation()}>
                        <MapPin className="h-4 w-4" />
                      </Button>
                      {user?.role === 'administrator' && (
                        <>
                          <Button variant="ghost" size="icon" className="h-8 w-8" data-no-row-click onClick={(e) => e.stopPropagation()}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" data-no-row-click onClick={(e) => e.stopPropagation()}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
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
        <div>Showing {elephantData.length} of {elephantData.length} total records</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
};

export default Elephants;
