import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const [checkingProfile, setCheckingProfile] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) return;
    setCheckingProfile(true);
    supabase
      .from("profiles")
      .select("company_url")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        setNeedsOnboarding(!data?.company_url);
        setCheckingProfile(false);
      });
  }, [user]);

  if (loading || (user && checkingProfile && needsOnboarding === null)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If on onboarding page already, don't redirect again
  if (needsOnboarding && typeof window !== "undefined" && !window.location.pathname.includes("/onboarding")) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
