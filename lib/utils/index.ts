import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SortOrder } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(word: string): string {
  return word.replace(/^\w/, (c) => c.toUpperCase());
}

// Sorting function
export function sortByProperty<T>(
  array: T[],
  property: keyof T,
  order: SortOrder = "asc"
): T[] {
  return array.sort((a, b) => {
    const propA = a[property];
    const propB = b[property];

    if (typeof propA === "number" && typeof propB === "number") {
      return order === "asc" ? propA - propB : propB - propA;
    } else if (typeof propA === "string" && typeof propB === "string") {
      return order === "asc"
        ? propA.localeCompare(propB)
        : propB.localeCompare(propA);
    }

    throw new Error("Unsupported property type for sorting");
  });
}
