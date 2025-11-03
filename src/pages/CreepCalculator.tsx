import { startTransition, useRef, useState } from "react";
import { Slider } from "../components/Slider";
import { useCsCalculator } from "../hooks/useCsCalculator";
import { PRECISION } from "../utils/utils";

const GAME_DURATION = 60;
export const CreepCalculator = () => {
  const [sliderValue, setSliderValue] = useState(0);

  const minutes = useRef(0);
  const seconds = useRef(0);

  const maxCsCount = useCsCalculator((sliderValue * GAME_DURATION * 60 * PRECISION) / 100);
  const onLaneCount = useCsCalculator((sliderValue * GAME_DURATION * 60 * PRECISION) / 100 - 30 * PRECISION);

  const setValue = (num: number) => {
    requestAnimationFrame(() => {
      startTransition(() => {
        setSliderValue(num);
      });
    });
  };

  seconds.current = Math.round((((sliderValue * GAME_DURATION) / 100) % 1) * 60) % 60;
  minutes.current = Math.floor((sliderValue * GAME_DURATION) / 100);

  return (
    <>
      <div className="m-auto grid max-w-5xl select-none gap-2 p-2">
        <label>
          {" "}
          Game duration: {minutes.current === 0 ? "0" : minutes.current}m{" "}
          {seconds.current % 60 === 0 ? "" : seconds.current + "s"}
        </label>
        <Slider setValue={setValue} />
        <label>
          {" "}
          {maxCsCount} cs spawned, {onLaneCount}cs on lane
        </label>
        {/* <div className="grid grid-cols-2">
          <button className="m-auto columns-1 rounded bg-blue-400 px-3 pb-1 text-base font-bold hover:bg-blue-500 hover:outline-1 hover:outline-gray-900">
            Add
          </button>
          <ul className="columns">
            <li>test</li>
            <li>test</li>
            <li>test</li>
            <li>test</li>
            <li>test</li>
            <li>test</li>
            <li>test</li>
            <li>test</li>
            <li>test</li>
            <li>test</li>
            <li>test</li>
            <li>test</li>
            <li>test</li>
            <li>test</li>
          </ul>
        </div> */}
      </div>
    </>
  );
};
