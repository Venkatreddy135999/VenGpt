"use client";

import * as React from "react";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
  SignOutButton,
  useUser,
  useAuth,
} from "@clerk/nextjs";

export function SignedIn({ children }: { children: React.ReactNode }) {
  return <Show when="signed-in">{children}</Show>;
}

export function SignedOut({ children }: { children: React.ReactNode }) {
  return <Show when="signed-out">{children}</Show>;
}

export { SignInButton, SignUpButton, UserButton, SignOutButton, useUser, useAuth };
