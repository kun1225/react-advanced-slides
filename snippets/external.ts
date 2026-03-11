/* eslint-disable no-console */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// #region snippet
// Inside ./snippets/external.ts
export function emptyArray<T>(length: number) {
  return Array.from<T>({ length });
}
// #endregion snippet

export function sayHello() {
  console.log('Hello from snippets/external.ts');
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
