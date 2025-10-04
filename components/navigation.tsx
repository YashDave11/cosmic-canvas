"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import { Rocket, Menu, X } from "lucide-react";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-effect border-b border-border/30 shadow-lg shadow-primary/5"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center gap-2 group cursor-pointer">
            <Rocket className="w-6 h-6 lg:w-8 lg:h-8 text-primary transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
            <span className="text-lg lg:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
              Cosmic Canvas
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#technology"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Technology
            </a>
            <a
              href="#community"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Community
            </a>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 animate-glow"
              onClick={() => (window.location.href = "/dashboard")}
            >
              Launch Dashboard
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <a
                href="#features"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#technology"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Technology
              </a>
              <a
                href="#community"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Community
              </a>

              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full animate-glow"
                onClick={() => (window.location.href = "/dashboard")}
              >
                Launch Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
