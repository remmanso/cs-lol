import express, { Request, Response, NextFunction } from "express";
import axios from "axios";
import fs from "fs";
import path from "path";
import cron from "node-cron";
import winston from "winston";
import { create } from "domain";

const app = express();
const PORT = process.env.PORT || 5000;

const DATA_FOLDER_PATH = __dirname + "/data/";
const CHAMPION_PATH = (key: string) => DATA_FOLDER_PATH + "/champions/" + key + "/";
const VERSION_URL = "https://ddragon.leagueoflegends.com/api/versions.json";
const CHAMPIONS_URL = (version: string) =>
  `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`;
const CHAMPIONS_ABILITIES = (version: string, key: string) =>
  `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion/${key}.json`;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

const createDirIfNotExists = () => {
  if (!fs.existsSync(DATA_FOLDER_PATH)) {
    fs.mkdirSync(DATA_FOLDER_PATH);
    fs.mkdirSync(CHAMPION_PATH(""));
    logger.info("directory created");
  }
};

app.use((req: Request, res: Response, next: NextFunction) => {
  createDirIfNotExists();
  next();
});

const saveJsonFile = async (url: string, filePath: string) => {
  try {
    const response = await axios.get(url);
    fs.writeFileSync(filePath, JSON.stringify(response.data, null, 2), "utf8");
    logger.info(`JSON saved to: ${filePath}`);
  } catch (error) {
    logger.error(`Error fetching or saving JSON: ${error}`);
  }
};

const getVersion = () => {
  try {
    const version = fs.readFileSync(path.join(DATA_FOLDER_PATH, "version.json"), "utf-8");
    return JSON.parse(version)?.current;
  } catch (exception) {
    logger.error(`exception in getVersion ${exception}`);
  }
};

const isVersionUpToDate: () => Promise<[boolean, string | null]> = async () => {
  const filePath = path.join(DATA_FOLDER_PATH, "version.json");
  const versionResponse = await axios.get(VERSION_URL);

  if (!versionResponse.data || !Array.isArray(versionResponse.data) || versionResponse.data.length === 0) {
    logger.error("Data received was not as expected");
    return [false, null];
  }
  const lastRiotVersion = versionResponse.data[0];

  const writeRiotVersion = () => {
    fs.writeFile(filePath, JSON.stringify({ current: lastRiotVersion }, null, 2), "utf8", (writeErr) => {
      if (writeErr) {
        logger.error(`Error writing file: ${writeErr}`);
      } else {
        logger.info("File successfully updated.");
      }
    });
  };

  if (!fs.existsSync(filePath)) {
    writeRiotVersion();
    return [false, lastRiotVersion];
  }

  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const version = JSON.parse(data);
    if (version.current !== lastRiotVersion) {
      writeRiotVersion();
      return [false, lastRiotVersion];
    }
    return [true, lastRiotVersion];
  } catch (error) {
    logger.error(`Error ${error}.`);
  }
  return [false, null];
};

const downloadData = async () => {
  const version = getVersion();
  if (!fs.existsSync(CHAMPION_PATH(""))) fs.mkdirSync(CHAMPION_PATH(""));

  const champResponse = await axios.get(CHAMPIONS_URL(version));
  if (!champResponse?.data || !champResponse?.data.data) {
    logger.error("Incorrect request.");
    return;
  }

  Object.keys(champResponse.data.data).forEach(async (key) => {
    if (!fs.existsSync(CHAMPION_PATH(key))) {
      fs.mkdirSync(CHAMPION_PATH(key));
    }
    await saveJsonFile(CHAMPIONS_ABILITIES(version, key), CHAMPION_PATH(key) + "abilities.json");
    logger.info(key + " downloaded");
    return;
  });
};

app.get("/version", async (_, res: Response) => {
  const version = await isVersionUpToDate();
  res.send("current version is " + version);
});

app.get("/download", async (_, res: Response) => {
  downloadData();
  res.send();
});

app.get("/champ/:name", async (req, res) => {
  const key = req.params.name;

  if (!fs.existsSync(CHAMPION_PATH(key))) res.json(null);

  const abilities = fs.readFileSync(CHAMPION_PATH(key) + "abilities.json");

  res.json(abilities.toString());
});

// Optional: Schedule to fetch JSON every hour
cron.schedule("0 * * * *", async () => {
  createDirIfNotExists();
  logger.info("cron called at " + Date.now);
  const [isUpToDate, version] = await isVersionUpToDate();
  logger.info(`${isUpToDate}, ${version}, called at ${Date.now}`);

  if (isUpToDate || !!version) return;

  await downloadData();
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
