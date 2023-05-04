<script setup>
import { upload, download } from 'tauri-plugin-upload-api'
import { useRouter } from "vue-router"
import { ref } from 'vue'
import {open} from '@tauri-apps/api/shell'

const router = useRouter()

const isDark = ref(false)

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


const switchTheme = () => {
  if (isDark.value) {
    isDark.value = false
    document.body.removeAttribute('arco-theme')
  } else {
    isDark.value = true
    document.body.setAttribute('arco-theme', 'dark')
  }
}

const goGithub = () => {
    open('https://github.com/WuJiuYou/flutter-keeper')
}

</script>
<template>
  <a-layout class="layout-demo">
    <a-layout-header>
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
    <a-layout>
      <a-layout-sider collapsible breakpoint="xl">
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

        <template #trigger="{ collapsed }">
          <IconCaretRight v-if="collapsed"></IconCaretRight>
          <IconCaretLeft v-else></IconCaretLeft>
        </template>
      </a-layout-sider>
      <a-layout>
        <router-view></router-view>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.layout-demo {
  height: 100vh;
  background-color: var(--color-bg-1);
}

/* .layout-demo :deep(.arco-layout-content) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 16px;
  font-stretch: condensed;
  text-align: center;
} */

.layout-demo :deep(.arco-layout-header) {
  height: 44px;
  border-bottom: 0.5px solid var(--color-border-2);
  display: flex;
  align-items: center;
  padding-left: 15px;
  padding-right: 15px;
  justify-content: space-between;
  background-color: var(--color-bg-2);
}

.title {
  font-size: medium;
  font-weight: bold;
  color: var(--color-text-1);
}
</style>
