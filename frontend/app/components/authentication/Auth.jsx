"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../api/firebase/firebase";
import Loading from "../Loading";

export default function AuthGate({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (!currentUser && pathname === "/create") {
        router.push("/login");
      } else if (currentUser && pathname === "/login") {
        router.push("/create");
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  if (loading) return (
    <Loading />
  );

  return <>{children}</>;
}
