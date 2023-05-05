<script setup>
import { fetch } from "@tauri-apps/api/http"
import { Command } from "@tauri-apps/api/shell"
import { reactive } from "vue";
import { type } from '@tauri-apps/api/os'

// releases
// archive: "stable/macos/flutter_macos_3.7.12-stable.zip"
// channel: "stable"
// dart_sdk_arch: "x64"
// dart_sdk_version: "2.19.6"
// hash: "4d9e56e694b656610ab87fcf2efbcd226e0ed8cf"
// release_date: "2023-04-20T00:19:55.889101Z"
// sha256: "80fa676172c410eda0761cff5bac0584729164b50b12f47e6d08cac2b766d593"
// version: "3.7.12"
const filter = reactive({
    release: 'stable',
    mirror: navigator.language === 'zh-CN' ? 'https://mirrors.tuna.tsinghua.edu.cn/flutter' : 'https://storage.googleapis.com',
    versions: {
        current_release: {},
        releases: []
    },
})

// https://storage.googleapis.com/flutter_infra_release/releases/releases_macos.json

const getFlutterReleaseVersions = async () => {
    // "Linux" | "Darwin" | "Windows_NT"
    const osType = await type();
    var p = ''
    if (osType === 'Darwin') {
        p = 'macos'
    } else if (osType === 'Windows_NT') {
        p = 'windows'
    } else {
        p = 'linux'
    }

    try {
        const response = await fetch(
            `${filter.mirror}/flutter_infra_release/releases/releases_${p}.json`,
            {
                method: 'GET'
            }
        )
        filter.versions = response.data
        // const channel = response.data.releases.filter((item) => item.channel === filter.release)
        // filter.versions.releases = channel
        // filter.versions.current_release = response.data.current_release
        console.log("filter::::::", filter.versions);
    } catch (error) {
        console.log(error)
    }
}


const onRaidoChange = async (value) => {
    console.log("onRaidoChange============", value);
}

const onSelectChange = (value) => {
    console.log("onSelectChange============", value);
}


getFlutterReleaseVersions()

</script>



<template>
    <a-layout class="layout">
        <a-affix offset-top="44" >
            <a-layout-header style="z-index: 1;">
                <a-space>
                    <a-radio-group @change="onRaidoChange" v-model="filter.release">
                        <a-radio value="stable" :default-checked="true">Stable</a-radio>
                        <a-radio value="dev">Dev</a-radio>
                        <a-radio value="beta">Beta</a-radio>
                    </a-radio-group>
                </a-space>
                <a-space>
                    <a-select :style="{ width: '320px' }" v-model="filter.mirror" placeholder="Please select ..."
                        @change="onSelectChange">
                        <a-option>https://storage.googleapis.com</a-option>
                        <a-option>https://storage.flutter-io.cn</a-option>
                        <a-option>https://mirrors.tuna.tsinghua.edu.cn/flutter</a-option>
                    </a-select>
                </a-space>
            </a-layout-header>
        </a-affix>
        <a-layout-content>
            <a-list :data="filter.versions.releases">
                <template #item="{ item, index }">
                    <a-list-item :key="index">
                        <a-list-item-meta :title="item.version" :description="item.release_date">
                            <template #avatar>
                                <a-avatar shape="square">
                                    A
                                </a-avatar>
                            </template>
                        </a-list-item-meta>
                    </a-list-item>
                </template>
            </a-list>
        </a-layout-content>
        <a-layout-footer class="footer">
            <a-space>
                <a-button type="primary">Download</a-button>
            </a-space>
        </a-layout-footer>
    </a-layout>
</template>


<style scoped>
.layout :deep(.arco-layout-header) {
    height: 44px;
    border-bottom: 0.5px solid var(--color-border-2);
    display: flex;
    align-items: center;
    padding-left: 15px;
    padding-right: 15px;
    justify-content: space-between;
    background-color: var(--color-bg-2);
    overflow: hidden;
}

.footer {
    height: 64px;
    position: fixed;
    bottom: 0;
    left: 0px;
    right: 0;
    z-index: 1;
    background-color: var(--color-bg-2);
    display: flex;
    justify-content: end;
    padding-right: 30px;
}
</style>
  