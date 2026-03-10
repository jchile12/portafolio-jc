import React, { useState } from "react";

interface CRTControlsProps {
  currentIndex: number;
  totalChannels: number;
  volume: number;
  isPoweredOn: boolean;
  isMuted: boolean;
  onChannelChange: (dir: number) => void;
  onVolumeChange: (change: number) => void;
  onPowerToggle: () => void;
  onMuteToggle: () => void;
  visible: boolean;
  onInteraction: () => void;
}

const CRTControls = ({
  currentIndex,
  totalChannels,
  volume,
  isPoweredOn,
  isMuted,
  onChannelChange,
  onVolumeChange,
  onPowerToggle,
  onMuteToggle,
  visible,
  onInteraction,
}: CRTControlsProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const ch = String(currentIndex + 1).padStart(2, "0");
  const isVisible = visible || isHovered;

  return (
    <div
      className={`absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-50
                 transition-opacity duration-300
                 pointer-events-none scale-[0.75] md:scale-[0.85] lg:scale-100 origin-left
                 ${isVisible ? "opacity-100" : "opacity-0"}`}
      onMouseEnter={() => { setIsHovered(true); onInteraction(); }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Remote body */}
      <div
        className="pointer-events-auto relative flex flex-col items-center gap-3 px-5 py-5 select-none"
        style={{
          width: 160,
          background: "linear-gradient(160deg, #2a2a2a 0%, #1a1a1a 50%, #111 100%)",
          borderRadius: "40px 40px 34px 34px",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.9), 0 4px 12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -2px 0 rgba(0,0,0,0.6)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Plastic texture highlight */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: "inherit",
            background:
              "radial-gradient(ellipse 60% 30% at 50% 8%, rgba(255,255,255,0.07) 0%, transparent 100%)",
          }}
        />

        {/* Brand label */}
        <div className="relative w-full text-center mb-1">
          <span
            className="text-[7px] font-mono tracking-[0.3em] uppercase"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            CRTV-01
          </span>
          <div
            className="mt-1 mx-auto"
            style={{
              height: 1,
              width: "60%",
              background:
                "linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)",
            }}
          />
        </div>

        {/* Top row: Power + Mute */}
        <div className="flex gap-2 w-full">
          <RemoteButton
            onClick={onPowerToggle}
            color={isPoweredOn ? "#ef4444" : "#555"}
            glow={isPoweredOn ? "rgba(239,68,68,0.5)" : "none"}
            size="wide"
            label="PWR"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 1.5v4M4 3.5A5 5 0 1 0 10 3.5"
                stroke={isPoweredOn ? "#fff" : "#888"}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </RemoteButton>
          <RemoteButton
            onClick={onMuteToggle}
            color={isMuted ? "#f59e0b" : "#3a3a3a"}
            glow={isMuted ? "rgba(245,158,11,0.5)" : "none"}
            size="wide"
            label="MUTE"
            disabled={!isPoweredOn}
          >
            <span className="font-mono text-[10px]" style={{ color: isMuted ? "#fff" : "#aaa" }}>
              {isMuted ? "MUTED" : "SOUND"}
            </span>
          </RemoteButton>
        </div>

        {/* LED indicator */}
        <div className="flex items-center gap-1.5">
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: isPoweredOn ? "#ef4444" : "#333",
              boxShadow: isPoweredOn ? "0 0 6px #ef4444" : "none",
              transition: "all 0.3s",
            }}
          />
          <span
            className="font-mono text-[7px] tracking-widest"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            {isPoweredOn ? "ON " : "OFF"}
          </span>
        </div>

        <Divider />

        {/* Channel display */}
        <div
          className="w-full text-center font-mono font-bold py-1 rounded-sm"
          style={{
            fontSize: 22,
            color: isPoweredOn ? "#4ade80" : "rgba(74,222,128,0.2)",
            textShadow: isPoweredOn ? "0 0 12px rgba(74,222,128,0.9)" : "none",
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(74,222,128,0.1)",
            letterSpacing: "0.1em",
            fontFamily: "'Courier New', monospace",
            transition: "all 0.3s",
          }}
        >
          {ch}
        </div>
        <span className="text-[7px] font-mono tracking-[0.25em] -mt-1"
          style={{ color: "rgba(255,255,255,0.15)" }}>
          CH / {String(totalChannels).padStart(2, "0")}
        </span>

        <Divider />

        {/* CH and VOL side by side */}
        <div className="flex gap-3 w-full">
          {/* CH column */}
          <div className="flex flex-col gap-1.5 flex-1">
            <span className="text-[9px] font-mono tracking-widest text-center font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>CH</span>
            <RemoteButton
              onClick={() => onChannelChange(1)}
              color="#3a3a3a"
              glow="none"
              size="wide"
              label="CH +"
              disabled={!isPoweredOn}
            >
              <span className="text-white/70 text-xs font-mono">+</span>
            </RemoteButton>
            <RemoteButton
              onClick={() => onChannelChange(-1)}
              color="#3a3a3a"
              glow="none"
              size="wide"
              label="CH −"
              disabled={!isPoweredOn}
            >
              <span className="text-white/70 text-xs font-mono">−</span>
            </RemoteButton>
          </div>

          {/* VOL column */}
          <div className="flex flex-col gap-1.5 flex-1">
            <span className="text-[9px] font-mono tracking-widest text-center font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>VOL</span>
            <RemoteButton
              onClick={() => onVolumeChange(10)}
              color="#3a3a3a"
              glow="none"
              size="wide"
              label="VOL +"
              disabled={!isPoweredOn}
            >
              <span className="text-white/70 text-xs font-mono">+</span>
            </RemoteButton>
            <RemoteButton
              onClick={() => onVolumeChange(-10)}
              color="#3a3a3a"
              glow="none"
              size="wide"
              label="VOL −"
              disabled={!isPoweredOn}
            >
              <span className="text-white/70 text-xs font-mono">−</span>
            </RemoteButton>
          </div>
        </div>

        {/* Volume bar */}
        <div className="w-full flex flex-col gap-1">
          <div className="flex justify-between">
            <span className="text-[6px] font-mono text-white/20 tracking-widest">VOL</span>
            <span className="text-[6px] font-mono text-white/30">{volume}%</span>
          </div>
          <div
            className="w-full h-1 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{
                width: `${volume}%`,
                background: isPoweredOn
                  ? volume > 70
                    ? "linear-gradient(to right, #4ade80, #facc15)"
                    : "#4ade80"
                  : "rgba(74,222,128,0.15)",
                boxShadow: isPoweredOn ? "0 0 4px rgba(74,222,128,0.5)" : "none",
              }}
            />
          </div>
        </div>

        {/* Bottom screw dots */}
        <div className="flex justify-between w-full mt-1 px-2">
          <div className="w-2 h-2 rounded-full bg-black/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]" />
          <div className="w-2 h-2 rounded-full bg-black/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]" />
        </div>
      </div>
    </div>
  );
};

/* ── Sub-components ── */

const Divider = () => (
  <div
    className="w-full"
    style={{
      height: 1,
      background: "linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)",
    }}
  />
);

interface RemoteButtonProps {
  onClick: () => void;
  color: string;
  glow: string;
  size: "sm" | "wide";
  label: string;
  disabled?: boolean;
  children: React.ReactNode;
}

const RemoteButton = ({ onClick, color, glow, size, disabled = false, children }: RemoteButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex items-center justify-center transition-all duration-100 active:translate-y-[1px]"
    style={{
      width: size === "wide" ? "100%" : 32,
      height: size === "wide" ? 28 : 32,
      borderRadius: size === "wide" ? 4 : "50%",
      background: disabled
        ? `${color}55`
        : `radial-gradient(circle at 40% 35%, ${color}ee, ${color}88)`,
      boxShadow: disabled
        ? "none"
        : `0 3px 0 rgba(0,0,0,0.6), 0 0 ${glow !== "none" ? `8px ${glow}` : "0px transparent"}, inset 0 1px 0 rgba(255,255,255,0.12)`,
      border: "1px solid rgba(0,0,0,0.3)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1,
    }}
  >
    {children}
  </button>
);

export default CRTControls;
