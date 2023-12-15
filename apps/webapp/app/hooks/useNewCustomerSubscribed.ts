import { useEffect } from "react";

export function useNewCustomerSubscribed() {
  useEffect(() => {
    if ("confetti" in window && typeof window.confetti !== "undefined") {
      const duration = 3.5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 0,
        colors: [
          "#E7FF52",
          "#41FF54",
          "rgb(245 158 11)",
          "rgb(22 163 74)",
          "rgb(37 99 235)",
          "rgb(67 56 202)",
          "rgb(219 39 119)",
          "rgb(225 29 72)",
          "rgb(217 70 239)",
        ],
      };
      function randomInRange(min: number, max: number): number {
        return Math.random() * (max - min) + min;
      }
      // @ts-ignore
      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 60 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        // @ts-ignore
        window.confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.4), y: Math.random() - 0.2 },
          })
        );
        // @ts-ignore
        window.confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.6, 0.9), y: Math.random() - 0.2 },
          })
        );
      }, 250);
    }
  }, []);
}
