import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon, LayoutDashboard, ListChecks, BarChart2, FileDown, Map, ShieldCheck, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { User } from "@supabase/supabase-js";

interface MinistryHeaderProps {
  user: User;
}

const MinistryHeader = ({ user }: MinistryHeaderProps) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/ministry/login");
  };

  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              aria-label="Go back"
              title="Go back"
              className="p-2 rounded hover:bg-muted/50 text-muted-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <h1 className="text-xl font-bold text-primary">VoiceUp Ministry</h1>

            <nav className="hidden md:flex gap-6">
              <Link to="/ministry/dashboard" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link to="/ministry/problems" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary">
                <ListChecks className="h-4 w-4" />
                Problems
              </Link>
              <Link to="/ministry/analytics" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary">
                <BarChart2 className="h-4 w-4" />
                Analytics
              </Link>
              <Link to="/ministry/reports" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary">
                <FileDown className="h-4 w-4" />
                Reports
              </Link>
              <Link to="/ministry/map" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary">
                <Map className="h-4 w-4" />
                Map
              </Link>
              <Link to="/ministry/audit" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary">
                <ShieldCheck className="h-4 w-4" />
                Audit Trail
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{user.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MinistryHeader;
