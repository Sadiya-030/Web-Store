import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";

/**
 * BetterAuth Client Configuration
 * Used in the browser to interact with the backend auth server
 * Provides session management and authentication methods
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/auth",
  plugins: [magicLinkClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;

export type User = typeof authClient.$Infer.Session['user'];
