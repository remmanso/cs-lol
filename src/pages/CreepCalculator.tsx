import { startTransition, useRef, useState } from "react";
import { Slider } from "../components/Slider";
import { useCsCalculator } from "../hooks/useCsCalculator";

const GAME_DURATION = 60;
export const CreepCalculator = () => {

  const [sliderValue, setSliderValue] = useState(0);

  const minutes = useRef(0);
  const seconds = useRef(0);

  const maxCsCount = useCsCalculator(sliderValue * GAME_DURATION * 60 * 1000 / 100);

  const setValue = (num: number) => {
    requestAnimationFrame(() => {
      startTransition(() => {
        setSliderValue(num);
      })
    });
  };

  seconds.current = Math.round((sliderValue * GAME_DURATION) / 100 % 1 * 60) % 60;
  minutes.current = Math.floor(sliderValue * GAME_DURATION / 100);
  
  return <>
    <div className="grid gap-2 p-6 select-none">
      <label> Game duration: {minutes.current === 0 ? "0" : minutes.current}m {seconds.current % 60 === 0 ? "" : seconds.current + "s"}</label>
      <Slider setValue={setValue} />
      <label> {maxCsCount} cs</label>
    </div>
  </>;
}