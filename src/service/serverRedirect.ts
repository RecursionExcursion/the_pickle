"use server";

import { redirect } from "next/navigation";

export async function serverRedirect(path: string) {
  redirect(path);
}
