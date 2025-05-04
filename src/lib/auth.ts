import { betterAuth } from "better-auth";
import { admin, openAPI, twoFactor } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import Database from "better-sqlite3";

export const auth = betterAuth({
  database: new Database("./sqlite.db"),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  plugins: [openAPI(), passkey(), twoFactor(), admin()],
});
