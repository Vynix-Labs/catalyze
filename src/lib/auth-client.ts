import { emailOTPClient, genericOAuthClient } from "better-auth/client/plugins";
// import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";
const authBase = import.meta.env.VITE_AUTH_BASE_URL;

export const authClient = createAuthClient({
  fetchOptions: {
    credentials: "include",
    mode: "cors",
  },
  baseURL: authBase,
  basePath: "/api/auth/",
  plugins: [emailOTPClient(), genericOAuthClient()],
});

export const {
  signIn,
  signUp,
  useSession,
  signOut,
  getSession,
  forgetPassword,
  resetPassword,
  getAccessToken,
  sendVerificationEmail,
  linkSocial,
} = authClient;
