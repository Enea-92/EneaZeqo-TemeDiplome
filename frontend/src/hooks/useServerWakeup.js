import { useEffect } from "react";

const BACKEND_URL = "https://eneazeqo-temediplome.onrender.com";
const MAX_ATTEMPTS = 10;
const INTERVAL_MS = 3000;

export const useServerWakeup = () => {
  useEffect(() => {
    let attempts = 0;
    let intervalId;

    const ping = async () => {
      attempts++;
      try {
        const res = await fetch(`${BACKEND_URL}/ping`, {
          method: "GET",
          signal: AbortSignal.timeout(5000),
        });
        if (res.ok) {
          clearInterval(intervalId);
          console.log(`Server awake after ${attempts} attempt(s)`);
        }
      } catch {
        if (attempts >= MAX_ATTEMPTS) {
          clearInterval(intervalId);
          console.warn("Server did not wake up in time");
        }
      }
    };

    ping();
    intervalId = setInterval(ping, INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);
};