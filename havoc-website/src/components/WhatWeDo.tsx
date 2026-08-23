export default function WhatWeDo() {
  const capabilities = [
    {
      title: "Hackathons",
      desc: "Rapid ideation, prototyping and product development under time constraints.",
    },
    {
      title: "AI & Emerging Tech",
      desc: "Experiment with AI, LLMs, automation and new technologies.",
    },
    {
      title: "Product Development",
      desc: "Turn ideas into usable web and mobile products.",
    },
    {
      title: "Problem Solving",
      desc: "Break complex real-world problems into practical solutions.",
    },
    {
      title: "Rapid Prototyping",
      desc: "Build functional MVPs quickly and iterate based on feedback.",
    },
    {
      title: "Team Collaboration",
      desc: "Combine different skills to build better products.",
    },
  ];

  return (
    <section id="what-we-do" className="py-24 px-6 bg-light-gray/20 border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
            What We Do
          </h2>
          <p className="max-w-sm text-base text-foreground/70 font-medium">
            We operate at the intersection of speed, technology, and practical engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, i) => (
            <div 
              key={i}
              className="p-8 bg-white border border-border rounded-2xl hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 transition-all duration-300"
            >
              <h3 className="text-xl font-bold mb-3">{cap.title}</h3>
              <p className="text-foreground/70 text-sm font-medium leading-relaxed">
                {cap.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
