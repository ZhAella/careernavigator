import { useEffect, useRef } from "react";

export default function NeuralBrain() {
  const brainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const brain = brainRef.current;
    if (!brain) return;

    // Add floating neural connections
    const connections = [
      { top: "20%", left: "45%", width: "60px", angle: "45deg" },
      { top: "40%", left: "30%", width: "80px", angle: "-30deg" },
      { top: "60%", left: "55%", width: "50px", angle: "60deg" },
      { top: "35%", left: "70%", width: "40px", angle: "-45deg" },
    ];

    connections.forEach((conn, index) => {
      const connection = document.createElement("div");
      connection.className = "absolute h-0.5 bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-60";
      connection.style.top = conn.top;
      connection.style.left = conn.left;
      connection.style.width = conn.width;
      connection.style.transform = `rotate(${conn.angle})`;
      connection.style.animation = `constellation 3s ease-in-out infinite ${index * 0.5}s`;
      
      brain.appendChild(connection);
    });

    return () => {
      if (brain) {
        brain.innerHTML = `
          <div class="brain-hemisphere brain-left"></div>
          <div class="brain-hemisphere brain-right"></div>
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div class="w-4 h-4 bg-neon-blue rounded-full animate-pulse"></div>
          </div>
        `;
      }
    };
  }, []);

  return (
    <div ref={brainRef} className="brain-3d mb-12 relative">
      <div className="brain-hemisphere brain-left" />
      <div className="brain-hemisphere brain-right" />
      
      {/* Central neural core */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-4 h-4 bg-neon-blue rounded-full animate-pulse" />
      </div>
      
      {/* Synaptic connections */}
      <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-plasma-green rounded-full animate-pulse opacity-80" />
      <div className="absolute top-3/4 right-1/3 w-2 h-2 bg-neon-blue rounded-full animate-pulse opacity-60" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-white rounded-full animate-pulse opacity-40" style={{ animationDelay: "2s" }} />
    </div>
  );
}
