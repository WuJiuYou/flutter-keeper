import { homeDir, appConfigDir, join } from "@tauri-apps/api/path";
import * as fs from "@tauri-apps/api/fs";

async function confInit() {
  const home = await homeDir();
  const sdkSavePath = await join(home, "keeperVersion");
  const projectPath = await join(home, "keeperSpace");
  const theme = "light";
  await fs.createDir("", { dir: fs.BaseDirectory.AppConfig, recursive: true });
  await fs.createDir(sdkSavePath, { recursive: true });
  await fs.createDir(projectPath, { recursive: true });
  await saveConfigJson({
    sdkSavePath,
    projectPath,
    theme,
    studioPath:'',
    codePath:''
  });
}

export function saveConfigJson(conf) {
  return fs.writeTextFile("app.conf", JSON.stringify(conf), {
    dir: fs.BaseDirectory.AppConfig,
  });
}

export async function getConfig() {
  const isExist = await fs.exists("app.conf", {
    dir: fs.BaseDirectory.AppConfig,
  });
  if (!isExist) {
    await confInit();
  }
  const conf = await fs.readTextFile("app.conf", {
    dir: fs.BaseDirectory.AppConfig,
  });
  return JSON.parse(conf);
}

export async function readKeeperConf(path) {
  const confPath = await join(path, "keeper.conf");
  const isExist = await fs.exists(confPath);
  if (isExist) {
    const conf = await fs.readTextFile(confPath);
    return JSON.parse(conf);
  } else {
    return {
      version: "",
      time: 0,
    };
  }
}

export async function getSdkVersions(path) {
  const sdkDir = await fs.readDir(path);
  console.log("sdkDir::::::::::", sdkDir);
  const flutterSDKList = [];
  for (let index = 0; index < sdkDir.length; index++) {
    const item = sdkDir[index];
    if (item.children !== undefined) {
      flutterSDKList.push(item.name);
    }
  }
  if (flutterSDKList.length > 1) {
    flutterSDKList.sort((a, b) => a < b);
  }
  return flutterSDKList;
}
