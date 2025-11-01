import { startTransition, useState } from "react";
import { Slider } from "./Slider";

type CanonWaveFrequency =
  {
    startTime: number;
    canonFrequency: number;
    offset?: number;
  }

const timeToMS = (hour: number, minutes: number, seconds: number) => {
  hour = hour % 24;
  minutes = minutes % 60;
  seconds = seconds % 60;
  return (hour * 3600 + minutes * 60 + seconds) * 1000;
}

const WAVE_SPAWN_FREQUENCY_MS = 30 * 1000;
const CANON_MINION_UPGRADE_TIME_MS: CanonWaveFrequency[] = [
  { startTime: timeToMS(0, 1, 5), canonFrequency: timeToMS(0, 1, 30), offset: 30 },
  { startTime: timeToMS(0, 15, 0), canonFrequency: timeToMS(0, 1, 0), },
  { startTime: timeToMS(0, 25, 0), canonFrequency: timeToMS(0, 0, 30) }];

export const useCsCalculator = (minutes: number) => {
  console.log(minutes);
  const calculateCs = (msTime: number) => {

    let currentStage = 0;
    const getNextSpawnTime = () => currentStage > CANON_MINION_UPGRADE_TIME_MS.length - 2 ? null : CANON_MINION_UPGRADE_TIME_MS[currentStage + 1];
    // const numberOfWaves = Math.floor((time - spawnTime) / WAVE_SPAWN_FREQUENCY_MS) + 1;
    let { startTime: currentTime, canonFrequency, offset } = CANON_MINION_UPGRADE_TIME_MS[0];
    let lastCanonTime = currentTime + (offset ?? 0) * 1000; // we offset the first wave, 
    let nextStage = getNextSpawnTime();
    let totalMinions = 0;
    while (currentTime <= msTime) {
      currentTime += WAVE_SPAWN_FREQUENCY_MS;
      totalMinions += 6;
      if (currentTime - lastCanonTime >= canonFrequency) {
        totalMinions++;
        lastCanonTime = currentTime;
      }

      if (nextStage && currentTime >= nextStage.startTime) {
        canonFrequency = nextStage.canonFrequency;
        currentStage++;
        nextStage = getNextSpawnTime();
      }
    }
    return totalMinions;
  };

  return calculateCs(minutes);
}

const gameDuration = 60;
export const Form = () => {
  // const [enteredTime, setEnteredTime] = useState<number>(0);
  // const timeValue = useRef<number>(0);
  const [sliderValue, setSliderValue] = useState(0);
  const maxCsCount = useCsCalculator(sliderValue * gameDuration * 60 * 1000 / 100);
  // const [partieDuration, setPartieDuration] = useState(60);
  // function handleChange(event: ChangeEvent<HTMLInputElement>): void {
  //   if (event.target.valueAsDate == null)
  //     return;

  //   // setEnteredTime(event.target.valueAsDate.getTime());
  //   // timeValue.current = event.target.valueAsDate.getTime();
  // }
  const setValue = (num: number) => {
    requestAnimationFrame(() => {
      startTransition(() => {
        console.log(num);
        setSliderValue(num);
      })
    });
  };
  const seconds = Math.round((sliderValue * gameDuration) / 100 % 1 * 60) % 60;
  const minutes = Math.floor(sliderValue * gameDuration / 100);
  return <>
    <div className="grid gap-2 p-6">
      <label> Game duration: {minutes === 0 ? "0" : minutes}m {seconds % 60 === 0 ? "" : seconds + "s"}</label>
      <Slider setValue={setValue} />
      <label> {maxCsCount} cs</label>
    </div>
  </>;
}