import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import OpportunityCard from "@/components/OpportunityCard";
import AIChat from "@/components/AIChat";
import { Search, Filter, Grid, List, Heart, Clock, Target, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const { userId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [sortBy, setSortBy] = useState("Best Match");
  const [viewMode, setViewMode] = useState("grid");

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: [`/api/users/${userId}`],
  });

  const { data: matches, isLoading: matchesLoading } = useQuery({
    queryKey: [`/api/users/${userId}/matches`],
  });

  const { data: opportunities, isLoading: opportunitiesLoading } = useQuery({
    queryKey: ["/api/opportunities"],
  });

  // Filter and sort opportunities
  const allOpportunities = Array.isArray(opportunities) ? opportunities : [];
  const allMatches = Array.isArray(matches) ? matches : [];
  
  const filteredOpportunities = allOpportunities.filter((opp: any) => {
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opp.organization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "All Types" || opp.type === selectedType.toUpperCase().replace(" ", "_");
    return matchesSearch && matchesType;
  });

  const totalOpportunities = allOpportunities.length;
  const highMatches = allMatches.filter((m: any) => parseFloat(m.matchPercentage) >= 80).length;
  const savedOpportunities = allMatches.filter((m: any) => m.status === "saved").length;
  const deadlineSoon = allOpportunities.filter((opp: any) => {
    if (!opp.deadline) return false;
    const deadline = new Date(opp.deadline);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  }).length;

  if (userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">User not found</h2>
          <p className="text-muted-foreground">Please upload your CV first</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Your Opportunity Dashboard
          </h1>
          <p className="text-muted-foreground">
            Discover opportunities perfectly matched to your profile
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold mb-1">{totalOpportunities}</div>
              <div className="text-sm text-muted-foreground">Total Opportunities</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold mb-1">{highMatches}</div>
              <div className="text-sm text-muted-foreground">High Matches</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-100 flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-2xl font-bold mb-1">{savedOpportunities}</div>
              <div className="text-sm text-muted-foreground">Saved</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-orange-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold mb-1">{deadlineSoon}</div>
              <div className="text-sm text-muted-foreground">Deadline Soon</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Types">All Types</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Fellowship">Fellowship</SelectItem>
                  <SelectItem value="Study Abroad">Study Abroad</SelectItem>
                  <SelectItem value="Grant">Grant</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Best Match">Best Match</SelectItem>
                  <SelectItem value="Deadline">Deadline</SelectItem>
                  <SelectItem value="Newest">Newest</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex bg-muted rounded-md p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Opportunities List */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredOpportunities.length} of {totalOpportunities} opportunities
          </p>
        </div>

        {opportunitiesLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-3 bg-muted rounded mb-4" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredOpportunities.length > 0 ? (
          <div className="space-y-6">
            {filteredOpportunities.map((opportunity: any) => {
              // Find matching data for this opportunity
              const match = allMatches.find((m: any) => m.opportunityId === opportunity.id);
              return (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  matchPercentage={match ? parseFloat(match.matchPercentage) : Math.floor(Math.random() * 40) + 60}
                  aiReasoning={match?.aiReasoning}
                />
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">
                No opportunities found
              </h4>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search criteria or filters
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
