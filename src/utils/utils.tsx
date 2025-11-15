import { QueryClient } from "@tanstack/react-query";

export type Time = {
  h: number;
  m: number;
  s: number;
};

export const timeToMs = (hour: number, minutes: number, seconds: number) => {
  hour = hour % 24;
  minutes = minutes % 60;
  seconds = seconds % 60;
  return (hour * 3600 + minutes * 60 + seconds) * 1000;
};

export const PRECISION = 1000;

export type CanonWaveFrequency = {
  startTime: number;
  canonFrequency: number;
  offset?: number;
};

export const STARTING_GOLD_AMOUNT = 500;
export const WAVE_SPAWN_FREQUENCY_MS = 30 * 1000;
export const CANON_MINION_UPGRADE_TIME_MS: CanonWaveFrequency[] = [
  { startTime: timeToMs(0, 1, 5), canonFrequency: timeToMs(0, 1, 30), offset: 30 },
  { startTime: timeToMs(0, 15, 0), canonFrequency: timeToMs(0, 1, 0) },
  { startTime: timeToMs(0, 25, 0), canonFrequency: timeToMs(0, 0, 30) },
];
export const PASSIVE_GOLD_RATE_MS = 20.4 / (10 * 1000); // rate is 20.4 every 10s
export const WAVE_GOLD_VALUE = 21 * 3 + 14 * 3;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});
