import { useState } from "react";
import VideoCarousel from "./VideoCarousel";

const videos = [
  {
    id: "1",
    title: "Neural Interface",
    category: "3D / Motion Design",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    poster: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
  {
    id: "2",
    title: "Kinetic Typography",
    category: "Motion Graphics",
    src: "https://www.w3schools.com/html/movie.mp4",
    poster: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80",
  },
  {
    id: "3",
    title: "Smart Home Hub",
    category: "UX/UI Design",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    poster: "https://images.unsplash.com/photo-1558002038-bb0413e05cb0?w=600&q=80",
  },
  {
    id: "4",
    title: "Generative Art",
    category: "Creative Coding",
    src: "https://www.w3schools.com/html/movie.mp4",
    poster: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
  },
];

const Projects = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  return (
    <section id="work" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16">
          <p className="text-primary text-sm uppercase tracking-widest mb-4 font-body">
            Selected Work
          </p>
          <h2 className="font-display font-bold text-4xl md:text-6xl mb-4">
            Featured <span className="text-gradient-accent">Projects</span>
          </h2>
          <p className="text-muted-foreground font-body max-w-md">
            Explora mis proyectos usando los controles del iPod. Presiona play para reproducir y los botones laterales para navegar.
          </p>
        </div>

        <div className="flex justify-center">
          <VideoCarousel videos={videos} currentVideoIndex={currentVideoIndex} onIndexChange={setCurrentVideoIndex} />
        </div>

        <div className="flex justify-center mt-12">
          <a 
            href="#" 
            className="text-muted-foreground hover:text-primary transition-colors font-body group"
          >
            View All Projects 
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
