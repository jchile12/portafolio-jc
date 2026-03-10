import { motion } from "framer-motion";
import { Play } from "lucide-react";

interface VHSCardProps {
  id?: string;
  title: string;
  category: string;
  poster: string;
  isActive: boolean;
  onClick: () => void;
  index: number;
}

// Accent colors per card index — mimics different tape label colors
const LABEL_COLORS = ["#1a6b5a", "#1a3f6b", "#6b1a2a", "#4a1a6b", "#1a5a1a"];

const VHSCard = ({ title, category, poster, isActive, onClick, index }: VHSCardProps) => {
  const accentColor = LABEL_COLORS[index % LABEL_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`group relative cursor-pointer transition-transform duration-300 ${isActive ? "scale-[1.02]" : "hover:scale-[1.02]"}`}
      onClick={onClick}
    >
      {/* ── Cassette body — 188:104 real-world ratio ── */}
      <div
        className={`relative w-full select-none ${isActive ? "ring-1 ring-white/25" : ""}`}
        style={{
          aspectRatio: "188 / 104",
          borderRadius: "4px 4px 3px 3px",
          background: "linear-gradient(175deg, #323232 0%, #282828 40%, #242424 100%)",
          boxShadow: isActive
            ? "0 0 0 1px rgba(255,255,255,0.15), 0 12px 40px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.1)"
            : "0 8px 28px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >

        {/* ── Subtle body texture (fine dot grid) ── */}
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "4px 4px",
            opacity: 0.5,
          }}
        />

        {/* ── Top edge highlight ── */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t" />

        {/* ── Side edge shadows ── */}
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-black/40 to-transparent" />

        {/* ─────────────────────────────────────
            REEL WINDOW — top ~45% of face
        ───────────────────────────────────── */}
        <div
          className="absolute"
          style={{
            top: "8%",
            left: "5%",
            right: "5%",
            height: "46%",
            background: "#0d0f0e",
            borderRadius: "3px 3px 20px 20px",
            boxShadow:
              "inset 0 4px 16px rgba(0,0,0,0.95), inset 0 0 0 1px rgba(255,255,255,0.07), 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          {/* Tinted window glass */}
          <div
            className="absolute inset-0 rounded-[inherit] pointer-events-none"
            style={{
              background:
                "linear-gradient(160deg, rgba(60,80,60,0.08) 0%, transparent 60%)",
            }}
          />

          {/* Tape path strip (horizontal across center) */}
          <div
            className="absolute left-0 right-0"
            style={{
              top: "50%",
              transform: "translateY(-50%)",
              height: "7%",
              background: "linear-gradient(to right, transparent, rgba(30,15,0,0.9) 15%, rgba(40,20,0,1) 50%, rgba(30,15,0,0.9) 85%, transparent)",
            }}
          />

          {/* ── Left reel (supply — fuller) ── */}
          <div
            className="absolute"
            style={{
              left: "8%",
              top: "50%",
              transform: "translateY(-50%)",
              width: "30%",
              aspectRatio: "1",
            }}
          >
            <Reel spinning={isActive} direction="normal" filled={isActive ? 0.6 : 0.5} />
          </div>

          {/* ── Right reel (takeup — less full when playing) ── */}
          <div
            className="absolute"
            style={{
              right: "8%",
              top: "50%",
              transform: "translateY(-50%)",
              width: "30%",
              aspectRatio: "1",
            }}
          >
            <Reel spinning={isActive} direction="reverse" filled={isActive ? 0.25 : 0.5} />
          </div>

          {/* Center guide post */}
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-[10%]"
            style={{
              width: "3%",
              aspectRatio: "1",
              background: "#1a1a1a",
              borderRadius: "50%",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.08)",
            }}
          />

          {/* Window glare reflection */}
          <div
            className="absolute inset-0 rounded-[inherit] pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 35%)",
            }}
          />
        </div>

        {/* ─────────────────────────────────────
            LABEL STICKER — below window
        ───────────────────────────────────── */}
        <div
          className="absolute overflow-hidden flex flex-col"
          style={{
            top: "57%",
            left: "5%",
            right: "5%",
            bottom: "12%",
            borderRadius: "1px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.6), inset 0 0 0 0.5px rgba(0,0,0,0.3)",
          }}
        >
          {/* ── Label header band (brand color) ── */}
          <div
            className="relative shrink-0 overflow-hidden"
            style={{
              height: "38%",
              background: accentColor,
            }}
          >
            {/* Poster as very subtle tint behind header */}
            <img
              src={poster}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: 0.15, filter: "saturate(0.4) brightness(0.6)", mixBlendMode: "luminosity" }}
            />
            {/* Horizontal stripe lines (Panasonic style) */}
            <div className="absolute inset-0 flex flex-col justify-evenly px-2 py-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-px bg-white/20" />
              ))}
            </div>
            {/* Category text */}
            <div className="absolute inset-0 flex items-center px-2 justify-between">
              <span
                className="text-white font-bold uppercase tracking-widest"
                style={{ fontSize: "clamp(5px, 0.9vw, 8px)", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
              >
                {category}
              </span>
              {isActive && (
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-red-400 animate-pulse shadow-[0_0_4px_red]" />
                  <span className="text-red-300 text-[5px] font-mono tracking-widest">REC</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Write-on area (cream/white) ── */}
          <div
            className="relative flex-1 px-2 flex flex-col justify-center overflow-hidden"
            style={{ background: "#ede8d8" }}
          >
            {/* Ruled lines */}
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute left-2 right-2"
                style={{
                  top: `${22 + i * 30}%`,
                  height: "0.5px",
                  background: "rgba(90,70,50,0.2)",
                }}
              />
            ))}

            {/* Title */}
            <h3
              className="relative font-bold leading-tight truncate"
              style={{
                color: "#1c1410",
                fontFamily: "var(--font-heading, sans-serif)",
                fontSize: "clamp(7px, 1.3vw, 12px)",
              }}
            >
              {title}
            </h3>

            {/* Hover play */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${isActive ? "opacity-0" : "opacity-0 group-hover:opacity-100"}`}
              style={{ background: "rgba(0,0,0,0.18)" }}
            >
              <div className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <Play className="w-3 h-3 text-white fill-white" />
              </div>
            </div>
          </div>

          {/* ── Technical specs strip ── */}
          <div
            className="shrink-0 flex items-center justify-between px-2"
            style={{
              height: "22%",
              background: "#ddd6c2",
              borderTop: "0.5px solid rgba(0,0,0,0.12)",
            }}
          >
            {["SP □ LP □", "MONO □ STEREO □", "NR ON □ OFF □"].map((text) => (
              <span
                key={text}
                className="font-mono"
                style={{ fontSize: "4.5px", color: "rgba(50,35,20,0.5)", letterSpacing: "0.04em" }}
              >
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* ─────────────────────────────────────
            BOTTOM TAPE DOOR
        ───────────────────────────────────── */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: "12%",
            background: "linear-gradient(to bottom, #1e1e1e, #151515)",
            borderRadius: "0 0 3px 3px",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.7)",
          }}
        >
          {/* Tape exposure windows */}
          <div
            className="absolute"
            style={{
              left: "18%", top: "20%", width: "24%", height: "60%",
              border: "0.5px solid rgba(255,255,255,0.07)",
              borderRadius: "1px",
            }}
          />
          <div
            className="absolute"
            style={{
              right: "18%", top: "20%", width: "24%", height: "60%",
              border: "0.5px solid rgba(255,255,255,0.07)",
              borderRadius: "1px",
            }}
          />
        </div>

        {/* ── Corner screws ── */}
        {[
          { top: "7%",  left:  "1.8%" },
          { top: "7%",  right: "1.8%" },
          { bottom: "13%", left:  "1.8%" },
          { bottom: "13%", right: "1.8%" },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              ...pos,
              width: "3%",
              aspectRatio: "1",
              background: "radial-gradient(circle at 35% 35%, #383838, #181818)",
              boxShadow: "inset 0 1px 1px rgba(255,255,255,0.12), 0 1px 2px rgba(0,0,0,0.6)",
            }}
          >
            {/* Phillips cross */}
            <svg viewBox="0 0 10 10" className="absolute inset-0 w-full h-full opacity-40">
              <line x1="5" y1="2" x2="5" y2="8" stroke="rgba(0,0,0,0.8)" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="2" y1="5" x2="8" y2="5" stroke="rgba(0,0,0,0.8)" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
        ))}

      </div>

      {/* Floor shadow */}
      <div className="absolute -bottom-2 left-[8%] right-[8%] h-3 bg-black/50 blur-lg rounded-full pointer-events-none" />
    </motion.div>
  );
};

/* ── Reel ── */
interface ReelProps {
  spinning: boolean;
  direction: "normal" | "reverse";
  filled: number; // 0–1
}

const Reel = ({ spinning, direction, filled }: ReelProps) => {
  const SPOKES  = 5;
  const OUTER_R = 44;
  const HUB_R   = 12;
  const tapeR   = HUB_R + (OUTER_R - HUB_R) * filled;

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      style={{
        animation: spinning
          ? `spin 2.5s linear infinite ${direction === "reverse" ? "reverse" : "normal"}`
          : "none",
      }}
    >
      {/* Tape wound mass */}
      <circle cx="50" cy="50" r={tapeR} fill="#1a0c00" />
      <circle cx="50" cy="50" r={tapeR} fill="none" stroke="rgba(100,55,10,0.5)" strokeWidth="0.8" />

      {/* Outer rim */}
      <circle cx="50" cy="50" r={OUTER_R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />

      {/* Spokes */}
      {Array.from({ length: SPOKES }).map((_, i) => {
        const a   = ((i / SPOKES) * 2 * Math.PI);
        const x1  = 50 + HUB_R   * Math.cos(a);
        const y1  = 50 + HUB_R   * Math.sin(a);
        const x2  = 50 + (OUTER_R - 2) * Math.cos(a);
        const y2  = 50 + (OUTER_R - 2) * Math.sin(a);
        return (
          <line
            key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(200,200,200,0.18)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        );
      })}

      {/* Hub ring */}
      <circle cx="50" cy="50" r={HUB_R} fill="#111" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      {/* Center D-hole */}
      <circle cx="50" cy="50" r="4" fill="#0a0a0a" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
    </svg>
  );
};

export default VHSCard;
