import { timeToMs } from "../utils/utils";

type CanonWaveFrequency =
  {
    startTime: number;
    canonFrequency: number;
    offset?: number;
  }

const WAVE_SPAWN_FREQUENCY_MS = 30 * 1000;
const CANON_MINION_UPGRADE_TIME_MS: CanonWaveFrequency[] = [
  { startTime: timeToMs(0, 1, 5), canonFrequency: timeToMs(0, 1, 30), offset: 30 },
  { startTime: timeToMs(0, 15, 0), canonFrequency: timeToMs(0, 1, 0), },
  { startTime: timeToMs(0, 25, 0), canonFrequency: timeToMs(0, 0, 30) }];

export const useCsCalculator = (minutes: number) => {

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
