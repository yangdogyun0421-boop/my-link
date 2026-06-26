export default function LandingPage() {
  return (
    <div className="min-h-screen w-full relative selection:bg-accent selection:text-white pb-20">
      
      {/* Navigation (Floating) */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
        <div className="clay-card !rounded-full px-8 py-4 flex justify-between items-center backdrop-blur-sm bg-background/90">
          <span className="font-extrabold text-xl tracking-tighter text-foreground">YD.</span>
          <div className="hidden md:flex gap-8 font-semibold text-sm text-foreground/70">
            <a href="#about" className="hover:text-accent transition-colors">About</a>
            <a href="#skills" className="hover:text-accent transition-colors">Skills</a>
            <a href="#projects" className="hover:text-accent transition-colors">Projects</a>
          </div>
          <a href="#contact" className="clay-button px-6 py-2 text-sm font-bold tracking-wide">
            HIRE ME
          </a>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-40 md:pt-48">
        
        {/* HERO SECTION */}
        <section id="about" className="min-h-[70vh] flex flex-col justify-center items-start">
          <div className="clay-badge px-4 py-2 mb-8 inline-block text-sm font-bold text-accent">
            👋 Welcome to my world
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] text-foreground mb-6">
            HELLO, I'M <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400 drop-shadow-sm">
              YANG DO KYUN
            </span>
          </h1>
          <p className="text-xl md:text-3xl font-medium text-foreground/60 max-w-3xl mt-4 leading-relaxed">
            I craft <span className="font-bold text-foreground">soft, beautiful, and interactive</span> digital experiences. 
            A passionate student and frontend developer focusing on modern UI design.
          </p>
        </section>

        {/* BENTO GRID (Skills & Info) */}
        <section id="skills" className="mt-32">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">My Playground</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Card 1: Main Focus */}
            <div className="clay-card p-10 lg:col-span-2 flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-4">Frontend Development</h3>
              <p className="text-foreground/70 mb-8 text-lg">
                I specialize in building highly interactive and responsive web applications using the latest web technologies.
              </p>
              <div className="flex flex-wrap gap-4">
                {['React', 'Next.js', 'TypeScript', 'Tailwind CSS'].map(tech => (
                  <span key={tech} className="clay-badge px-5 py-2.5 font-semibold text-foreground/80">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Card 2: UI/UX */}
            <div className="clay-card p-10 bg-gradient-to-br flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 clay-badge !rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-xl font-bold mb-3">UI / UX Design</h3>
              <p className="text-foreground/70 text-sm">
                Focusing on micro-interactions, accessibility, and playful design trends like Claymorphism.
              </p>
            </div>

            {/* Card 3: Soft Skills */}
            <div className="clay-card p-10 flex flex-col justify-between">
              <h3 className="text-xl font-bold mb-6">Capabilities</h3>
              <ul className="space-y-4 font-medium text-foreground/80">
                <li className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-400 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.2)]"></div>
                  Problem Solving
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-400 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.2)]"></div>
                  Fast Learning
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.2)]"></div>
                  Team Collaboration
                </li>
              </ul>
            </div>

            {/* Card 4: Stats */}
            <div className="clay-card p-10 lg:col-span-2 flex items-center justify-around flex-wrap gap-8">
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-black text-accent drop-shadow-sm mb-2">10+</div>
                <div className="font-bold text-foreground/60 uppercase tracking-wider text-sm">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-black text-accent drop-shadow-sm mb-2">100%</div>
                <div className="font-bold text-foreground/60 uppercase tracking-wider text-sm">Passion</div>
              </div>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-black text-accent drop-shadow-sm mb-2">24/7</div>
                <div className="font-bold text-foreground/60 uppercase tracking-wider text-sm">Learning</div>
              </div>
            </div>

          </div>
        </section>

        {/* CTA / CONTACT */}
        <section id="contact" className="mt-40 mb-20">
          <div className="clay-card p-12 md:p-20 text-center relative overflow-hidden">
            <h2 className="text-4xl md:text-6xl font-black mb-6 relative z-10">Let's build something <br/> soft and amazing.</h2>
            <p className="text-lg md:text-xl text-foreground/70 mb-10 max-w-2xl mx-auto relative z-10">
              I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
            </p>
            <button className="clay-button px-10 py-5 text-lg font-bold tracking-widest uppercase relative z-10">
              Get in Touch
            </button>
            
            {/* Decorative background blobs inside the card */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
          </div>
        </section>

      </main>
      
      {/* Footer */}
      <footer className="text-center py-8 font-medium text-foreground/50 text-sm">
        <p>© 2026 Yang Do Kyun. Designed with Claymorphism & Next.js.</p>
      </footer>
    </div>
  );
}
