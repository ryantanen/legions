import { useEffect, useState } from "react";
import { checkAdminPermissions, signInWithDiscord } from "../../api";
import { supabase } from "../../main";
import type { Session } from "@supabase/supabase-js";
import AdminDashboard from "./AdminDashboard";

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    if (!session) {
      checkAdminPermissions().then((hasPermission) => {
        setHasPermission(hasPermission);
        if (!hasPermission) {
          supabase.auth
            .signOut()
            .then(() => {
              console.log("User does not have admin permissions, signed out.");
              setSession(null);
            })
            .catch((error) => {
              console.error("Error signing out:", error);
            });
        }
      });
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);
  if (!session) {
    return (
      <div className="w-full h-screen">
        <div className="flex flex-col items-center justify-center h-full">
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
            <legend className="fieldset-legend">Legions Admin</legend>

            <button
              className="btn btn-primary"
              onClick={() => signInWithDiscord()}
            >
              Login with discord
            </button>
          </fieldset>
        </div>
      </div>
    );
  } else {
    if (!session.user || !hasPermission) {
      return (
        <div className="w-full h-screen flex items-center justify-center">
          <div className="loading"></div>
        </div>
      );
    }
    return <AdminDashboard />;
  }
}

export default AdminPage;
