<script setup>
import { useRouter } from "vue-router"
import { ref } from 'vue'
import { open } from '@tauri-apps/api/shell'
import * as ConfigUtils from './utils/config-utils'
const router = useRouter()

const isDark = ref(false)
const isCollapsed = ref(false)

const onMenuItemClick = (key) => {
  switch (key) {
    case '1':
      router.push('/')
      break;
    case '2':
      router.push('/version')
      break;
    default:
      router.push('/setting')
      break;
  }
}


const switchTheme = async() => {
  if (isDark.value) {
    isDark.value = false
    document.body.removeAttribute('arco-theme')
  } else {
    isDark.value = true
    document.body.setAttribute('arco-theme', 'dark')
  }

  const conf = await ConfigUtils.getConfig()
  conf.theme = isDark.value ? 'dark':'light'
  await ConfigUtils.saveConfigJson(conf)
}

const goGithub = () => {
  open('https://github.com/WuJiuYou/flutter-keeper')
}

const collapsedEvent = (value) => {
  isCollapsed.value = value
}

const getCurrentTheme=async()=>{
  const conf = await ConfigUtils.getConfig()
  if(conf.theme == 'dark'){
    isDark.value = true
    document.body.setAttribute('arco-theme', 'dark')
  }else{
    isDark.value = false
    document.body.removeAttribute('arco-theme')
  }
}

getCurrentTheme()

</script>
<template>
  <a-layout class="layout-demo">
    <a-layout-header class="header">
      <a-space>
        <img src="./assets/s-logo.svg" alt="" srcset="" height="30">
        <span class="title">FLUTTER KEEPER</span>
      </a-space>
      <a-space>
        <a-button type="text" @click="goGithub">
          <template #icon>
            <icon-github />
          </template>
        </a-button>

        <a-button type="text" @click="switchTheme">
          <template #icon>
            <icon-sun-fill v-if="isDark" />
            <icon-moon-fill v-else />
          </template>
        </a-button>
      </a-space>
    </a-layout-header>
    <a-layout-content>
      <a-layout-sider collapsible breakpoint="xl" @collapse="collapsedEvent" show-collapse-button class="sider">
        <a-menu :default-selected-keys="['1']" :style="{ width: '100%' }" @menu-item-click="onMenuItemClick">
          <a-menu-item key="1">
            <IconHome></IconHome>
            Project
          </a-menu-item>
          <a-menu-item key="2">
            <icon-tag />
            Versions
          </a-menu-item>
          <a-menu-item key="3">
            <icon-settings />
            Setting
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout class="routerView" :class="{isCollapsed:isCollapsed}">
        <router-view></router-view>
      </a-layout>
    </a-layout-content>
  </a-layout>
</template>

<style scoped>
.layout-demo {
  background-color: var(--color-bg-1);
}

.header {
  width: 100%;
  height: 44px;
  box-sizing: border-box;
  min-height: 44px;
  max-height: 44px;
  display: flex;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  border-bottom: 0.5px solid var(--color-border);
  background-color: var(--color-bg-2);
  padding-right: 15px;
  padding-left: 15px;
}

.sider {
  position: fixed;
  top: 44px;
  bottom: 0;
  left: 0;
  z-index: 99;
  margin-left: 0;
  border-right: .5px solid var(--color-border);
  overflow: hidden;
}

.title {
  font-size: medium;
  font-weight: bold;
  color: var(--color-text-1);
}

.routerView {
  margin-left: 200px;
  margin-top: 44px;
}

.isCollapsed {
  margin-left: 48px;
}
</style>
