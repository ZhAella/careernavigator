import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink, MapPin, Building, Zap } from "lucide-react";
import { format } from "date-fns";

interface OpportunityCardProps {
  opportunity: {
    id: number;
    title: string;
    organization: string;
    type: string;
    description: string;
    location?: string;
    country?: string;
    deadline?: string;
    salary?: string;
    applicationUrl?: string;
  };
  matchPercentage?: number;
  aiReasoning?: string;
}

export default function OpportunityCard({ opportunity, matchPercentage, aiReasoning }: OpportunityCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "INTERNSHIP":
        return "bg-neon-blue/20 text-neon-blue border-neon-blue";
      case "FELLOWSHIP":
        return "bg-purple-500/20 text-purple-400 border-purple-400";
      case "STUDY_ABROAD":
        return "bg-plasma-green/20 text-plasma-green border-plasma-green";
      case "GRANT":
        return "bg-orange-500/20 text-orange-400 border-orange-400";
      default:
        return "bg-cyber-gray/20 text-cyber-gray border-cyber-gray";
    }
  };

  const formatDeadline = (deadline: string) => {
    try {
      return format(new Date(deadline), "MMM dd, yyyy");
    } catch {
      return deadline;
    }
  };

  return (
    <Card className="opportunity-card rounded-2xl border transition-all duration-300 hover:border-neon-blue hover:shadow-lg hover:shadow-neon-blue/20">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <Badge className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(opportunity.type)}`}>
            {opportunity.type.replace("_", " ")}
          </Badge>
          {matchPercentage && (
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-plasma-green" />
              <span className="text-plasma-green font-bold">{matchPercentage}% match</span>
            </div>
          )}
        </div>

        <h3 className="text-xl font-semibold mb-2 text-white hover:text-neon-blue transition-colors">
          {opportunity.title}
        </h3>
        
        <div className="flex items-center mb-2 text-cyber-gray">
          <Building className="h-4 w-4 mr-2" />
          <span>{opportunity.organization}</span>
        </div>

        {opportunity.location && (
          <div className="flex items-center mb-4 text-cyber-gray">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{opportunity.location}{opportunity.country && `, ${opportunity.country}`}</span>
          </div>
        )}

        <p className="text-gray-300 mb-4 line-clamp-3">
          {opportunity.description}
        </p>

        {aiReasoning && (
          <div className="mb-4 p-3 rounded-lg bg-neon-blue/10 border border-neon-blue/30">
            <p className="text-sm text-neon-blue font-medium mb-1">AI Analysis:</p>
            <p className="text-sm text-cyber-gray">{aiReasoning}</p>
          </div>
        )}

        <div className="flex justify-between items-center">
          {opportunity.deadline && (
            <div className="flex items-center text-plasma-green">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="text-sm">Deadline: {formatDeadline(opportunity.deadline)}</span>
            </div>
          )}
          
          {opportunity.salary && (
            <span className="text-neon-blue font-semibold text-sm">
              {opportunity.salary}
            </span>
          )}
        </div>

        <div className="flex space-x-3 mt-4">
          <Button className="cyber-button flex-1 py-2 text-sm">
            <ExternalLink className="mr-1 h-4 w-4" />
            Apply Now
          </Button>
          <Button variant="outline" className="border-neon-blue text-neon-blue hover:bg-neon-blue/10 py-2 text-sm">
            <Calendar className="mr-1 h-4 w-4" />
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
