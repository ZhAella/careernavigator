import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function BiometricSync() {
  const [metrics, setMetrics] = useState({
    neuralSync: 98,
    motivationIndex: 87,
    successProbability: 92,
    cosmicHarmony: 95,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        neuralSync: Math.max(90, Math.min(100, prev.neuralSync + (Math.random() - 0.5) * 4)),
        motivationIndex: Math.max(80, Math.min(95, prev.motivationIndex + (Math.random() - 0.5) * 6)),
        successProbability: Math.max(85, Math.min(98, prev.successProbability + (Math.random() - 0.5) * 5)),
        cosmicHarmony: Math.max(90, Math.min(100, prev.cosmicHarmony + (Math.random() - 0.5) * 3)),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getMetricColor = (value: number) => {
    if (value >= 95) return "border-plasma-green text-plasma-green";
    if (value >= 90) return "border-neon-blue text-neon-blue";
    if (value >= 85) return "border-yellow-400 text-yellow-400";
    return "border-orange-400 text-orange-400";
  };

  return (
    <div className="grid md:grid-cols-4 gap-6">
      <Card className="glass-panel border-neon">
        <CardContent className="p-6 text-center">
          <div className={`w-20 h-20 mx-auto mb-4 rounded-full border-4 flex items-center justify-center ${getMetricColor(metrics.neuralSync)}`}>
            <span className="text-2xl font-bold">{Math.round(metrics.neuralSync)}%</span>
          </div>
          <h3 className="font-semibold text-neon-blue mb-2">Neural Sync</h3>
          <p className="text-cyber-gray text-sm">Brain-career alignment</p>
        </CardContent>
      </Card>

      <Card className="glass-panel border-neon">
        <CardContent className="p-6 text-center">
          <div className={`w-20 h-20 mx-auto mb-4 rounded-full border-4 flex items-center justify-center ${getMetricColor(metrics.motivationIndex)}`}>
            <span className="text-2xl font-bold">{Math.round(metrics.motivationIndex)}%</span>
          </div>
          <h3 className="font-semibold text-plasma-green mb-2">Motivation Index</h3>
          <p className="text-cyber-gray text-sm">Drive measurement</p>
        </CardContent>
      </Card>

      <Card className="glass-panel border-neon">
        <CardContent className="p-6 text-center">
          <div className={`w-20 h-20 mx-auto mb-4 rounded-full border-4 flex items-center justify-center ${getMetricColor(metrics.successProbability)}`}>
            <span className="text-2xl font-bold">{Math.round(metrics.successProbability)}%</span>
          </div>
          <h3 className="font-semibold text-purple-400 mb-2">Success Probability</h3>
          <p className="text-cyber-gray text-sm">Outcome prediction</p>
        </CardContent>
      </Card>

      <Card className="glass-panel border-neon">
        <CardContent className="p-6 text-center">
          <div className={`w-20 h-20 mx-auto mb-4 rounded-full border-4 flex items-center justify-center ${getMetricColor(metrics.cosmicHarmony)}`}>
            <span className="text-2xl font-bold">{Math.round(metrics.cosmicHarmony)}%</span>
          </div>
          <h3 className="font-semibold text-neon-blue mb-2">Cosmic Harmony</h3>
          <p className="text-cyber-gray text-sm">Universal balance</p>
        </CardContent>
      </Card>
    </div>
  );
}
