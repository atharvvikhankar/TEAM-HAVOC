export default function Projects() {
  const projects = [
    {
      id: "01",
      name: "Project Alpha",
      desc: "A rapid prototyping tool for hackathons. Automates initial codebase setup and deployment pipelines within seconds.",
      stack: "Next.js · TypeScript · Firebase",
      status: "In Development",
    },
    {
      id: "02",
      name: "AI Study Buddy",
      desc: "An intelligent tutor that generates personalized quizzes and study guides from lecture transcripts.",
      stack: "React · Node.js · OpenAI · Groq",
      status: "MVP Shipped",
    },
  ];

  return (
    <section id="projects" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">
            Selected Work
          </h2>
          <p className="text-base text-foreground/70 font-medium max-w-2xl">
            A showcase of products built during hackathons, sprint weeks, and late-night coding sessions.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="flex flex-col md:flex-row border border-border rounded-3xl overflow-hidden group hover:border-foreground/30 transition-colors"
            >
              {/* Project Image Placeholder */}
              <div className="w-full md:w-2/5 bg-light-gray min-h-[250px] relative overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r border-border">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.02)_50%,transparent_75%)] bg-[length:250px_250px] animate-[shimmer_3s_linear_infinite]" />
                <span className="text-foreground/30 font-bold tracking-widest uppercase">Project Asset Placeholder</span>
              </div>
              
              {/* Project Details */}
              <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-bold text-foreground/50">PROJECT {project.id}</span>
                  <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-light-gray rounded-sm">
                    {project.status}
                  </span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold mb-4">{project.name}</h3>
                <p className="text-foreground/70 font-medium mb-6 leading-relaxed">
                  {project.desc}
                </p>
                
                <div className="text-sm font-semibold text-foreground/80 mb-8">
                  Stack: {project.stack}
                </div>
                
                <div className="flex flex-wrap gap-4 mt-auto">
                  <a href="#" className="px-6 py-2.5 bg-foreground text-background text-sm font-semibold rounded-full hover:opacity-90 transition-opacity">
                    VIEW PROJECT
                  </a>
                  <a href="#" className="px-6 py-2.5 bg-white text-foreground border border-border text-sm font-semibold rounded-full hover:bg-light-gray transition-colors">
                    GITHUB
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
