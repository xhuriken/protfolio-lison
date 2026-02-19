import { useEffect, useState } from "react"
import { cn } from "~/lib/utils"

export function Meteors({
  className,
  children,
  count = 50,
  angle = 225,
  color = "gray",
  tailColor = "#61a3d15b"
}) {
  const [meteors, setMeteors] = useState([])

  // Generate meteor data on client only to avoid hydration mismatch
  useEffect(() => {
    setMeteors(Array.from({ length: count }, (_, i) => ({
      id: i,
      left: +60 + i * (30 / count), // Evenly distribute across width
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 7,
    })))
  }, [count])

  return (
    <div className={cn("absolute -z-10 rounded-[32px] inset-0 overflow-hidden ", className)}>
      {/* Keyframe animation - uses vmax for viewport scaling */}
      <style>{`
        @keyframes meteor-fall {
          0% {
            transform: rotate(${angle}deg) translateX(0);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: rotate(${angle}deg) translateX(-100vmax);
            opacity: 0;
          }
        }
      `}</style>
      {/* Meteors */}
      {meteors.map(meteor => (
        <span
          key={meteor.id}
          className="absolute h-0.5 w-0.5 rounded-full"
          style={{
            top: "-40px",
            left: `${meteor.left}%`,
            backgroundColor: color,
            boxShadow: "0 0 0 1px rgba(255,255,255,0.1)",
            animation: `meteor-fall ${meteor.duration}s linear infinite`,
            animationDelay: `${meteor.delay}s`,
          }}>
          {/* Tail */}
          <span
            className="absolute top-1/2 -translate-y-1/2"
            style={{
              left: "100%",
              width: "50px",
              height: "1px",
              background: `linear-gradient(to right, ${tailColor}, transparent)`,
            }} />
        </span>
      ))}

      {/* Content layer */}
      {children && <div className="relative z-10 h-full w-full">{children}</div>}
    </div>
  );
}

export default function MeteorsDemo() {
  return <Meteors />;
}
