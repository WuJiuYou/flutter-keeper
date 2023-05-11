<script setup>

import { reactive } from 'vue';
import { homeDir, join,appDataDir } from "@tauri-apps/api/path";
import { Command } from "@tauri-apps/api/shell";
import { open } from "@tauri-apps/api/dialog";
import { saveConfigJson, getConfig } from "../utils/config-utils"
import { Message } from '@arco-design/web-vue';

var home = ''

const form = reactive({
  flutterHome: '',
  sdkSavePath: '',
  projectPath: '',
  sdkShortPath: '',
  studioPath: '',
  codePath: '',
  theme:'',
})


const onSelectSavePath = async () => {
  const selected = await open({
    multiple: false,
    directory: true,
    defaultPath: home,
  });
  if (selected != null) {
    form.sdkSavePath = selected;
  }
}

const onSelectProjectPath = async () => {
  const selected = await open({
    multiple: false,
    directory: true,
    defaultPath: home,
  });
  if (selected !== null) {
    form.projectPath = selected;
  }
}

const setFlutterDir = async () => {
  home = await homeDir()
  form.flutterHome = await join(home, 'flutter')

  const config = await getConfig()
  form.sdkSavePath = config.sdkSavePath
  form.projectPath = config.projectPath
  form.studioPath = config.studioPath
  form.codePath = config.codePath
  form.theme = config.theme
}

const onSelectStudioPath = async () => {
  const selected = await open({
    multiple: false,
    directory: false,
    defaultPath: home,
  });
  if (selected !== null) {
    form.studioPath = selected;
  }
}
const onSelectVSPath = async () => {
  const selected = await open({
    multiple: false,
    directory: false,
    defaultPath: home,
  });
  if (selected !== null) {
    form.codePath = selected;
  }
}

const handleSubmit = async () => {
  
  await saveConfigJson({
    sdkSavePath: form.sdkSavePath,
    projectPath: form.projectPath,
    studioPath:form.studioPath,
    codePath:form.codePath,
    theme:form.theme
  })

  Message.success('save success!!!')
}

setFlutterDir()

</script>


<template>
  <a-layout style="padding-right: 100px;">
    <a-form :model="form"  @submit="handleSubmit" style="display: flex;height: calc(100vh - 44px);padding-top: 50px;">
      <a-form-item field="flutterHome" label="Flutter Home">
        <a-input v-model="form.flutterHome" disabled />
        <template #extra>
          <div>Use this value to configure the environment variable for Flutter</div>
        </template>
      </a-form-item>

      <a-form-item field="sdkSavePath" label="Sdk Save Path">
        <a-input-search v-model="form.sdkSavePath" search-button @search="onSelectSavePath">
          <template #button-icon>
            <icon-folder />
          </template>
        </a-input-search>
      </a-form-item>

      <a-form-item field="projectPath" label="Project Path">
        <a-input-search v-model="form.projectPath" search-button @search="onSelectProjectPath">
          <template #button-icon>
            <icon-folder />
          </template>
        </a-input-search>
      </a-form-item>

      <a-form-item field="studioPath" label="Android Studio">
        <a-input-search v-model="form.studioPath" search-button @search="onSelectStudioPath" placeholder="please select android studio full install path ">
          <template #button-icon>
            <icon-folder />
          </template>
        </a-input-search>
      </a-form-item>

      <a-form-item field="codePath" label="Visual Studio Code">
        <a-input-search v-model="form.codePath" search-button @search="onSelectVSPath" placeholder="please select vscode full install path">
          <template #button-icon>
            <icon-folder />
          </template>
        </a-input-search>
      </a-form-item>

      <a-form-item>
        <a-space>
          <a-button type="primary" html-type="submit">Save</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-layout>
</template>


<style scoped>

</style>
