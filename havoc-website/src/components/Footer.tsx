export default function Footer() {
  return (
    <footer className="py-10 px-6 bg-white border-t border-border overflow-hidden w-full">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <span className="text-lg font-black tracking-[-0.04em] uppercase">HAVOC</span>
          <span className="text-xs text-muted font-medium hidden md:block">
            &copy; 2026. Built by students, for builders.
          </span>
        </div>

        <div className="flex items-center gap-6">
          {[
            { label: "GitHub", href: "#" },
            { label: "LinkedIn", href: "#" },
            { label: "Instagram", href: "#" },
            { label: "Email", href: "mailto:contact@havoc.team" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-semibold text-muted hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        <span className="text-xs text-muted font-medium md:hidden text-center">
          &copy; 2026. Built by students, for builders.
        </span>
      </div>
    </footer>
  );
}
