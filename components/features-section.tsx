"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ZoomIn, MessageSquare, Clock, Sparkles } from "lucide-react";
import { DeepZoomDemo } from "@/components/feature-demos/deep-zoom-demo";
import { AnnotationDemo } from "@/components/feature-demos/annotation-demo";
import { TimeSeriesDemo } from "@/components/feature-demos/time-series-demo";
import { AISearchDemo } from "@/components/feature-demos/ai-search-demo";

const features = [
  {
    id: "deep-zoom",
    icon: ZoomIn,
    title: "Deep Zoom",
    description:
      "Seamlessly explore from galaxy-wide views down to individual star clusters",
    component: DeepZoomDemo,
  },
  {
    id: "annotation",
    icon: MessageSquare,
    title: "Annotation",
    description:
      "Collaborate with the community to identify and label cosmic features",
    component: AnnotationDemo,
  },
  {
    id: "time-series",
    icon: Clock,
    title: "Time-Series",
    description:
      "Compare images across time to track changes in celestial phenomena",
    component: TimeSeriesDemo,
  },
  {
    id: "ai-search",
    icon: Sparkles,
    title: "AI Search",
    description: "Find specific features using natural language queries",
    component: AISearchDemo,
  },
];

export function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(features[0]);

  return (
    <section id="features" className="relative py-20 lg:py-32 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
            An Unprecedented Toolkit for{" "}
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Cosmic Discovery
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Powerful features designed to make exploring the universe intuitive
            and engaging
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Feature Tabs */}
          <div className="space-y-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              const isActive = activeFeature.id === feature.id;
              return (
                <Card
                  key={feature.id}
                  className={`p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                    isActive
                      ? "bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/50 shadow-lg shadow-blue-500/20"
                      : "bg-card hover:bg-muted/50 border-border hover:border-primary/30"
                  }`}
                  onClick={() => setActiveFeature(feature)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-lg transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg"
                          : "bg-muted"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Feature Demo */}
          <div className="lg:sticky lg:top-24">
            <Card className="p-8 bg-card/50 backdrop-blur border-border shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <activeFeature.component />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
