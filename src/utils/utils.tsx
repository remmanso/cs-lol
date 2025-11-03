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
