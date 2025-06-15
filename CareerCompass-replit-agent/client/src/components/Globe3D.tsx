import { useEffect, useRef } from "react";

export default function Globe3D() {
  const globeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    // Create opportunity markers
    const markers = [
      { top: "20%", left: "30%" },
      { top: "40%", left: "70%" },
      { top: "60%", left: "20%" },
      { top: "30%", left: "80%" },
      { top: "70%", left: "50%" },
      { top: "15%", left: "60%" },
      { top: "55%", left: "35%" },
      { top: "35%", left: "15%" },
    ];

    markers.forEach((position, index) => {
      const marker = document.createElement("div");
      marker.className = "globe-marker";
      marker.style.top = position.top;
      marker.style.left = position.left;
      marker.style.animationDelay = `${index * 0.5}s`;
      
      marker.addEventListener("mouseenter", () => {
        marker.style.transform = "scale(2)";
        marker.style.boxShadow = "0 0 30px currentColor";
      });
      
      marker.addEventListener("mouseleave", () => {
        marker.style.transform = "scale(1)";
        marker.style.boxShadow = "0 0 15px currentColor";
      });
      
      globe.appendChild(marker);
    });

    return () => {
      if (globe) {
        globe.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="flex justify-center">
      <div ref={globeRef} className="globe-3d relative">
        {/* Globe ring effects */}
        <div className="absolute inset-4 border border-neon-blue/30 rounded-full animate-pulse" />
        <div className="absolute inset-8 border border-plasma-green/20 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
        
        {/* Central pulse */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-neon-blue rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
