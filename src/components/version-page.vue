<script setup>
import { fetch } from "@tauri-apps/api/http"
import { open } from "@tauri-apps/api/shell"
import { reactive } from "vue";
import { type } from '@tauri-apps/api/os'
import dayjs from 'dayjs'
import { getConfig } from "../utils/config-utils"

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
        base_url: '',
        current_release: {},
        releases: []
    },
    sdkSavePath:""
})

const getSdkSavePath=async()=>{
    const config = await getConfig()
    filter.sdkSavePath = config.sdkSavePath
}

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

const openSdkSavePath=()=>{
    console.log("openSdkSavePath::::::::::::",filter.sdkSavePath);
    open(`file://${filter.sdkSavePath}`);
}


// const onRaidoChange = async (value) => {
//     console.log("onRaidoChange============", value);
// }

// const onSelectChange = (value) => {
//     console.log("onSelectChange============", value);
// }


getFlutterReleaseVersions()
getSdkSavePath()

</script>



<template>
    <a-layout style="position: relative;">
        <a-alert type="success" banner :show-icon="false">
            After downloading, please unzip to the "<a-link @click="openSdkSavePath">{{ filter.sdkSavePath }}</a-link>" folder, rename the folder to the version number of Flutter, for example: 3.7.0
        </a-alert>
        <a-affix :offsetTop="44">
            <a-layout-header class="oHeader">
                <a-space>
                    <a-radio-group v-model="filter.release">
                        <a-radio value="stable" :default-checked="true">Stable</a-radio>
                        <a-radio value="dev">Dev</a-radio>
                        <a-radio value="beta">Beta</a-radio>
                    </a-radio-group>
                </a-space>
                <a-space>
                    <a-select :style="{ width: '320px' }" v-model="filter.mirror" placeholder="Please select ..."
                        >
                        <a-option>https://storage.googleapis.com</a-option>
                        <a-option>https://storage.flutter-io.cn</a-option>
                        <a-option>https://mirrors.tuna.tsinghua.edu.cn/flutter</a-option>
                    </a-select>
                </a-space>
            </a-layout-header>
        </a-affix>

        <a-layout-content class="content">
            <a-list :data="filter.versions.releases.filter((el) => el.channel === filter.release)" :split="true"
                :bordered="false">
                <template #item="{ item, index }">
                    <a-list-item :key="index">
                        <a-space>
                            <a-tag color="red" v-if="item.dart_sdk_arch && item.dart_sdk_arch.trim()">{{ item.dart_sdk_arch
                            }}</a-tag>
                            <a-tag>v{{ item.version }}</a-tag>
                            <a-tag>{{ dayjs(item.release_date).format('YYYY-MM-DD HH:mm') }}</a-tag>
                        </a-space>
                        <template #actions>
                            <a :href="`${filter.versions.base_url.replace('https://storage.googleapis.com', filter.mirror)}/${item.archive}`"
                                target="_blank">
                                <a-button>
                                    <icon-download />
                                </a-button>
                            </a>
                        </template>
                    </a-list-item>
                </template>
            </a-list>
        </a-layout-content>

    </a-layout>
</template>


<style scoped>
.oHeader {
    height: 44px;
    display: flex;
    justify-content: space-between;
    padding: 0 20px 0 20px;
    z-index: 97;
    background-color: var(--color-bg-2);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.content {
    min-height: calc(100vh - 44px);
}
</style>
  