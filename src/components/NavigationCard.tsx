import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface NavigationCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  gradient?: string;
}

const NavigationCard = ({ title, description, icon: Icon, path, gradient = "gradient-primary" }: NavigationCardProps) => {
  return (
    <Link to={path} className="group">
      <Card className="h-full p-5 hover:shadow-lg transition-all duration-300 border border-border hover:border-primary/30 cursor-pointer bg-card">
        <div className="space-y-3">
          <div className={`w-11 h-11 rounded-lg ${gradient} flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-semibold group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default NavigationCard;
