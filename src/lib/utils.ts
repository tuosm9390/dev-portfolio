import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Creates a new URL with updated search parameters
 * Useful for updating specific query params while preserving others
 */
export function createUrlWithQuery(
  pathname: string,
  params: URLSearchParams | Readonly<URLSearchParams>,
  updates: Record<string, string | null>
) {
  const newParams = new URLSearchParams(params.toString());

  Object.entries(updates).forEach(([key, value]) => {
    if (value === null) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
  });

  return newParams.toString() ? `${pathname}?${newParams.toString()}` : pathname;
}
