"use client";

import { logout } from "@lib/actions/logout";

const LogoutButton = ({ children }: { children: React.ReactNode }) => {
  const onClick = () => {
    logout();
  };
  return <span onClick={onClick}>{children}</span>;
};

export default LogoutButton;
