import { useContext, useEffect, useRef } from "react";
import { ChampionContext } from "./ChampionContext";
import {} from "twin.macro";

export const AbilityCooldown = ({ cooldown }: { cooldown: number }) => {
  const { cdr } = useContext(ChampionContext);
  const ref = useRef<HTMLSpanElement>(null);
  const src = useRef<HTMLSpanElement>(null);
  // const [isPending, setTransition] = useTransition();

  useEffect(() => {
    const cdReduced = ref.current;
    const cooldown = src.current;
    let timeOutId: NodeJS.Timeout | null = null;
    const animations: Animation[] = [];
    if (!cdReduced || cdr === 1 || !cooldown) return;

    const animation = requestAnimationFrame(() => {
      timeOutId = setTimeout(() => {
        animations.push(
          cdReduced.animate(
            [
              { transform: "translateY(0px)", opacity: 1 },
              { transform: "translateY(-20px)" },
              { transform: "translateY(-40px)", oppacity: 0 },
            ],
            {
              duration: 3500,
              fill: "forwards",
              easing: "ease-out",
              id: "cdReduce",
            },
          ),
        );

        animations.push(
          cooldown.animate(
            [
              { transform: "translate(2px, -2px) rotate(-5deg)", opacity: 1 },
              { transform: "translate(-2px, 2px) rotate(5deg)", opacity: 0.6 },
              { transform: "translate(2px, -2px) rotate(-5deg)", opacity: 0 },
            ],
            {
              duration: 200,
              easing: "ease-out",
            },
          ),
        );
      }, 100);
    });

    return () => {
      if (timeOutId) clearTimeout(timeOutId);
      animations.forEach((o) => o.cancel());
      animations.splice(0, animations.length);
      cancelAnimationFrame(animation);
    };
  }, [cdr]);

  return (
    <span tw="relative">
      {cdr < 1 && (
        <span tw="opacity-0 absolute -top-1 -left-1 right-0 text-green-500" ref={ref}>
          -{Math.round(cooldown * (1 - cdr) * 10) / 10}s
        </span>
      )}

      <span tw="relative">
        {Math.round(cooldown * cdr * 10) / 10}
        {cooldown && <span tw="[font-size: 10px]">s</span>}
        <span tw=" opacity-0 absolute inset-0 text-red-500 font-bold" ref={src}>
          {Math.round(cooldown * cdr * 10) / 10}
          {cooldown && <span tw="[font-size: 10px]">s</span>}
        </span>
      </span>
    </span>
  );
};
