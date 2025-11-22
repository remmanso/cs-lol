import express, { Request, Response, NextFunction } from "express";
import axios from "axios";
import fs from "fs";
import path from "path";
import cron from "node-cron";
import winston from "winston";

const app = express();
const PORT = process.env.PORT || 5000;

const DEFAULT_VERSION = "15.23.1";
const DATA_FOLDER_PATH = __dirname + "/data/";
const PATH = {
  CHAMPION: (key: string) => path.join(DATA_FOLDER_PATH, "champions", key),
  CHAMPIONS_JSON: path.join(DATA_FOLDER_PATH, "champions.json"),
  VERSION_JSON: path.join(DATA_FOLDER_PATH, "version.json"),
  ABILITIES_JSON: (key: string) => path.join(PATH.CHAMPION(key), "abilities.json"),
};

const URL = {
  VERSION: "https://ddragon.leagueoflegends.com/api/versions.json",
  CHAMPIONS: (version: string) => `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`,
  ABILITIES: (version: string, key: string) =>
    `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion/${key}.json`,
};

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

const createBaseStructure = () => {
  const pathsToCreate = [DATA_FOLDER_PATH, PATH.CHAMPION("")];
  pathsToCreate.forEach((path) => checkElseCreateDir(path));
};

const checkElseCreateDir = (path: string) => {
  if (!fs.existsSync(path)) fs.mkdirSync(path);
};

app.use((req: Request, res: Response, next: NextFunction) => {
  createBaseStructure();
  next();
});

app.use("/data", express.static(DATA_FOLDER_PATH));

const saveAndReturnJsonAsync = async (url: string, filePath: string) => {
  try {
    const response = await axios.get(url);
    const json = JSON.stringify(response.data, null, 2);
    fs.writeFileSync(filePath, json, "utf8");
    return response.data;
  } catch (error) {
    logger.error(`Error fetching or saving JSON: ${error}`);
  }
};

// async function downloadImage(url: string, key: string) {
//   const writer = Fs.createWriteStream(path.join(__dirname, "images", "code.jpg"));

//   const response = await Axios({
//     url,
//     method: "GET",
//     responseType: "stream",
//   });

//   response.data.pipe(writer);

//   return new Promise((resolve, reject) => {
//     writer.on("finish", resolve);
//     writer.on("error", reject);
//   });
// }

const getCurrentVersion: () => string = () => {
  try {
    const version = fs.readFileSync(PATH.VERSION_JSON, "utf-8");
    return JSON.parse(version)?.[0] ?? DEFAULT_VERSION;
  } catch (exception) {
    logger.error(`exception in getVersion ${exception}`);
  }
  logger.error("DEFAULT_VERSION has been used.");
  return DEFAULT_VERSION;
};

const checkElseFetchLastVersion: () => Promise<[boolean, string | null]> = async () => {
  const versionResponse = await axios.get(URL.VERSION);

  if (!versionResponse.data || !Array.isArray(versionResponse.data) || versionResponse.data.length === 0) {
    logger.error("Data received was not as expected");
    return [false, null];
  }
  const lastRiotVersion = versionResponse.data[0];

  const writeRiotVersion = () => {
    fs.writeFile(PATH.VERSION_JSON, JSON.stringify([lastRiotVersion]), "utf8", (writeErr) => {
      if (writeErr) {
        logger.error(`Error writing file: ${writeErr}`);
      } else {
        logger.info("File successfully updated.");
      }
    });
  };

  if (!fs.existsSync(PATH.VERSION_JSON)) {
    writeRiotVersion();
    return [false, lastRiotVersion];
  }

  try {
    const data = fs.readFileSync(PATH.VERSION_JSON, "utf-8");
    const version = JSON.parse(data);
    if (version?.[0] !== lastRiotVersion) {
      writeRiotVersion();
      return [false, lastRiotVersion];
    }
    return [true, lastRiotVersion];
  } catch (error) {
    logger.error(`Error ${error}.`);
  }

  logger.error(`Something went wrong with local versionning.`);
  return [false, lastRiotVersion];
};

const fetchChampionsAsync = async (version?: string | null) => {
  if (!version) version = getCurrentVersion();
  return await saveAndReturnJsonAsync(URL.CHAMPIONS(version), PATH.CHAMPIONS_JSON);
};

const fetchChampionsAndAbilities: (version?: string | null) => Promise<boolean> = async (version?: string | null) => {
  if (!version) version = getCurrentVersion();

  const champResponse = await fetchChampionsAsync(version);

  if (!champResponse?.data) {
    logger.error("Incorrect request.");
    return false;
  }

  Object.keys(champResponse.data).forEach(async (key) => {
    checkElseCreateDir(PATH.CHAMPION(key));
    // const img = await axios.get(
    //   `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${champResponse.data[key].image.full}`,
    // );

    await saveAndReturnJsonAsync(URL.ABILITIES(version, key), PATH.ABILITIES_JSON(key));
    logger.info(key + " downloaded");
  });

  return true;
};

app.get("/version", async (req, res: Response) => {
  const version = await checkElseFetchLastVersion();
  res.send("current version is " + version);
});

app.get("/download", async (req, res: Response) => {
  const [, version] = await checkElseFetchLastVersion();
  res.send(await fetchChampionsAndAbilities(version));
});

app.get("/champ/:key", async (req, res) => {
  const key = req.params.key;

  if (!fs.existsSync(PATH.CHAMPION(key))) res.json(null);

  const abilities = fs.readFileSync(PATH.ABILITIES_JSON(key));

  res.json(JSON.parse(abilities.toString()));
});

// Optional: Schedule to fetch JSON every hour
cron.schedule("0 3 * * 3", async () => {
  const executionTime = new Date(Date.now()).toISOString();
  logger.info("cron called at " + executionTime);
  const [isUpToDate, version] = await checkElseFetchLastVersion();
  logger.info(`${isUpToDate}, ${version}, called at` + executionTime);

  if (isUpToDate || !version) return;

  if (await fetchChampionsAndAbilities(version)) logger.info("Download finished correctly");
  else logger.error("error happened on downloading data");
});

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

// Catch uncaught exceptions and unhandled rejections
process.on("uncaughtException", (err) => {
  logger.error("Uncaught exception:", err);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled rejection:", reason);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err);
  res.status(500).send("Internal Server Error");
});
