<script setup>
import { ref, reactive } from "vue";
import { homeDir, join } from "@tauri-apps/api/path";
import { Command, open } from "@tauri-apps/api/shell";
import * as fs from "@tauri-apps/api/fs";
import { Notification } from '@arco-design/web-vue';
import * as ConfigUtils from '../utils/config-utils'
import YAML from 'js-yaml'


const visible = ref(false)

const disabled = ref(false)

const form = reactive({
    projectName: "untitled",
    description: "A new Flutter project.",
    projectType: "app",
    organization: "com.example",
    androidLang: "kotlin",
    iosLang: "swift",
    platforms: ["ios", "android", "web", "macos", "windows", "linux"],

    items: [],

    projectPath: ''

})

const readFlutterProjectList = async () => {
    if (form.projectPath === '') {
        const conf = await ConfigUtils.getConfig()
        form.projectPath = conf.projectPath;
    }
    const projectDir = await fs.readDir(form.projectPath)

    const flutterProjectList = []
    for (let index = 0; index < projectDir.length; index++) {
        const item = projectDir[index];
        if (item.children !== undefined) {
            const yaml = await join(item.path, 'pubspec.yaml')
            const isExists = await fs.exists(yaml)
            if (isExists) {
                const filed = await fs.readTextFile(yaml)
                const yamlFile = YAML.load(filed)
                flutterProjectList.push({
                    name: yamlFile.name,
                    desc: yamlFile.description,
                    version: yamlFile.version,
                    path: item.path
                })
            }

        }
    }
    form.items.length = 0
    form.items = [...flutterProjectList]

    console.log('*******查找目录完成********')
}

const handleCommandSuccess = () => {
    Notification.success({
        title: 'Success',
        content: `the ${form.projectName} create success !!!`,
    })
}

const handleCommandError = () => {
    Notification.error({
        title: 'Error',
        content: `the ${form.projectName} create fail !!!`,
    })
}

const handleClick = async () => {
    visible.value = true
}

const handleOk = async () => {
    disabled.value = true
    visible.value = true
    var basePath = ""
    basePath = await homeDir()
    basePath = await join(basePath, "KeeperSpace")

    const commandResult = await new Command(
        'flutter', ['create',
        await join(basePath, form.projectName),
        '--org', form.organization,
        '--description', form.description,
        '--android-language', form.androidLang,
        '--ios-language', form.iosLang,
        '--template', form.projectType,
        '--platforms', form.platforms.join(','),
        '--pub',
        '--no-offline',
        '--overwrite'],
    ).execute();
    disabled.value = false
    if (commandResult.code == 0) {
        await readFlutterProjectList()
        handleCommandSuccess()
        visible.value = false
        return true;
    } else {
        handleCommandError()
        return false;
    }
}

const handleCancel = () => {
    visible.value = false
}


const studioOpen  = (path)=>{
    open(`idea://open?file=${path}`)
}
const codeOpen = (path)=>{
    open(`vscode://file/${path}`)
}

readFlutterProjectList()

</script>

<template>
    <a-grid :cols="{ xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }" :colGap="20" :rowGap="20" class="grid-grid">
        <a-card v-for="item in form.items" :key="item.name" :title="item.name" hoverable>
            <template #extra>
                <a-space>
                    <img src="../assets/studio.png" width="20"  @click="studioOpen(item.path)"/>
                    <img src="../assets/code.png" width="20" @click="codeOpen(item.path)"/>
                </a-space>
            </template>
            {{ item.desc }}
            <br />
            {{ item.version }}
        </a-card>
        <a-card @click="handleClick" hoverable>
            <a-empty>
                <template #image>
                    <icon-plus />
                </template>
                Create New Flutter Project
            </a-empty>
        </a-card>
    </a-grid>


    <a-modal :visible="visible" :closable="false" :maskClosable="false" :on-before-ok="handleOk" @cancel="handleCancel"
        width="auto" ok-text="Finish" cancel-text="Cancel" unmountOnClose>
        <template #title> New Project </template>
        <a-form :model="form" :disabled="disabled">
            <a-form-item field="projectName" label="Project name">
                <a-input v-model="form.projectName" />
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
                    <a-option value="module">Module</a-option>
                    <a-option value="package">Package</a-option>
                    <a-option value="plugin">Plugin</a-option>
                    <a-option value="plugin_ffi">FFI Plugin</a-option>
                    <a-option value="skeleton">Skeleton</a-option>
                </a-select>
            </a-form-item>

            <a-form-item field="androidLang" label="AndroidLang">
                <a-radio-group v-model="form.androidLang">
                    <a-radio value="java">Java</a-radio>
                    <a-radio value="kotlin">Kotlin</a-radio>
                </a-radio-group>
            </a-form-item>

            <a-form-item field="iosLang" label="iOSLang">
                <a-radio-group v-model="form.iosLang">
                    <a-radio value="objc">Object-C</a-radio>
                    <a-radio value="swift">Swift</a-radio>
                </a-radio-group>
            </a-form-item>

            <a-form-item field="platforms" label="Platforms">
                <a-checkbox-group v-model="form.platforms">
                    <a-checkbox value="ios">iOS</a-checkbox>
                    <a-checkbox value="android">Android</a-checkbox>
                    <a-checkbox value="windows">Windows</a-checkbox>
                    <a-checkbox value="macos">MacOS</a-checkbox>
                    <a-checkbox value="linux">Linux</a-checkbox>
                    <a-checkbox value="web">Web</a-checkbox>
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
</style>
