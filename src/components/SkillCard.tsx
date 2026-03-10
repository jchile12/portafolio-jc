import { LucideIcon } from "lucide-react";

interface SkillCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  technologies: string[];
  accentClass: string;
}

const SkillCard = ({ icon: Icon, title, description, technologies, accentClass }: SkillCardProps) => {
  return (
    <div className="group relative cursor-pointer hover-lift w-[180px] mx-auto">
      {/* iPod Classic Body - tall and narrow like the real thing */}
      <div className="relative bg-gradient-to-b from-[#e8e8e8] via-[#d8d8d8] to-[#b8b8b8] rounded-[1.5rem] p-2 shadow-[0_10px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-2px_0_rgba(0,0,0,0.1)] border border-[#a0a0a0]">
        
        {/* Chrome bezel around screen */}
        <div className="bg-gradient-to-b from-[#c0c0c0] to-[#909090] rounded-xl p-[2px] mb-3">
          {/* Screen Area - rectangular like classic iPod */}
          <div className="relative bg-gradient-to-b from-[#2a3a4a] to-[#1a2a3a] rounded-[10px] p-3 aspect-[4/3] shadow-[inset_0_2px_8px_rgba(0,0,0,0.9)] overflow-hidden">
            {/* LCD pixel grid effect */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)' }} />
            
            {/* Screen glare */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent pointer-events-none" />
            
            {/* Content on screen */}
            <div className={`w-10 h-10 rounded-md flex items-center justify-center mb-2 ${accentClass} shadow-[0_0_15px_rgba(139,92,246,0.6)] transition-transform duration-500 group-hover:scale-110`}>
              <Icon className="w-5 h-5 text-background" />
            </div>
            
            <h3 className="font-display font-bold text-sm text-white mb-1 group-hover:text-primary transition-colors leading-tight">
              {title}
            </h3>
            
            <p className="text-muted-foreground/80 font-body text-[10px] leading-tight line-clamp-2">
              {description}
            </p>
          </div>
        </div>

        {/* Click Wheel - proportionally larger like real iPod */}
        <div className="relative mx-auto w-[120px] h-[120px] mb-2">
          {/* Outer wheel with touch-sensitive look */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#fafafa] to-[#d0d0d0] shadow-[0_2px_8px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_2px_rgba(0,0,0,0.1)] border border-[#b0b0b0]">
            {/* Menu label */}
            <span className="absolute top-3 left-1/2 -translate-x-1/2 text-[8px] font-bold text-[#666] tracking-[0.15em]">MENU</span>
            {/* Play/Pause */}
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-[#666]">▶︎ ❙❙</span>
            {/* Rewind */}
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] text-[#666]">◀◀</span>
            {/* Fast Forward */}
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-[#666]">▶▶</span>
          </div>
          
          {/* Center select button */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42px] h-[42px] rounded-full bg-gradient-to-b from-[#f0f0f0] to-[#d8d8d8] shadow-[0_2px_6px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,1)] border border-[#c0c0c0] group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-shadow" />
        </div>

        {/* Technologies as "Now Playing" ticker */}
        <div className="flex flex-wrap justify-center gap-1 px-1">
          {technologies.slice(0, 3).map((tech) => (
            <span 
              key={tech}
              className="px-1.5 py-0.5 text-[8px] bg-[#444] text-white/90 rounded-sm font-body"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
