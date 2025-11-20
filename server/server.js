// server.js
const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");

const app = express();
const PORT = process.env.PORT || 5000;

const DATA_FOLDER_PATH = __dirname + "/data/";
const CHAMPION_PATH = (key) => DATA_FOLDER_PATH + "/champions/" + key + "/";
const API_VERSION_FALLBACK = "15.22.1";
const VERSION_URL = "https://ddragon.leagueoflegends.com/api/versions.json";
const CHAMPIONS_URL = (version) => `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`;
const CHAMPIONS_ABILITIES = (version, key) =>
  `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion/${key}.json`;

const saveJsonFile = async (url, filePath) => {
  try {
    const response = await axios.get(url);
    fs.writeFileSync(filePath, JSON.stringify(response.data, null, 2), "utf8");
    console.log(`JSON saved to: ${filePath}`);
  } catch (error) {
    console.error(`Error fetching or saving JSON: ${error}`);
  }
};

if (!fs.existsSync(DATA_FOLDER_PATH)) {
  fs.mkdirSync(DATA_FOLDER_PATH);
  fs.mkdirSync(CHAMPION_PATH(""));
}

const getVersion = () => {
  const version = fs.readFileSync(path.join(DATA_FOLDER_PATH, "version.json"), "utf-8");
  return JSON.parse(version)?.current;
};

const isUpToDate = async () => {
  const filePath = path.join(DATA_FOLDER_PATH, "version.json");
  const versionResponse = await axios.get(VERSION_URL);

  if (!versionResponse.data || !Array.isArray(versionResponse.data) || versionResponse.data.length === 0) {
    console.error("Data received was not as expected");
    return;
  }
  const lastRiotVersion = versionResponse.data[0];

  const writeRiotVersion = () => {
    fs.writeFile(filePath, JSON.stringify({ current: lastRiotVersion }, null, 2), "utf8", (writeErr) => {
      if (writeErr) {
        console.error(`Error writing file: ${writeErr}`);
      } else {
        console.log("File successfully updated.");
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
    console.error(`Error ${error}.`);
  }
  return [false, null];
};

const downloadData = async () => {
  const version = getVersion();
  if (!fs.existsSync(CHAMPION_PATH(""))) fs.mkdirSync(CHAMPION_PATH(""));

  const champResponse = await axios.get(CHAMPIONS_URL(version));
  if (!champResponse?.data || !champResponse?.data.data) {
    console.error("Incorrect request.");
    return;
  }

  Object.keys(champResponse.data.data).forEach(async (key) => {
    if (!fs.existsSync(CHAMPION_PATH(key))) {
      fs.mkdirSync(CHAMPION_PATH(key));
    }
    await saveJsonFile(CHAMPIONS_ABILITIES(version, key), CHAMPION_PATH(key) + "abilities.json");
    console.log(key + " downloaded");
    return;
  });
};

app.get("/check-version", async (req, res) => {
  const version = await checkVersion();
  res.send("current version is " + version);
});

app.get("/download-needed", async (_, res) => {
  downloadData();
});

app.get("/champ/:name", async (req, res) => {
  const key = req.params.name;

  if (!fs.existsSync(CHAMPION_PATH(key))) res.json(null);

  const abilities = fs.readFileSync(CHAMPION_PATH(key) + "abilities.json");

  res.json(JSON.parse(abilities));
});

// Optional: Schedule to fetch JSON every hour
cron.schedule("0 6 * * *", async () => {
  const [isUpToDate, version] = await isUpToDate();

  if (isUpToDate || !!version) return;

  await downloadData();
});

// app.get("/data", (req, res) => {
//   const filePath = path.join(__dirname, "data.json");
//   res.sendFile(filePath);
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
