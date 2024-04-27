import { LoginSchema } from "@lib/schemas";
import { baseURL } from "@lib/utils/constants";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const response = await fetch(`${baseURL}/api/authenticate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(validatedFields.data),
          });
          if (response.ok) {
            const user = await response.json();
            return user;
          } else {
            return null;
          }
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
