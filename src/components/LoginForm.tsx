"use client";

import { useState } from "react";
import { login } from "../service/pickleService";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    if (password && username) {
      const ok = await login(username, password);
      if (ok) {
        router.push("/");
      } else {
        //invalid creds / sever did not send back token
        alert("Invalid username or password");
      }
    }
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-2">
      <div className="flex gap-2">
        <span>Username</span>
        <input
          className="bg-white text-black"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <span>Password</span>
        <input
          className="bg-white text-black"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
