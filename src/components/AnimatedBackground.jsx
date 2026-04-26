export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Animated gradient mesh */}
      <div className="absolute inset-0 bg-slate-950">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      </div>

      {/* Floating blobs */}
      <div className="absolute -top-[20%] -left-[10%] h-[600px] w-[600px] rounded-full bg-brand-600/20 blur-[120px] animate-blob-slow" />
      <div className="absolute top-[40%] -right-[10%] h-[500px] w-[500px] rounded-full bg-accent-600/15 blur-[100px] animate-blob-slow-reverse" />
      <div className="absolute -bottom-[10%] left-[20%] h-[450px] w-[450px] rounded-full bg-cyan-600/10 blur-[90px] animate-blob-float" />
      <div className="absolute top-[10%] right-[30%] h-[300px] w-[300px] rounded-full bg-purple-600/10 blur-[80px] animate-blob-drift" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating particles - pure CSS */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white animate-particle"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.1,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 15 + 10}s`,
            }}
          />
        ))}
      </div>

      {/* Bottom vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
    </div>
  );
}
