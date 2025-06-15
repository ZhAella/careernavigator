import { Button } from "@/components/ui/button";
import { Brain, Calendar, Globe, Star, Upload, User } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <Brain className="text-white h-6 w-6" />
            </div>
            <span className="text-xl font-semibold">AI Career Navigator</span>
            <span className="text-sm text-muted-foreground">Find your perfect opportunity</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/upload" className="text-sm hover:text-primary transition-colors">
              Upload CV
            </Link>
            <Link href="/questionnaire" className="text-sm hover:text-primary transition-colors">
              Questionnaire
            </Link>
            <Link href="/dashboard" className="text-sm hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/neural/1" className="text-sm hover:text-primary transition-colors">
              Neural Analysis
            </Link>
            <Link href="/global-map" className="text-sm hover:text-primary transition-colors">
              Global Map
            </Link>
            <Link href="/constellation/1" className="text-sm hover:text-primary transition-colors">
              Constellation
            </Link>
            <Link href="/ai-mentor/1" className="text-sm hover:text-primary transition-colors">
              AI Mentor
            </Link>
          </div>
          
          <Button variant="default" className="px-6">
            <Calendar className="mr-2 h-4 w-4" />
            My Calendar
          </Button>
        </div>
      </div>
    </nav>
  );
}
