<script setup>
import { ref, reactive } from "vue";
import { type } from "@tauri-apps/api/os";
import { homeDir, join } from "@tauri-apps/api/path";
import { Command, open } from "@tauri-apps/api/shell";
import * as fs from "@tauri-apps/api/fs";
import { Notification, Modal } from "@arco-design/web-vue";
import * as ConfigUtils from "../utils/config-utils";
import YAML from "js-yaml";


const form = reactive({
    projectName: "first_app",
    description: "A new Flutter project.",
    projectType: "app",
    organization: "com.example",
    androidLang: "kotlin",
    iosLang: "swift",
    platforms: ["ios", "android", "web", "macos", "windows", "linux"],
    flutterVersion: '',

    disabled: false,
    visible: false,
    items: [],
    projectPath: "",
    sdkSavePath: "",
    flutterHome: "",
    versions: [],
    os: ""
});

const readFlutterProjectList = async () => {
    const osType = await type();
    if (osType === 'Darwin') {
        form.os = 'macos'
    } else if (osType === 'Windows_NT') {
        form.os = 'windows'
    } else {
        form.os = 'linux'
    }
    if (form.projectPath === "") {
        const conf = await ConfigUtils.getConfig();
        form.projectPath = conf.projectPath;
        form.sdkSavePath = conf.sdkSavePath;
    }
    const home = await homeDir()
    form.flutterHome = await join(home, 'flutter')
    form.versions = await ConfigUtils.getSdkVersions(form.sdkSavePath)
    if(form.versions.length > 0){
        form.flutterVersion = form.versions[0]
    }
    const projectDir = await fs.readDir(form.projectPath);
    const flutterProjectList = [];
    for (let index = 0; index < projectDir.length; index++) {
        const item = projectDir[index];
        // console.log('item:::::::', item)
        if (item.children) {
            const yaml = await join(item.path, "pubspec.yaml");
            const isExists = await fs.exists(yaml);
            if (isExists) {
                const filed = await fs.readTextFile(yaml);
                const yamlFile = YAML.load(filed);
                const keepConf = await ConfigUtils.readKeeperConf(item.path)
                flutterProjectList.push({
                    name: item.name,
                    desc: yamlFile.description,
                    version: yamlFile.version,
                    path: item.path,
                    flutterVersion: keepConf.version,
                    creatTime: keepConf.time
                });
            }
        }
    }
    form.items.length = 0;
    if (flutterProjectList.length > 1) {
        flutterProjectList.sort((a, b) => b.creatTime - a.creatTime)
    }
    form.items = [...flutterProjectList];
};

const handleCommandSuccess = () => {
    Notification.success({
        title: "Success",
        content: `the ${form.projectName} create success !!!`,
    });
};

const handleCommandError = (error) => {
    Notification.error({
        title: "Error",
        content: error,
    });
};

const handleClick = async () => {
    form.versions = await ConfigUtils.getSdkVersions(form.sdkSavePath)
    if (form.versions.length === 0) {
        Modal.warning({
            title: 'Warning Notification',
            content: 'Please download the Flutter SDK on the "Versions" page and configure the relevant Flutter environment variables.Then refer to the relevant configuration on the setting page for the Flutter SDK path'
        });
    } else {
        form.visible = true;
    }
}

const handleOk = async () => {
    form.disabled = true;
    form.visible = true;
    var basePath = "";
    basePath = await homeDir();
    basePath = await join(basePath, "KeeperSpace");

    const params = [
        "create",
        await join(basePath, form.projectName),
        "--org",
        form.organization,
        "--description",
        form.description,
        "--template",
        form.projectType
    ]

    if (form.projectType !== 'package') {
        params.push('--android-language', form.androidLang)
        params.push('--ios-language', form.iosLang)
        params.push('--platforms', form.platforms.join(','))
    }

    params.push('--pub')
    params.push('--no-offline')
    params.push('--overwrite')

    const commandResult = await new Command("flutter", params).execute();
    form.disabled = false;
    if (commandResult.code == 0) {
        const codePath = await join(basePath, form.projectName)
        const fullPath = await join(codePath, 'keeper.conf')
        const time = Date.now();
        const conf = JSON.stringify({ version: form.flutterVersion, time })
        await fs.writeTextFile(fullPath, conf)
        await readFlutterProjectList();
        handleCommandSuccess();
        form.visible = false;
        return true;
    } else {
        handleCommandError(commandResult.stderr);
        return false;
    }
};

const handleCancel = () => {
    form.visible = false;
}

const studioOpen = async (path, version) => {
    const isCanOpen = await setFlutterSDKSymlink(version)
    if (isCanOpen) open(`idea://open?file=${path}`);
}
const codeOpen = async (path, version) => {
    const isCanOpen = await setFlutterSDKSymlink(version)
    if (isCanOpen) open(`vscode://file/${path}`);
}

const finderOpen = (path) => {
    open(`file://${path}`);
}

const disableform = () => {
    return form.projectType === 'package'
}

