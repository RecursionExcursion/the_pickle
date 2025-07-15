"use client";

import { useEffect, useState } from "react";
import { login, wakeupService } from "../service/pickleService";
import { useRouter } from "next/navigation";
import { useBackendConnectionWatcher } from "../hooks/UseBackendConnectionWatcher";
import Spinner from "./Spinner";

//TODO add spinner or some kind of feed back for when the server is waking up/processing
export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { connect, ConnectionStatus, isConnected } =
    useBackendConnectionWatcher();
  const [processing, setProccessing] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => connect(wakeupService), []);

  async function handleLogin() {
    if (password && username && isConnected) {
      setProccessing(true);
      const ok = await login(username, password);
      if (ok) {
        router.push("/");
      } else {
        //invalid creds / sever did not send back token
        setProccessing(false);
        alert("Invalid username or password");
      }
    }
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-2">
      {!processing ? (
        <>
          <ConnectionStatus />
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
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
}
