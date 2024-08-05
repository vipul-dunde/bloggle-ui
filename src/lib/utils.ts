import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const BACKEND_BASE_URLS = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchAPI(url: string) {
  return await fetch(`${BACKEND_BASE_URLS}${url}`);
}
