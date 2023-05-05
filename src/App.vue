<script setup>
import { useRouter } from "vue-router"
import { computed, ref } from 'vue'
import { open } from '@tauri-apps/api/shell'

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

const collapsedEvent = (value) => {
  isCollapsed.value = value
  console.log('collapsedEvent========',value)
}

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
    <a-layout>
      <a-layout-sider collapsible breakpoint="xl" @collapse="collapsedEvent" class="sider">
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
      <a-layout-content class="content" :class="{collapsed:isCollapsed}">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.layout-demo {
  /* height: 100vh; */
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
  z-index: 999;
  border-bottom: 0.5px solid var(--color-border);
  background-color: var(--color-bg-2);
}

.sider {
  position: fixed;
  top: 44px;
  bottom: 0;
  left: 0;
  z-index: 1000;
  margin-left: 0;
  border-right: .5px solid var(--color-border);
  overflow: hidden;
}

.title {
  font-size: medium;
  font-weight: bold;
  color: var(--color-text-1);
}

.content {
  margin-top: 44px;
  margin-left: 200px;
  overflow: auto;
  flex-grow: 1;
}
.collapsed {
  margin-left: 40px;
}
</style>
