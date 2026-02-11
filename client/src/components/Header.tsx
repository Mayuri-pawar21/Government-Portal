import { Link } from "wouter";
import { ShieldCheck, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
      <div className="gov-container h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="bg-primary/10 p-2 rounded-md">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Official Portal</span>
            <span className="font-serif font-bold text-lg leading-tight text-primary">Forgery Detection System</span>
          </div>
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden sm:block">
            Dashboard
          </Link>
          <Link href="/verify" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden sm:block">
            New Verification
          </Link>
          <div className="h-6 w-px bg-border hidden sm:block" />
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </nav>
      </div>
    </header>
  );
}
