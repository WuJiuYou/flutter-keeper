<script setup>

import { reactive } from 'vue';
import { homeDir, join } from "@tauri-apps/api/path";
import { Command } from "@tauri-apps/api/shell";
import { open } from "@tauri-apps/api/dialog";
import { saveConfig, getConfig } from "../utils/config-utils"

var home = ''

const form = reactive({
  flutterHome: '',
  sdkSavePath: '',
  projectPath: '',
  sdkShortPath: ''
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
  form.sdkShortPath = await join(home, 'flutter/bin:$PATH')

  const config = await getConfig()
  form.sdkSavePath = config.sdkSavePath
  form.projectPath = config.projectPath
}


const resetDir = async () => {
  form.sdkSavePath = await join(home, '.keeperVersion')
  form.projectPath = await join(home, 'keeperSpace')
  await saveConfig(form.sdkSavePath, form.projectPath)
}

const handleSubmit = async () => {
  await saveConfig(form.sdkSavePath, form.projectPath)
  console.log('saveConfig:::::::::')
  console.log(await getConfig())
  console.log(':::::::::saveConfig')
}

setFlutterDir()

</script>


<template>
  <a-layout style="padding-right: 100px;">
    <a-form :model="form"  @submit="handleSubmit" style="display: flex;height: calc(100vh - 44px);padding-top: 50px;">
      <a-form-item field="sdkShortPath" label="Flutter Home">
        <a-input v-model="form.sdkShortPath" disabled />
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

      <a-form-item>
        <a-space>
          <a-button type="primary" html-type="submit">Save</a-button>
          <a-button type="outline" @click="resetDir">Reset</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-layout>
</template>


<style scoped>

</style>
