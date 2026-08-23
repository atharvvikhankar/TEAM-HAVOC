"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, havocUser, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    else if (!loading && havocUser && !havocUser.isAdmin) router.push("/dashboard");
  }, [user, havocUser, loading, router]);

  if (loading || !user || !havocUser?.isAdmin) {
    return <div className="min-h-screen bg-white" />;
  }

  const links = [
    { name: "Applications", href: "/admin/applications" },
    { name: "Members & Chat", href: "/admin/members" },
  ];

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex flex-col md:flex-row pt-[64px]">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-border p-6 flex flex-col">
        <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-foreground/40 mb-6 block">HAVOC Admin</p>
        
        <nav className="flex flex-row md:flex-col gap-2 mb-10 overflow-x-auto">
          {links.map(link => {
            const active = pathname === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${active ? 'bg-foreground text-white' : 'text-foreground/60 hover:bg-light-gray hover:text-foreground'}`}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        <div className="mt-auto hidden md:block">
          <button onClick={logout} className="w-full text-left px-4 py-3 text-sm font-bold text-foreground/50 hover:text-red-500 transition-colors">
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
