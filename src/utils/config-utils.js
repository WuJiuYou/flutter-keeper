
import {homeDir,appConfigDir,join} from "@tauri-apps/api/path"
import * as fs from "@tauri-apps/api/fs"


async function confInit(){
        const home = await homeDir()
        const sdkSavePath = await join(home,'.keeperVersion')
        const projectPath = await join(home,'keeperSpace')
        await fs.createDir('', { dir: fs.BaseDirectory.AppConfig, recursive: true});
        await saveConfig(sdkSavePath,projectPath)
}

export function saveConfig(sdkSavePath,projectPath){
    return fs.writeTextFile('app.conf',JSON.stringify({sdkSavePath,projectPath}), { dir: fs.BaseDirectory.AppConfig});
}

export async function getConfig(){
    const isExist = await fs.exists('app.conf',{dir: fs.BaseDirectory.AppConfig})
    if(!isExist){
        await confInit()
    }
    const conf = await fs.readTextFile('app.conf', { dir: fs.BaseDirectory.AppConfig });
    return JSON.parse(conf);
}


export async function readKeeperConf(path){
    const confPath = await join(path,'keeper.conf')
    const isExist = await fs.exists(confPath)
    if(isExist){
        const conf = await fs.readTextFile(confPath);
        return JSON.parse(conf);
    }else{
        return {
            version:'',
            time: 0
        }
    } 
}   
