import CVUpload from "@/components/CVUpload";
import Globe3D from "@/components/Globe3D";
import NeuralBrain from "@/components/NeuralBrain";
import OpportunityCard from "@/components/OpportunityCard";
import AIChat from "@/components/AIChat";
import CareerConstellation from "@/components/CareerConstellation";
import BiometricSync from "@/components/BiometricSync";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Brain, Globe, Rocket, Star, Zap, Target } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  const { data: opportunities, isLoading } = useQuery({
    queryKey: ["/api/opportunities"],
    enabled: !!currentUser,
  });

  return (
    <div className="space-bg min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 neon-glow text-neon-blue">
            AI Career Navigator
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-plasma-green leading-relaxed max-w-4xl mx-auto">
            Harness the power of artificial intelligence to navigate your career through the cosmos of global opportunities
          </p>
          
          <NeuralBrain />
          
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-12">
            <Button className="cyber-button px-8 py-4 text-lg font-semibold hover:scale-105 transform transition-all">
              <Rocket className="mr-3 h-5 w-5" />
              Upload Neural Profile
            </Button>
            <Button className="cyber-button px-8 py-4 text-lg font-semibold hover:scale-105 transform transition-all">
              <Brain className="mr-3 h-5 w-5" />
              Begin AI Analysis
            </Button>
          </div>
        </div>
      </section>

      {/* CV Upload Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 neon-glow text-neon-blue">
            Neural Profile Upload
          </h2>
          <CVUpload onUserCreated={setCurrentUser} />
        </div>
      </section>

      {/* AI Analysis Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 neon-glow text-neon-blue">
            AI Quantum Analysis
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="glass-panel rounded-2xl border-neon">
              <CardContent className="p-8">
                <div className="progress-ring mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-4 text-neon-blue">Neural Pattern Analysis</h3>
                <p className="text-cyber-gray">Analyzing your cognitive pathways and skill matrices</p>
              </CardContent>
            </Card>
            
            <Card className="glass-panel rounded-2xl border-neon">
              <CardContent className="p-8">
                <div className="w-24 h-24 mx-auto mb-6 border-4 border-plasma-green rounded-full flex items-center justify-center">
                  <Globe className="text-3xl text-plasma-green" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-plasma-green">Global Opportunity Scan</h3>
                <p className="text-cyber-gray">Scanning 50,000+ opportunities across 195 countries</p>
              </CardContent>
            </Card>
            
            <Card className="glass-panel rounded-2xl border-neon">
              <CardContent className="p-8">
                <div className="w-24 h-24 mx-auto mb-6 border-4 border-neon-blue rounded-full flex items-center justify-center">
                  <Target className="text-3xl text-neon-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-neon-blue">Career Trajectory Mapping</h3>
                <p className="text-cyber-gray">Calculating optimal career pathways through space-time</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Global Opportunities Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 neon-glow text-plasma-green">
            Global Opportunity Universe
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <Globe3D />
            
            <div className="space-y-8">
              <Card className="glass-panel rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-semibold mb-4 text-neon-blue">Real-Time Opportunity Detection</h3>
                  <p className="text-cyber-gray mb-4">Our AI continuously scans the quantum field of global opportunities</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 bg-black rounded-full h-2">
                      <div className="bg-gradient-to-r from-neon-blue to-plasma-green h-2 rounded-full w-3/4" />
                    </div>
                    <span className="text-neon-blue font-semibold">75% Match</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-panel rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-semibold mb-4 text-plasma-green">Cosmic Coverage</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-neon-blue">195</div>
                      <div className="text-cyber-gray">Countries</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-plasma-green">50K+</div>
                      <div className="text-cyber-gray">Opportunities</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-neon-blue">24/7</div>
                      <div className="text-cyber-gray">AI Monitoring</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Sample Opportunity Cards */}
          {!isLoading && opportunities && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {opportunities.slice(0, 6).map((opportunity: any) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Career Constellation */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 neon-glow text-neon-blue">
            Career Constellation Map
          </h2>
          <CareerConstellation />
        </div>
      </section>

      {/* AI Mentor Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 neon-glow text-neon-blue">
            Holographic AI Mentor
          </h2>
          <AIChat userId={currentUser?.id} />
        </div>
      </section>

      {/* Biometric Feedback */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 neon-glow text-plasma-green">
            Biometric Career Sync
          </h2>
          <BiometricSync />
        </div>
      </section>
    </div>
  );
}
