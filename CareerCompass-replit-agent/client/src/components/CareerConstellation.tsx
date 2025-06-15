import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function CareerConstellation() {
  const constellationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const constellation = constellationRef.current;
    if (!constellation) return;

    // Create career stars
    const stars = [
      { top: "20%", left: "10%", delay: "0s" },
      { top: "40%", left: "30%", delay: "0.5s" },
      { top: "30%", left: "60%", delay: "1s" },
      { top: "70%", left: "80%", delay: "1.5s" },
      { top: "60%", left: "45%", delay: "2s" },
      { top: "15%", left: "75%", delay: "2.5s" },
      { top: "80%", left: "25%", delay: "3s" },
    ];

    // Create connections
    const connections = [
      { top: "25%", left: "12%", width: "180px", angle: "25deg" },
      { top: "35%", left: "32%", width: "200px", angle: "-15deg" },
      { top: "65%", left: "47%", width: "250px", angle: "35deg" },
      { top: "25%", left: "62%", width: "120px", angle: "60deg" },
    ];

    stars.forEach((star, index) => {
      const starElement = document.createElement("div");
      starElement.className = "career-star";
      starElement.style.top = star.top;
      starElement.style.left = star.left;
      starElement.style.animationDelay = star.delay;
      starElement.setAttribute("data-career", `Stage ${index + 1}`);
      
      starElement.addEventListener("mouseenter", () => {
        starElement.style.transform = "scale(2)";
        starElement.style.boxShadow = "0 0 30px currentColor";
      });
      
      starElement.addEventListener("mouseleave", () => {
        starElement.style.transform = "scale(1)";
        starElement.style.boxShadow = "0 0 10px currentColor";
      });
      
      constellation.appendChild(starElement);
    });

    connections.forEach((conn, index) => {
      const connection = document.createElement("div");
      connection.className = "career-connection";
      connection.style.top = conn.top;
      connection.style.left = conn.left;
      connection.style.width = conn.width;
      connection.style.transform = `rotate(${conn.angle})`;
      connection.style.animationDelay = `${index * 0.5}s`;
      
      constellation.appendChild(connection);
    });

    return () => {
      if (constellation) {
        constellation.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="space-y-8">
      <Card className="glass-panel border-neon">
        <CardContent className="p-0">
          <div ref={constellationRef} className="constellation-map rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center z-10">
                <h3 className="text-2xl font-bold text-neon-blue mb-4">Your Career Journey</h3>
                <p className="text-cyber-gray">Navigate through interconnected opportunities</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="glass-panel border-neon">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-blue to-plasma-green flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-neon-blue">Progress Tracking</h3>
            <p className="text-cyber-gray">Monitor your advancement through the career cosmos</p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-neon">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-plasma-green to-neon-blue flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-plasma-green">Deadline Alerts</h3>
            <p className="text-cyber-gray">Never miss a critical opportunity window</p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-neon">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-plasma-green flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-purple-400">Achievement System</h3>
            <p className="text-cyber-gray">Unlock cosmic milestones and career badges</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
