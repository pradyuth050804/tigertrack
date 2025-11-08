import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  variant?: "default" | "tiger" | "elephant" | "warning";
}

const StatCard = ({ title, value, icon: Icon, trend, trendUp, variant = "default" }: StatCardProps) => {
  const variantClasses = {
    default: "gradient-primary",
    tiger: "gradient-tiger",
    elephant: "gradient-elephant",
    warning: "bg-gradient-to-br from-warning to-warning/80"
  };

  return (
    <Card className="p-5 hover:shadow-lg transition-all duration-300 border border-border bg-card relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-1 ${variantClasses[variant]}`} />
      <div className="flex items-start justify-between pt-1">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {trend && (
            <p className={`text-xs ${trendUp ? "text-secondary" : "text-destructive"}`}>
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${variantClasses[variant]}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
