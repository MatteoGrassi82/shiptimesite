import { redirect } from "next/navigation";

// /workspace was the first logged-in mockup (Oct 19). It's replaced by the
// one-product dashboard at /dashboard; old links land there.
export default function WorkspacePage() {
  redirect("/dashboard");
}
