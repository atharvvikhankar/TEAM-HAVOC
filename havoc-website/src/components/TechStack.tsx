export default function TechStack() {
  const categories = [
    {
      title: "Frontend",
      tools: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    },
    {
      title: "Backend",
      tools: ["Node.js", "Firebase", "REST APIs"],
    },
    {
      title: "AI",
      tools: ["OpenAI", "Gemini", "Groq", "LLM APIs"],
    },
    {
      title: "Mobile",
      tools: ["Flutter", "Dart"],
    },
    {
      title: "Database",
      tools: ["Firebase", "Firestore"],
    },
    {
      title: "Deployment",
      tools: ["Vercel", "GitHub"],
    },
  ];

  return (
    <section className="py-24 px-6 bg-light-gray/30 border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">
            Our Toolbox
          </h2>
          <p className="text-base font-medium text-foreground/70">
            Technologies we work with / experiment with
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
          {categories.map((category, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <h3 className="text-sm font-bold text-foreground/50 tracking-widest uppercase mb-4 group-hover:text-foreground transition-colors">
                {category.title}
              </h3>
              <ul className="space-y-3">
                {category.tools.map((tool, j) => (
                  <li key={j} className="text-lg font-semibold">
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
