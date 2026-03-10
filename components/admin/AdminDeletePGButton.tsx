"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function AdminDeletePGButton({ pgId }: { pgId: string }) {
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
    if (!confirm("Delete this PG listing? This cannot be undone.")) return;
    setDeleting(true);
    const res = await fetch(`/api/pg/${pgId}`, { method: "DELETE", credentials: "include" });
    setDeleting(false);
    if (res.ok) router.push("/pg");
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
