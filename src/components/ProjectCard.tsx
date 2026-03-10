import { ArrowUpRight, Play, SkipBack, SkipForward } from "lucide-react";

interface ProjectCardProps {
  title: string;
  category: string;
  description: string;
  image: string;
  large?: boolean;
}

const ProjectCard = ({ title, category, description, image, large = false }: ProjectCardProps) => {
  return (
    <div 
      className={`group relative cursor-pointer hover-lift ${
        large ? 'md:col-span-2 w-[220px]' : 'w-[180px]'
      } mx-auto`}
    >
      {/* iPod Classic Body */}
      <div className="relative bg-gradient-to-b from-[#e8e8e8] via-[#d8d8d8] to-[#b8b8b8] rounded-[1.5rem] p-2 shadow-[0_10px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-2px_0_rgba(0,0,0,0.1)] border border-[#a0a0a0]">
        
        {/* Chrome bezel around screen */}
        <div className="bg-gradient-to-b from-[#c0c0c0] to-[#909090] rounded-xl p-[2px] mb-3">
          {/* Screen Area */}
          <div className={`relative bg-gradient-to-b from-[#2a3a4a] to-[#1a2a3a] rounded-[10px] overflow-hidden shadow-[inset_0_2px_8px_rgba(0,0,0,0.9)] ${large ? 'aspect-[4/3]' : 'aspect-[4/3]'}`}>
            {/* LCD pixel grid effect */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)' }} />
            
            {/* Project image as screen content */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${image})` }}
            />
            
            {/* Screen overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a2a3a] via-[#1a2a3a]/50 to-transparent" />
            
            {/* Screen glare */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent pointer-events-none" />
            
            {/* Content overlay */}
            <div className="absolute inset-0 p-3 flex flex-col justify-end">
              <span className="text-primary text-[9px] uppercase tracking-widest font-body mb-0.5">
                {category}
              </span>
              <h3 className="font-display font-bold text-sm text-white mb-0.5 leading-tight">
                {title}
              </h3>
              <p className="text-muted-foreground/80 font-body text-[9px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
                {description}
              </p>
            </div>

            {/* Arrow indicator */}
            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="w-3 h-3 text-primary" />
            </div>
          </div>
        </div>

        {/* Click Wheel */}
        <div className={`relative mx-auto ${large ? 'w-[130px] h-[130px]' : 'w-[120px] h-[120px]'} mb-2`}>
          {/* Outer wheel */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#fafafa] to-[#d0d0d0] shadow-[0_2px_8px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_2px_rgba(0,0,0,0.1)] border border-[#b0b0b0]">
            {/* Menu label */}
            <span className="absolute top-3 left-1/2 -translate-x-1/2 text-[8px] font-bold text-[#666] tracking-[0.15em]">MENU</span>
            {/* Play/Pause */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2">
              <Play className="w-3 h-3 text-[#666] fill-[#666]" />
            </div>
            {/* Rewind */}
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2">
              <SkipBack className="w-3 h-3 text-[#666] fill-[#666]" />
            </div>
            {/* Fast Forward */}
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
              <SkipForward className="w-3 h-3 text-[#666] fill-[#666]" />
            </div>
          </div>
          
          {/* Center select button */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${large ? 'w-[46px] h-[46px]' : 'w-[42px] h-[42px]'} rounded-full bg-gradient-to-b from-[#f0f0f0] to-[#d8d8d8] shadow-[0_2px_6px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,1)] border border-[#c0c0c0] group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-shadow`} />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