const setFlutterSDKSymlink = async (version) => {
    var isSuccess = true
    const fullPath = await join(form.sdkSavePath, version)
    const shorPath = form.flutterHome
    const isExitst = await fs.exists(shorPath)
    if (isExitst) {
        const current = await fs.readTextFile(await join(shorPath, 'version'))
        if (current !== version) {
            await fs.removeDir(shorPath, { recursive: true })
        }
    }
    var res;
    if (form.os === 'windows') {
        res = await new Command('mklink', ['/D', shorPath, fullPath]).execute()
    } else {
        res = await new Command('ln', ['-s', fullPath, shorPath]).execute()
    }
    if (res.code !== 0) {
        console.log("ln::::::::", res.stderr);
        return false
    } else {
        console.log("ln::::::::", res.stdout);
    }
    return isSuccess
}

const changeFlutterVersion = async (value, item) => {
    if (value === item.flutterVersion) return
    const keepConf = await ConfigUtils.readKeeperConf(item.path)
    const fullPath = await join(item.path, 'keeper.conf')
    keepConf.version = value;
    const conf = JSON.stringify(keepConf)
    await fs.writeTextFile(fullPath, conf)
    await readFlutterProjectList();
}


readFlutterProjectList();
</script>

<template>
    <a-layout-content class="content">
        <a-grid :cols="{ xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }" :colGap="20" :rowGap="20" class="grid-grid">
            <a-card v-for="item in form.items" :key="item.name" :title="item.name" hoverable>
                <template #extra>
                    <a-space>
                        <img src="../assets/studio.png" width="25" @click="studioOpen(item.path, item.flutterVersion)"
                            class="bImage" />
                        <img src="../assets/code.png" width="25" @click="codeOpen(item.path, item.flutterVersion)"
                            class="bImage" />
                        <img src="../assets/finder.png" width="25" @click="finderOpen(item.path)" class="bImage" />
                    </a-space>
                </template>
                {{ item.desc }}
                <br />
                <br />
                <br />
                <a-space :wrap="true">
                    <a-tag size="small">v{{ item.version }}</a-tag>
                    <a-dropdown trigger="hover" @select="(value) => changeFlutterVersion(value, item)">
                        <a-tag size="small">
                            use:v{{ item.flutterVersion }}
                            <template #icon>
                                <icon-check-circle-fill />
                            </template>
                        </a-tag>
                        <template #content>
                            <a-doption v-for="version in form.versions" :key="version" :value="version">v{{ version
                            }}</a-doption>
                        </template>
                    </a-dropdown>
                </a-space>
            </a-card>
            <a-card @click="handleClick" hoverable style="display: flex;align-items: center;justify-content: center;">
                <a-empty>
                    <template #image>
                        <icon-plus />
                    </template>
                    Create New Flutter Project
                </a-empty>
            </a-card>
        </a-grid>
    </a-layout-content>

    <a-modal :visible="form.visible" :closable="false" :maskClosable="false" :on-before-ok="handleOk" @cancel="handleCancel"
        width="auto" ok-text="Finish" cancel-text="Cancel" unmountOnClose>
        <template #title> New Project </template>
        <a-form :model="form" :disabled="form.disabled">
            <a-form-item field="projectName" label="Project name">
                <a-input v-model="form.projectName" />
            </a-form-item>

            <a-form-item field="flutterVersion" label="Use Version" tip>
                <a-select v-model="form.flutterVersion">
                    <a-option v-for="(item, index) in form.versions" :key="index" :value="item">flutter v{{ item }}</a-option>
                </a-select>
            </a-form-item>

            <a-form-item field="organization" label="Organization">
                <a-input v-model="form.organization" />
            </a-form-item>

            <a-form-item field="description" label="Description">
                <a-input v-model="form.description" />
            </a-form-item>

            <a-form-item field="projectType" label="Project type" tip>
                <a-select v-model="form.projectType">
                    <a-option value="app">Application</a-option>
                    <a-option value="package">Package</a-option>
                    <a-option value="plugin">Plugin</a-option>
                    <!-- <a-option value="module">Module</a-option>
                    <a-option value="plugin_ffi">FFI Plugin</a-option>
                    <a-option value="skeleton">Skeleton</a-option> -->
                </a-select>
            </a-form-item>

            <a-form-item field="androidLang" label="AndroidLang" :disabled="disableform()">
                <a-radio-group v-model="form.androidLang">
                    <a-radio value="java">Java</a-radio>
                    <a-radio value="kotlin">Kotlin</a-radio>
                </a-radio-group>
            </a-form-item>

            <a-form-item field="iosLang" label="iOSLang" :disabled="disableform()">
                <a-radio-group v-model="form.iosLang">
                    <a-radio value="objc">Object-C</a-radio>
                    <a-radio value="swift">Swift</a-radio>
                </a-radio-group>
            </a-form-item>

            <a-form-item field="platforms" label="Platforms" :disabled="disableform()">
                <a-checkbox-group v-model="form.platforms">
                    <a-checkbox value="ios">iOS</a-checkbox>
                    <a-checkbox value="android">Android</a-checkbox>
                    <a-checkbox value="web">Web</a-checkbox>
                    <a-checkbox value="macos">MacOS</a-checkbox>
                    <a-checkbox value="windows">Windows</a-checkbox>
                    <a-checkbox value="linux">Linux</a-checkbox>
                </a-checkbox-group>
            </a-form-item>
        </a-form>
        <!-- {{ form }} -->
    </a-modal>
</template>

<style scoped>
.grid-grid {
    padding: 20px;
}

.empty {
    display: flex;
    justify-content: center;
    align-items: center;
}

.bImage:hover {
    transform: scale(1.2);
}

.content {
    min-height: calc(100vh - 44px);
}
</style>
