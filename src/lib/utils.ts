import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return dateString;
  }
};

// Global polyfill for STOMP.js and SockJS
export const setupGlobalPolyfill = () => {
  if (typeof window !== "undefined") {
    (window as any).global = window;
    if (typeof global === "undefined") {
      (globalThis as any).global = globalThis;
    }
  }
};

export const isOnChatPage = () => {
  return window.location.href.includes("/chat");
};

export const formatChatNotification = (
  firstName: string,
  lastName: string,
  content: string
) => {
  return {
    title: `${firstName} ${lastName}`,
    message: content,
  };
};
