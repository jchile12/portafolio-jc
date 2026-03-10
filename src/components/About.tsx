const About = () => {
  return (
    <section id="about" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 border-2 border-primary/30 rounded-2xl -z-10" />
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl" />
            </div>

            {/* Content */}
            <div>
              <p className="text-primary text-sm uppercase tracking-widest mb-4 font-body">
                About Me
              </p>
              <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
                Bridging <span className="text-gradient">Art</span> & 
                <span className="text-gradient-accent"> Technology</span>
              </h2>
              <div className="space-y-4 text-muted-foreground font-body leading-relaxed">
                <p>
                  I'm a creative technologist passionate about pushing the boundaries of what's 
                  possible at the intersection of design and technology.
                </p>
                <p>
                  With a background spanning 3D visualization, motion design, interface design, 
                  and hardware prototyping, I bring a unique perspective to every project.
                </p>
                <p>
                  My work focuses on creating experiences that are not just visually stunning, 
                  but also meaningful and impactful.
                </p>
              </div>

              <div className="mt-8 flex gap-8">
                <div>
                  <div className="font-display font-bold text-4xl text-primary">5+</div>
                  <div className="text-muted-foreground text-sm font-body">Years Experience</div>
                </div>
                <div>
                  <div className="font-display font-bold text-4xl text-secondary">50+</div>
                  <div className="text-muted-foreground text-sm font-body">Projects Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
