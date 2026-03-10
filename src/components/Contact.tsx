import { Mail, ArrowUpRight, Github, Linkedin, Twitter } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary text-sm uppercase tracking-widest mb-4 font-body">
            Let's Connect
          </p>
          <h2 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl mb-8">
            Ready to Create
            <br />
            <span className="text-gradient">Something Amazing?</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-12 font-body">
            Whether you have a project in mind or just want to chat about the future of digital experiences, 
            I'd love to hear from you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <a 
              href="mailto:hello@example.com"
              className="group flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-display font-semibold text-lg rounded-full transition-all duration-300 hover:scale-105 glow-primary"
            >
              <Mail className="w-5 h-5" />
              hello@example.com
              <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </div>

          {/* Social links */}
          <div className="flex justify-center gap-6">
            {[
              { icon: Github, href: "#", label: "GitHub" },
              { icon: Linkedin, href: "#", label: "LinkedIn" },
              { icon: Twitter, href: "#", label: "Twitter" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300"
                aria-label={label}
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
