import { useState, useEffect } from "react";

export const useCountdown = (targetDate: string) => {
  const [days, setDays] = useState("00");
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");

  useEffect(() => {
    const weddingDate = new Date(targetDate);

    const updateCountdown = () => {
      const now = new Date();
      const diff = weddingDate.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setDays(String(days).padStart(2, "0"));
        setHours(String(hours).padStart(2, "0"));
        setMinutes(String(minutes).padStart(2, "0"));
        setSeconds(String(seconds).padStart(2, "0"));
      }
    };

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(timer);
  }, [targetDate]);

  return { days, hours, minutes, seconds };
};
