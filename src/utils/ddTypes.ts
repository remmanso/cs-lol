import { API_VERSION_FALLBACK } from "./constants";

export const CHAMPION_IMG_URL = (img: string, version: string) =>
  `https://ddragon.leagueoflegends.com/cdn/${version ?? API_VERSION_FALLBACK}/img/spell/${img}`;

export type ddImage = {
  full: string;
  sprite: string;
  group: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type ddSpell = {
  id: string;
  name: string;
  description: string;
  tooltip: string;
  leveltip: {
    label: string[];
    effect: string[];
  };
  maxrank: number;
  cooldown: number[];
  cooldownBurn: string;
  cost: number[];
  costBurn: string;
  // datavalues: {};
  // effect: [
  //   null,
  //   [0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0],
  // ];
  effectBurn: string[];
  vars: [];
  costType: string;
  maxammo: string;
  range: number[];
  rangeBurn: string;
  image: ddImage;
  resource: string;
};

export type ddChampion = {
  version: string;
  id: string; //name
  key: string; //id
  name: string; //name
  title: string;
  blurb: string;
  info: {
    attack: number;
    defense: number;
    magic: number;
    difficulty: number;
  };
  image: ddImage;
  tags: string[];
  parttype: string;
  stats: {
    hp: number;
    hpperlevel: number;
    mp: number;
    mpperlevel: number;
    movespeed: number;
    armor: number;
    armorperlevel: number;
    spellblock: number;
    spellblockperlevel: number;
    attackrange: number;
    hpregen: number;
    hpregenperlevel: number;
    mpregen: number;
    mpregenperlevel: number;
    crit: number;
    critperlevel: number;
    attackdamage: number;
    attackdamageperlevel: number;
    attackspeedperlevel: number;
    attackspeed: number;
  };
};

export type ddSkins = {
  id: string;
  num: number;
  name: string;
  chromas: boolean;
};

export type ddChampionWithSpells = ddChampion & {
  skins: ddSkins[];
  lore: string;
  spells: ddSpell[];
  passive: {
    name: string;
    description: string;
    image: ddImage;
  };
  allytips: string[];
  enemytips: string[];
  recommended: [];
};

export type ddQuery<T> = {
  type: string;
  version: string;
  format: string;
  data: Record<string, T>;
};
