import { Activity, Radio, AlertCircle, Filter, MapPin, Database, TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StripeIdDialog } from "@/components/StripeIdDialog";
import { useStats } from "@/hooks/use-stats";
import { useRecentSightings } from "@/hooks/use-sightings";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: statsData, isLoading: statsLoading } = useStats();
  const { data: sightingsData, isLoading: sightingsLoading } = useRecentSightings(6);

  const stats = [
    {
      icon: Activity,
      value: statsData ? statsData.total_tigers.toLocaleString() : "3,167",
      label: "Total Tigers",
      trend: statsData?.tiger_trend ? `${statsData.tiger_trend > 0 ? '+' : ''}${statsData.tiger_trend.toFixed(1)}%` : "+8.2%",
      trendUp: (statsData?.tiger_trend ?? 8.2) > 0,
      borderColor: "border-t-[#FF6B35]",
      iconBg: "bg-gradient-to-br from-[#FF6B35] to-[#F7931E]",
    },
    {
      icon: Activity,
      value: statsData ? statsData.total_elephants.toLocaleString() : "27,312",
      label: "Total Elephants",
      trend: statsData?.elephant_trend ? `${statsData.elephant_trend > 0 ? '+' : ''}${statsData.elephant_trend.toFixed(1)}%` : "+3.5%",
      trendUp: (statsData?.elephant_trend ?? 3.5) > 0,
      borderColor: "border-t-[#5B8C5A]",
      iconBg: "bg-gradient-to-br from-[#5B8C5A] to-[#8BC34A]",
    },
    {
      icon: Radio,
      value: statsData ? statsData.collared_animals.toLocaleString() : "428",
      label: "Collared Animals",
      trend: statsData?.collared_trend ? `${statsData.collared_trend > 0 ? '+' : ''}${statsData.collared_trend}` : "+3",
      trendUp: (statsData?.collared_trend ?? 3) > 0,
      borderColor: "border-t-primary",
      iconBg: "bg-gradient-to-br from-primary to-primary/80",
    },
    {
      icon: AlertCircle,
      value: statsData ? statsData.active_conflicts.toLocaleString() : "23",
      label: "Active Conflicts",
      trend: statsData?.conflict_trend ? `${statsData.conflict_trend > 0 ? '+' : ''}${statsData.conflict_trend.toFixed(1)}%` : "-15.3%",
      trendUp: (statsData?.conflict_trend ?? -15.3) > 0,
      borderColor: "border-t-warning",
      iconBg: "bg-gradient-to-br from-warning to-warning/80",
    },
  ];

  // Transform sightings data for display
  const recentSightings = sightingsData?.map(sighting => ({
    id: sighting.animal_id,
    name: sighting.name,
    location: sighting.location,
    coordinates: sighting.coordinates,
    sex: sighting.sex,
    age: sighting.age,
    status: sighting.status,
    statusColor: "bg-primary text-primary-foreground",
    species: sighting.species.toLowerCase() as "tiger" | "elephant",
  })) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Wildlife Monitoring Dashboard</h1>
        <p className="text-muted-foreground">Real-time tracking and analytics across India's wildlife reserves</p>
      </div>

      {/* Quick Access Cards */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card 
            onClick={() => navigate('/tigers')}
            className="p-6 border border-border shadow-sm hover:shadow-md transition-all hover:border-primary/50 cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#F7931E] flex items-center justify-center">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-base group-hover:text-primary transition-colors">Tiger Records</h3>
                <p className="text-xs text-muted-foreground">View all tigers</p>
              </div>
            </div>
          </Card>
          <Card 
            onClick={() => navigate('/elephants')}
            className="p-6 border border-border shadow-sm hover:shadow-md transition-all hover:border-primary/50 cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5B8C5A] to-[#8BC34A] flex items-center justify-center">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-base group-hover:text-primary transition-colors">Elephant Records</h3>
                <p className="text-xs text-muted-foreground">View all elephants</p>
              </div>
            </div>
          </Card>
          <Card 
            onClick={() => navigate('/map')}
            className="p-6 border border-border shadow-sm hover:shadow-md transition-all hover:border-primary/50 cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-base group-hover:text-primary transition-colors">Map View</h3>
                <p className="text-xs text-muted-foreground">Interactive map</p>
              </div>
            </div>
          </Card>
          <Card 
            onClick={() => navigate('/conflicts')}
            className="p-6 border border-border shadow-sm hover:shadow-md transition-all hover:border-primary/50 cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-warning to-warning/80 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-base group-hover:text-primary transition-colors">Conflicts</h3>
                <p className="text-xs text-muted-foreground">Monitor conflicts</p>
              </div>
            </div>
          </Card>
          <StripeIdDialog />
        </div>
      </div>

      {/* Filter Section */}
      <Card className="p-6 border border-border shadow-sm">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <Filter className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Filter Records</h3>
            <p className="text-sm text-muted-foreground">Refine your search across all parameters</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Select defaultValue="all-districts">
            <SelectTrigger className="bg-muted/50">
              <SelectValue placeholder="All Districts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-districts">All Districts</SelectItem>
              <SelectItem value="mysuru">Mysuru</SelectItem>
              <SelectItem value="kodagu">Kodagu</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all-reserves">
            <SelectTrigger className="bg-muted/50">
              <SelectValue placeholder="All Reserves" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-reserves">All Reserves</SelectItem>
              <SelectItem value="bandipur">Bandipur</SelectItem>
              <SelectItem value="nagarahole">Nagarahole</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all-years">
            <SelectTrigger className="bg-muted/50">
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-years">All Years</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all-species">
            <SelectTrigger className="bg-muted/50">
              <SelectValue placeholder="All Species" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-species">All Species</SelectItem>
              <SelectItem value="tiger">Tiger</SelectItem>
              <SelectItem value="elephant">Elephant</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all-status">
            <SelectTrigger className="bg-muted/50">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All Status</SelectItem>
              <SelectItem value="collared">Collared</SelectItem>
              <SelectItem value="monitoring">Monitoring</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className={`relative overflow-hidden border-t-4 ${stat.borderColor} shadow-sm`}>
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground font-medium mb-2">{stat.label}</p>
                  <h3 className="text-4xl font-bold mb-2">{stat.value}</h3>
                  <div className="flex items-center gap-1">
                    {stat.trendUp ? (
                      <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                    )}
                    <span className={`text-xs font-semibold ${stat.trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {stat.trend}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Sightings */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Recent Sightings</h2>
            <p className="text-sm text-muted-foreground">Latest location updates across Karnataka reserves</p>
          </div>
          <Badge variant="destructive" className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
            Live
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentSightings.map((sighting) => (
            <Card key={sighting.id} className="border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{sighting.id}</h3>
                    {sighting.name && (
                      <p className="text-sm text-primary font-medium">"{sighting.name}"</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{sighting.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="text-xs">📍</span>
                    <span>{sighting.coordinates}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Sex</p>
                    <p className="text-sm font-medium">{sighting.sex}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Age</p>
                    <p className="text-sm font-medium">{sighting.age}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <Badge className={sighting.statusColor}>
                    <Radio className="h-3 w-3 mr-1" />
                    {sighting.status}
                  </Badge>
                  <Button variant="ghost" size="sm" className="text-primary">
                    View on Map
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
