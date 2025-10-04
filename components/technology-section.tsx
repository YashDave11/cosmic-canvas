import { Database, Zap, Globe } from "lucide-react"
import { Card } from "@/components/ui/card"

const techSteps = [
  {
    icon: Database,
    title: "NASA Mission Data",
    description: "We source high-resolution imagery directly from NASA missions and archives",
  },
  {
    icon: Zap,
    title: "Efficient Processing",
    description: "Our pipeline converts terabyte-scale images into optimized DZI tiles",
  },
  {
    icon: Globe,
    title: "Seamless Delivery",
    description: "Experience fast, smooth exploration directly in your browser",
  },
]

export function TechnologySection() {
  return (
    <section id="technology" className="relative py-20 lg:py-32 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
            The Science of a <span className="text-secondary">Seamless Experience</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Built on cutting-edge technology to deliver unparalleled performance
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {techSteps.map((step, index) => {
            const Icon = step.icon
            return (
              <Card
                key={index}
                className="p-8 bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div className="mb-4 text-4xl font-bold text-muted-foreground/30">0{index + 1}</div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </Card>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-3">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Processing petabytes of data for instant exploration</span>
          </div>
        </div>
      </div>
    </section>
  )
}
