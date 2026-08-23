export default function About() {
  const stats = [
    {
      num: "01",
      title: "BUILD",
      desc: "Rapidly turn ideas into working products.",
    },
    {
      num: "02",
      title: "COMPETE",
      desc: "Take ambitious ideas into hackathons.",
    },
    {
      num: "03",
      title: "LEARN",
      desc: "Learn through real-world building.",
    },
    {
      num: "04",
      title: "SHIP",
      desc: "Focus on working products rather than just concepts.",
    },
  ];

  return (
    <section id="about" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6">
            We don&apos;t just participate. We build.
          </h2>
          <p className="text-lg md:text-xl text-foreground/70 font-medium leading-relaxed">
            HAVOC is a collective of student builders. We find real problems, experiment with new technologies, compete fiercely in hackathons, and prioritize shipping functional prototypes over theoretical concepts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div 
              key={stat.num}
              className="p-8 border border-border bg-light-gray/30 rounded-2xl hover:bg-light-gray transition-colors group"
            >
              <div className="text-sm font-bold text-foreground/50 mb-4 group-hover:text-foreground transition-colors">
                {stat.num} — {stat.title}
              </div>
              <p className="text-base font-medium text-foreground">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
