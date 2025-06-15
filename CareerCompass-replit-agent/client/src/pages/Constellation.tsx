import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CareerConstellation from "@/components/CareerConstellation";
import { Star, Sparkles, Target, TrendingUp } from "lucide-react";

export default function Constellation() {
  const { userId } = useParams();

  const { data: user } = useQuery({
    queryKey: [`/api/users/${userId}`],
  });

  const { data: matches } = useQuery({
    queryKey: [`/api/users/${userId}/matches`],
  });

  const { data: opportunities } = useQuery({
    queryKey: ["/api/opportunities"],
  });

  // Calculate career path metrics
  const allMatches = Array.isArray(matches) ? matches : [];
  const allOpportunities = Array.isArray(opportunities) ? opportunities : [];
  
  const careerNodes = [
    {
      id: 1,
      title: "Current Position",
      type: "current",
      description: user?.experienceLevel || "Starting Position",
      connections: [2, 3],
      strength: 100
    },
    {
      id: 2,
      title: "Internship Path",
      type: "internship",
      description: "Technical skill development",
      connections: [4, 5],
      strength: 85
    },
    {
      id: 3,
      title: "Fellowship Track",
      type: "fellowship",
      description: "Research and leadership",
      connections: [4, 6],
      strength: 75
    },
    {
      id: 4,
      title: "Advanced Specialization",
      type: "specialization",
      description: "Domain expertise",
      connections: [7],
      strength: 90
    },
    {
      id: 5,
      title: "Industry Leadership",
      type: "leadership",
      description: "Senior technical roles",
      connections: [7],
      strength: 80
    },
    {
      id: 6,
      title: "Research Excellence",
      type: "research",
      description: "Academic and R&D",
      connections: [7],
      strength: 70
    },
    {
      id: 7,
      title: "Career Summit",
      type: "summit",
      description: "Peak achievement",
      connections: [],
      strength: 95
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-20 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Star className="mr-3 h-8 w-8 text-primary" />
            Career Constellation
          </h1>
          <p className="text-muted-foreground">
            Map your career journey through interconnected opportunities
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Constellation Visualization */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Interactive Career Map
                </CardTitle>
              </CardHeader>
              <CardContent className="h-96">
                <CareerConstellation />
              </CardContent>
            </Card>

            {/* Career Path Analysis */}
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pathway Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Recommended Path</h4>
                      <div className="space-y-3">
                        {careerNodes.slice(0, 4).map((node) => (
                          <div key={node.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <h5 className="font-medium">{node.title}</h5>
                              <p className="text-sm text-muted-foreground">{node.description}</p>
                            </div>
                            <Badge variant={node.type === "current" ? "default" : "secondary"}>
                              {node.strength}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Alternative Routes</h4>
                      <div className="space-y-3">
                        {careerNodes.slice(4).map((node) => (
                          <div key={node.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <h5 className="font-medium">{node.title}</h5>
                              <p className="text-sm text-muted-foreground">{node.description}</p>
                            </div>
                            <Badge variant="outline">
                              {node.strength}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Career Metrics */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Career Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Path Clarity</span>
                    <span className="font-semibold">87%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Opportunity Density</span>
                    <span className="font-semibold">{allOpportunities.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Match Quality</span>
                    <span className="font-semibold">
                      {allMatches.length > 0 
                        ? Math.round(allMatches.reduce((acc: number, m: any) => acc + parseFloat(m.matchPercentage), 0) / allMatches.length)
                        : 75}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Growth Potential</span>
                    <span className="font-semibold">High</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Constellation Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <h5 className="font-medium mb-1">Strongest Connection</h5>
                    <p className="text-sm text-muted-foreground">
                      Technical specialization path shows highest alignment with your skills
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <h5 className="font-medium mb-1">Growth Opportunity</h5>
                    <p className="text-sm text-muted-foreground">
                      Research track offers unique differentiation potential
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <h5 className="font-medium mb-1">Risk Assessment</h5>
                    <p className="text-sm text-muted-foreground">
                      Multiple pathways reduce career risk and increase flexibility
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-sm">Apply to top-matched internship programs</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-sm">Develop skills in emerging technologies</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-sm">Build network in target organizations</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-sm">Consider research collaboration opportunities</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}