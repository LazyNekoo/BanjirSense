//src/compoenents/profile/UserProfileConnectedScreen.tsx

import React, { useEffect, useState } from "react";
import UserProfileScreen from "../core/UserProfileScreen";
import { getMe } from "../../services/profileService";
import { listDependents } from "../../services/dependentService";

export default function UserProfileConnectedScreen(props: any) {
  const [profile, setProfile] = useState<any>(null);
  const [dependents, setDependents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const [meRes, depRes] = await Promise.all([getMe(), listDependents()]);
      setProfile(meRes.profile);
      setDependents(
        (depRes.dependents || []).map((d) => ({
          id: d.id,
          fullName: d.fullName || "",
          relationship: d.relationship || "",
          triageTag: d.triageTag || "child",
        }))
      );
    } catch (e: any) {
      setErr(e.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // keep UI simple: you can replace with your own loading screen
  if (loading) return <div className="p-6 text-sm text-slate-500">Loading profile…</div>;
  if (err) return (
    <div className="p-6 text-sm text-red-600">
      {err} <button className="underline ml-2" onClick={load}>Retry</button>
    </div>
  );

  return (
    <UserProfileScreen
      {...props}
      profile={profile || undefined}
      dependents={dependents}
    />
  );
}