import { Users } from "lucide-react";

const communityImages = [
  { src: "/nebula-space-cosmic-background.jpg", label: "Cosmic Nebula" },
  { src: "/mars-surface-terrain.jpg", label: "Mars Surface" },
  { src: "/spiral-galaxy-deep-space.jpg", label: "Deep Space Galaxy" },
  { src: "/mars-planet-surface-map.jpg", label: "Mars Mapping" },
  { src: "/glacier-ice-before-melting.jpg", label: "Earth Climate" },
  { src: "/glacier-ice-after-melting.jpg", label: "Climate Change" },
];

export function CommunitySection() {
  return (
    <section id="community" className="relative py-20 lg:py-32 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 rounded-full px-4 py-2 mb-6">
            <Users className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">
              Join the Community
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">
            Your Next Discovery <span className="text-secondary">Awaits</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed mb-8">
            From identifying a new lunar crater to tracking the expansion of a
            nebula, every interaction contributes to our collective
            understanding of the cosmos. Whether you're a student, a scientist,
            or simply curious, your perspective is invaluable.
          </p>
        </div>

        {/* Image Mosaic */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {communityImages.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
            >
              <img
                src={image.src}
                alt={image.label}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-sm font-semibold">{image.label}</p>
                  <p className="text-xs text-muted-foreground">
                    Community Discovery
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Text */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            No account required • Free to explore • Powered by NASA
          </p>
        </div>
      </div>
    </section>
  );
}
