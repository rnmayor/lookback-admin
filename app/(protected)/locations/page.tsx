"use client";

import { Button } from "@components/ui/button";
import { logout } from "@lib/actions/logout";
import { useSession } from "next-auth/react";

export default function Location() {
  const onClick = () => {
    logout();
  };
  const clientSession = useSession();

  return (
    <div>
      Location page
      <Button onClick={onClick}>Logout</Button>
      <div>Client session {JSON.stringify(clientSession)}</div>
    </div>
  );
}
