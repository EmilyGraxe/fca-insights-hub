import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity as ActivityIcon,
  BarChart3,
  ClipboardList,
  FileText,
  FolderKanban,
  Gauge,
  Home,
  Layers,
  MapPinned,
  Menu,
  ShieldCheck,
  Users,
  Home as HouseIcon,
  HandHeart,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

export const NAV = [
  {
    group: "Understand",
    items: [
      { to: "/", label: "Executive dashboard", icon: Home },
      { to: "/analytics", label: "Analytics & MEAL", icon: BarChart3 },
      { to: "/geography", label: "Geographic intelligence", icon: MapPinned },
    ],
  },
  {
    group: "Registries",
    items: [
      { to: "/beneficiaries", label: "Beneficiaries", icon: Users },
      { to: "/households", label: "Households", icon: HouseIcon },
      { to: "/programmes", label: "Programmes", icon: Layers },
      { to: "/projects", label: "Projects", icon: FolderKanban },
      { to: "/activities", label: "Activities", icon: ActivityIcon },
      { to: "/services", label: "Services", icon: HandHeart },
    ],
  },
  {
    group: "Collect & assure",
    items: [
      { to: "/forms", label: "Data collection forms", icon: ClipboardList },
      { to: "/data-quality", label: "Data quality", icon: Gauge },
      { to: "/reports", label: "Reports & donors", icon: FileText },
      { to: "/admin", label: "Administration", icon: ShieldCheck },
    ],
  },
] as const;

function BrandMark() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="FCA Uganda Data Hub home">
      <span
        className="grid size-9 shrink-0 place-items-center rounded-md bg-primary text-sm font-bold text-primary-foreground"
        aria-hidden
      >
        FCA
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-semibold text-foreground">Uganda Data Hub</span>
        <span className="block text-[11px] text-muted-foreground">Programme &amp; beneficiary intelligence</span>
      </span>
    </Link>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav aria-label="Main" className="space-y-6 pb-8">
      {NAV.map((group) => (
        <div key={group.group}>
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {group.group}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active =
                item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <p className="px-3 text-[11px] leading-relaxed text-muted-foreground">
        Demonstration environment. All records are synthetic and generated for design and analysis
        purposes only.
      </p>
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Open navigation">
              <Menu className="size-4" aria-hidden />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="border-b border-border p-4">
              <BrandMark />
            </div>
            <ScrollArea className="h-[calc(100vh-5rem)] px-2 pt-4">
              <NavList onNavigate={() => setOpen(false)} />
            </ScrollArea>
          </SheetContent>
        </Sheet>
        <BrandMark />
      </header>

      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-border bg-card lg:block">
          <div className="border-b border-border p-4">
            <BrandMark />
          </div>
          <ScrollArea className="h-[calc(100vh-4.5rem)] px-2 pt-4">
            <NavList />
          </ScrollArea>
        </aside>

        <main id="main" className="min-w-0 flex-1">
          <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
