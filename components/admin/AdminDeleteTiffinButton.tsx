"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function AdminDeleteTiffinButton({ tiffinId }: { tiffinId: string }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setIsAdmin(data?.isAdmin ?? false))
      .catch(() => setIsAdmin(false));
  }, []);

  const handleDelete = async () => {
    if (!confirm("Delete this tiffin center? This cannot be undone.")) return;
    setDeleting(true);
    const res = await fetch(`/api/tiffin/${tiffinId}`, { method: "DELETE", credentials: "include" });
    setDeleting(false);
    if (res.ok) router.push("/tiffin");
  };

  if (!isAdmin) return null;
  return (
    <Button
      type="button"
      variant="secondary"
      disabled={deleting}
      onClick={handleDelete}
      className="bg-red-600 text-white hover:bg-red-700"
    >
      {deleting ? "Deleting…" : "Delete listing"}
    </Button>
  );
}
