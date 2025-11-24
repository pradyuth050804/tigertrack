import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, RefreshCw } from "lucide-react";

interface FilterBarProps {
  onReset?: () => void;
}

const FilterBar = ({ onReset }: FilterBarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-card/50 backdrop-blur-xl rounded-lg border border-border">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">Filters:</span>
      </div>

      {/* District */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">District</p>
        <Select defaultValue="all-districts">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Districts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-districts">All Districts</SelectItem>
            <SelectItem value="mysuru">Mysuru</SelectItem>
            <SelectItem value="uttara-kannada">Uttara Kannada</SelectItem>
            <SelectItem value="kodagu">Kodagu</SelectItem>
            <SelectItem value="chamarajanagar">Chamarajanagar</SelectItem>
            <SelectItem value="shivamogga">Shivamogga</SelectItem>
            <SelectItem value="chikkamagaluru">Chikkamagaluru</SelectItem>
            <SelectItem value="hassan">Hassan</SelectItem>
            <SelectItem value="dakshina-kannada">Dakshina Kannada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reserve */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">Reserve</p>
        <Select defaultValue="all-reserves">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Reserves" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-reserves">All Reserves</SelectItem>
            <SelectItem value="bandipur">Bandipur</SelectItem>
            <SelectItem value="nagarahole">Nagarahole</SelectItem>
            <SelectItem value="bhadra">Bhadra</SelectItem>
            <SelectItem value="kali">Kali</SelectItem>
            <SelectItem value="dandeli">Dandeli</SelectItem>
            <SelectItem value="anshi">Anshi</SelectItem>
            <SelectItem value="brt">BRT Wildlife Sanctuary</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sex */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">Sex</p>
        <Select defaultValue="all-sex">
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-sex">All</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="unknown">Unknown</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Age Class */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">Age Class</p>
        <Select defaultValue="all-age">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-age">All</SelectItem>
            <SelectItem value="cub">Cub</SelectItem>
            <SelectItem value="sub-adult">Sub-adult</SelectItem>
            <SelectItem value="adult">Adult</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        className="ml-auto"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Reset
      </Button>
    </div>
  );
};

export default FilterBar;
