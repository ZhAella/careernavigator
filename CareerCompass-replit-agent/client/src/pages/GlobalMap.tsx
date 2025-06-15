import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Globe3D from "@/components/Globe3D";
import { Globe, MapPin, Users, TrendingUp } from "lucide-react";

export default function GlobalMap() {
  const { data: opportunities, isLoading } = useQuery({
    queryKey: ["/api/opportunities"],
  });

  // Group opportunities by country
  const opportunitiesByCountry = (opportunities || []).reduce((acc: any, opp: any) => {
    const country = opp.country || "International";
    if (!acc[country]) {
      acc[country] = [];
    }
    acc[country].push(opp);
    return acc;
  }, {});

  const countryStats = Object.entries(opportunitiesByCountry).map(([country, opps]: [string, any]) => ({
    country,
    count: opps.length,
    types: [...new Set(opps.map((o: any) => o.type))],
    topOrganization: opps[0]?.organization
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Globe className="mr-3 h-8 w-8 text-primary" />
            Global Opportunity Map
          </h1>
          <p className="text-muted-foreground">
            Explore career opportunities across the world
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 3D Globe */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  Interactive Globe
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Globe3D />
              </CardContent>
            </Card>
          </div>

          {/* Global Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Global Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Countries</span>
                    <span className="font-semibold">{countryStats.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Opportunities</span>
                    <span className="font-semibold">{opportunities?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Programs</span>
                    <span className="font-semibold">
                      {[...new Set(opportunities?.map((o: any) => o.type))].length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Destinations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {countryStats
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5)
                    .map((stat, index) => (
                      <div key={stat.country} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-primary mr-2" />
                          <span className="font-medium">{stat.country}</span>
                        </div>
                        <Badge variant="secondary">{stat.count}</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Country Details */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Opportunities by Region</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {countryStats.map((stat) => (
              <Card key={stat.country}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-primary" />
                      {stat.country}
                    </span>
                    <Badge>{stat.count}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Program Types</h4>
                      <div className="flex flex-wrap gap-1">
                        {stat.types.map((type: string) => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {type.replace("_", " ").toLowerCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Top Organization</h4>
                      <p className="text-sm text-muted-foreground">{stat.topOrganization}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Regional Insights */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Regional Insights</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>North America</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Leading in tech innovation and research opportunities with top universities and corporations.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tech Focus</span>
                    <Badge>High</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Research Programs</span>
                    <Badge>Extensive</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Europe</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Diverse academic programs and cultural exchange opportunities across multiple countries.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Study Abroad</span>
                    <Badge>Excellent</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Cultural Diversity</span>
                    <Badge>High</Badge>
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