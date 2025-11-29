import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import MinistryHeader from "@/components/ministry/MinistryHeader";
import { User } from "@supabase/supabase-js";

const MinistryLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        navigate("/ministry/login");
        return;
      }

      // In a real app, you'd check a role from the database.
      // For this implementation, we'll assume the logged-in user is a ministry user.
      setUser(session.user);
      setLoading(false);
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          navigate("/ministry/login");
        } else {
          setUser(session.user);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // or a redirect component
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <MinistryHeader user={user} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MinistryLayout;
