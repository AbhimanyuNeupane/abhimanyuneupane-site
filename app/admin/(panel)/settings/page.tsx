import SettingsForm from "@/components/admin/SettingsForm";
import { createClient } from "@/lib/supabase/server";
import type { Settings } from "@/lib/types";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("*").eq("id", 1).single();
  return (
    <>
      <div className="admin-title">
        <div>
          <h1>Site settings</h1>
          <p className="muted" style={{ margin: "4px 0 0", fontSize: 14 }}>Everything on the homepage comes from here.</p>
        </div>
      </div>
      <SettingsForm s={data as Settings} />
    </>
  );
}
