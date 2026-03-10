import { Box, Sparkles, Palette, Cpu } from "lucide-react";
import SkillCard from "./SkillCard";

const skills = [
  {
    icon: Box,
    title: "3D Design",
    description: "Creating immersive 3D worlds, product visualizations, and interactive experiences that push the boundaries of digital space.",
    technologies: ["Blender", "Three.js", "Cinema 4D", "WebGL"],
    accentClass: "bg-primary",
  },
  {
    icon: Sparkles,
    title: "Motion Graphics",
    description: "Bringing stories to life through dynamic animations, kinetic typography, and captivating visual narratives.",
    technologies: ["After Effects", "Lottie", "GSAP", "Framer Motion"],
    accentClass: "bg-secondary",
  },
  {
    icon: Palette,
    title: "UX/UI Design",
    description: "Designing intuitive interfaces that balance aesthetics with functionality, creating seamless user journeys.",
    technologies: ["Figma", "Prototyping", "Design Systems", "User Research"],
    accentClass: "bg-accent",
  },
  {
    icon: Cpu,
    title: "Electronic Prototyping",
    description: "Building tangible experiences by bridging digital and physical worlds through custom hardware solutions.",
    technologies: ["Arduino", "Raspberry Pi", "Sensors", "IoT"],
    accentClass: "bg-primary",
  },
];

const Skills = () => {
  return (
    <section id="skills" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-primary text-sm uppercase tracking-widest mb-4 font-body">
            What I Do
          </p>
          <h2 className="font-display font-bold text-4xl md:text-6xl">
            Core <span className="text-gradient">Expertise</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {skills.map((skill, index) => (
            <div 
              key={skill.title}
              className="opacity-0 animate-scale-in"
              style={{ animationDelay: `${index * 0.15}s`, animationFillMode: 'forwards' }}
            >
              <SkillCard {...skill} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
