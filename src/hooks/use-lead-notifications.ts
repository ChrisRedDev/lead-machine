import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useLeadGenerationNotifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!user) return;

    // Skip initial load — only notify for NEW exports after page load
    const timer = setTimeout(() => {
      isFirstLoad.current = false;
    }, 3000);

    const channel = supabase
      .channel(`lead_exports_${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "lead_exports",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (isFirstLoad.current) return;
          const exportData = payload.new as any;
          const count = exportData.lead_count || 0;
          toast.success(
            `Your leads are ready! ${count} leads generated.`,
            {
              description: exportData.name || "New export",
              duration: 8000,
              action: {
                label: "View results →",
                onClick: () => navigate("/dashboard/exports"),
              },
            }
          );
        }
      )
      .subscribe();

    return () => {
      clearTimeout(timer);
      supabase.removeChannel(channel);
    };
  }, [user, navigate]);
};
