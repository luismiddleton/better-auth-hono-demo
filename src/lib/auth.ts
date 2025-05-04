import { betterAuth } from "better-auth";
import { openAPI } from "better-auth/plugins";
import Database from "better-sqlite3";

export const auth = betterAuth({
  database: new Database("./sqlite.db"),
  plugins: [openAPI()],
});
