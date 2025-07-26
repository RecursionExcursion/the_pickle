"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "./Spinner";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [processing, setProccessing] = useState(false);

  async function handleLogin() {
    if (password && username) {
      setProccessing(true);
      const res = await fetch("/api/the-pickle/login", {
        method: "POST",
        body: JSON.stringify({
          un: username,
          pw: password,
        }),
      });
      console.log({ res });

      if (res.ok) {
        router.push("/");
      } else {
        setProccessing(false);
        alert("Invalid username or password");
      }
    }
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-2">
      {!processing ? (
        <>
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

          <button className="cursor-pointer" onClick={handleLogin}>
            Login
          </button>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
}
