import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import NeuralBrain from "@/components/NeuralBrain";
import { Brain, Zap, Target, TrendingUp } from "lucide-react";

export default function NeuralAnalysis() {
  const { userId } = useParams();

  const { data: user, isLoading } = useQuery({
    queryKey: [`/api/users/${userId}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user?.neuralProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Neural Profile Not Found</h2>
          <p className="text-muted-foreground">Please upload your CV first to generate neural analysis</p>
        </div>
      </div>
    );
  }

  const profile = user.neuralProfile;

  return (
    <div className="min-h-screen bg-background pt-20 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Brain className="mr-3 h-8 w-8 text-primary" />
            Neural Profile Analysis
          </h1>
          <p className="text-muted-foreground">
            Deep analysis of your cognitive abilities and career potential
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 3D Neural Brain Visualization */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Neural Network
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <NeuralBrain />
              </CardContent>
            </Card>
          </div>

          {/* Analysis Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Cognitive Skills Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Technical Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills?.slice(0, 8).map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Domains</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.domains?.map((domain: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {domain}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Experience Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Experience Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-4">{profile.experience}</p>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Technical Proficiency</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Leadership Potential</span>
                      <span>72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Innovation Index</span>
                      <span>90%</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Career Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Career Trajectory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {profile.careerGoals?.map((goal: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span>{goal}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education Background */}
            <Card>
              <CardHeader>
                <CardTitle>Educational Foundation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {profile.education?.map((edu: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <Badge variant="outline" className="mr-2">
                        {edu}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Strengths */}
            <Card>
              <CardHeader>
                <CardTitle>Core Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {profile.strengths?.map((strength: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <Zap className="h-4 w-4 text-primary mr-2" />
                      <span>{strength}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}