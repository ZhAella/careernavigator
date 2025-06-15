import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AIChat from "@/components/AIChat";
import BiometricSync from "@/components/BiometricSync";
import { Brain, MessageSquare, Activity, Zap } from "lucide-react";

export default function AIMentor() {
  const { userId } = useParams();

  const { data: user } = useQuery({
    queryKey: [`/api/users/${userId}`],
  });

  return (
    <div className="min-h-screen bg-background pt-20 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Brain className="mr-3 h-8 w-8 text-primary" />
            AI Career Mentor
          </h1>
          <p className="text-muted-foreground">
            Get personalized career guidance and insights from your AI mentor
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* AI Chat Interface */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Chat with ARIA
                </CardTitle>
              </CardHeader>
              <CardContent className="h-96">
                <AIChat userId={parseInt(userId!)} />
              </CardContent>
            </Card>

            {/* Career Insights */}
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personalized Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Career Strengths</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Zap className="h-4 w-4 text-primary mr-2" />
                          <span className="text-sm">Technical problem-solving skills</span>
                        </div>
                        <div className="flex items-center">
                          <Zap className="h-4 w-4 text-primary mr-2" />
                          <span className="text-sm">Adaptability to new technologies</span>
                        </div>
                        <div className="flex items-center">
                          <Zap className="h-4 w-4 text-primary mr-2" />
                          <span className="text-sm">Strong analytical thinking</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Growth Areas</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Activity className="h-4 w-4 text-orange-500 mr-2" />
                          <span className="text-sm">Leadership experience</span>
                        </div>
                        <div className="flex items-center">
                          <Activity className="h-4 w-4 text-orange-500 mr-2" />
                          <span className="text-sm">Industry networking</span>
                        </div>
                        <div className="flex items-center">
                          <Activity className="h-4 w-4 text-orange-500 mr-2" />
                          <span className="text-sm">Public speaking skills</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Biometric Sync & Analytics */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Career Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BiometricSync />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <h5 className="font-medium mb-1 text-blue-900 dark:text-blue-100">Immediate Action</h5>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Apply to the Software Engineering Internship at Google - 95% match
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <h5 className="font-medium mb-1 text-green-900 dark:text-green-100">Skill Development</h5>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      Focus on cloud computing certifications to increase match rates
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <h5 className="font-medium mb-1 text-purple-900 dark:text-purple-100">Long-term Strategy</h5>
                    <p className="text-sm text-purple-800 dark:text-purple-200">
                      Consider research opportunities to broaden your academic profile
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <button className="w-full p-3 text-left border rounded-lg hover:bg-muted transition-colors">
                    <h5 className="font-medium">Schedule Mock Interview</h5>
                    <p className="text-sm text-muted-foreground">Practice with AI-powered interview simulation</p>
                  </button>
                  <button className="w-full p-3 text-left border rounded-lg hover:bg-muted transition-colors">
                    <h5 className="font-medium">Update Career Goals</h5>
                    <p className="text-sm text-muted-foreground">Refine your preferences for better matching</p>
                  </button>
                  <button className="w-full p-3 text-left border rounded-lg hover:bg-muted transition-colors">
                    <h5 className="font-medium">Skill Assessment</h5>
                    <p className="text-sm text-muted-foreground">Take AI-guided skill evaluation</p>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Conversation History */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium">Career Path Discussion</h5>
                    <span className="text-sm text-muted-foreground">2 hours ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Discussed transition from academic research to industry roles and skill gaps to address...
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium">Interview Preparation</h5>
                    <span className="text-sm text-muted-foreground">1 day ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Covered technical interview strategies and behavioral questions for tech roles...
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium">Opportunity Analysis</h5>
                    <span className="text-sm text-muted-foreground">3 days ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Analyzed pros and cons of fellowship vs internship opportunities for career growth...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}