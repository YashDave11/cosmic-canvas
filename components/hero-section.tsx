"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Play, X } from "lucide-react";
import { useState } from "react";

export function HeroSection() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <>
      {/* Video Popup Modal */}
      {showVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="relative w-full max-w-5xl mx-4 aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-primary transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <iframe
              className="w-full h-full rounded-lg shadow-2xl"
              src="https://www.youtube.com/embed/F1R-lERY08E?si=IiEfABf6vWzsfA25&autoplay=1"
              title="Cosmic Canvas Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        {/* Enhanced Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/12 via-transparent to-secondary/12 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-primary/5 to-transparent z-10" />
          <img
            src="/nebula-space-cosmic-background.jpg"
            alt="Nebula background"
            className="w-full h-full object-cover opacity-60 animate-float"
          />
        </div>

        {/* Content */}
        <div className="relative z-20 max-w-5xl mx-auto text-center">
          {/* NASA Logo */}
          <div className="mb-10 flex justify-center animate-float">
            <img
              src="/nasa.jpg"
              alt="NASA Logo"
              className="h-32 md:h-40 lg:h-48 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
            />
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-tight animate-fade-in-up">
            Navigate the Cosmos.{" "}
            <span className="text-primary bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-gradient">
              Pixel by Infinite Pixel.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto text-pretty leading-relaxed animate-fade-in-up animation-delay-200">
            Our platform transforms NASA's terabyte-scale images into a fluid,
            interactive canvas. Zoom into nebulae, track Martian dust storms,
            and uncover the universe's hidden details.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up animation-delay-400">
            {/* Primary CTA Button */}
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-300 ease-out rounded-xl overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50 active:scale-95"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-2">
                Begin Exploration
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600 to-purple-600 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            </button>

            {/* Secondary Button - Watch Demo */}
            <button
              onClick={() => setShowVideo(true)}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-300 ease-out rounded-xl overflow-hidden border-2 border-white/20 hover:border-white/40 hover:bg-white/5 backdrop-blur-sm hover:scale-105 active:scale-95"
            >
              <span className="absolute inset-0 w-0 h-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 transition-all duration-500 ease-out group-hover:w-full"></span>
              <span className="relative flex items-center gap-2">
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Watch Demo
              </span>
            </button>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-12 animate-fade-in-up animation-delay-600">
            <div className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm text-white/80 hover:bg-white/10 transition-all duration-300 cursor-default">
              ✨ 512 Megapixel Images
            </div>
            <div className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm text-white/80 hover:bg-white/10 transition-all duration-300 cursor-default">
              🔍 Deep Zoom Technology
            </div>
            <div className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm text-white/80 hover:bg-white/10 transition-all duration-300 cursor-default">
              📍 Smart Annotations
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-20 animate-bounce">
            <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full mx-auto flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
