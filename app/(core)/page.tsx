// The page picker lives at /home so it stays reachable on lp.shiptime.com,
// whose bare root redirects to the marketing site (see lib/redirects.ts).
// Root re-exports it so shiptime.vercel.app/ keeps showing the picker too.
export { default, metadata } from "./home/page";
