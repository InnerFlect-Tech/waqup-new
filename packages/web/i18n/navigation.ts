/**
 * Locale-aware navigation helpers.
 * Import Link, redirect, useRouter, usePathname from here — NOT from 'next/link' or 'next/navigation'.
 * This ensures all navigation automatically preserves the active locale in the URL.
 */
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, useRouter, usePathname, getPathname } =
  createNavigation(routing);
