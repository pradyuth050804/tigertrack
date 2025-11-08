import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, RefreshCw } from "lucide-react";

interface FilterBarProps {
  onReset?: () => void;
}

const indianStates = [
  "All States",
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const FilterBar = ({ onReset }: FilterBarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-card/50 backdrop-blur-xl rounded-lg border border-border">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">Filters:</span>
      </div>

      <Select defaultValue="all-states">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select State" />
        </SelectTrigger>
        <SelectContent>
          {indianStates.map((state) => (
            <SelectItem key={state} value={state.toLowerCase().replace(/\s+/g, "-")}>
              {state}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select defaultValue="all-species">
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Species" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-species">All Species</SelectItem>
          <SelectItem value="tiger">Tiger</SelectItem>
          <SelectItem value="elephant">Elephant</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="2024">
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2024">2024</SelectItem>
          <SelectItem value="2023">2023</SelectItem>
          <SelectItem value="2022">2022</SelectItem>
          <SelectItem value="2021">2021</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="all-status">
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-status">All Status</SelectItem>
          <SelectItem value="alive">Alive</SelectItem>
          <SelectItem value="monitoring">Monitoring</SelectItem>
          <SelectItem value="missing">Missing</SelectItem>
          <SelectItem value="dead">Dead</SelectItem>
        </SelectContent>
      </Select>

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
