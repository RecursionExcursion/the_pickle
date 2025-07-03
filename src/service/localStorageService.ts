"use client";

const tokenKey = "token";

export function getToken() {
  return localStorage.getItem(tokenKey);
}

export function saveToken(token: string) {
  return localStorage.setItem(tokenKey, token);
}
