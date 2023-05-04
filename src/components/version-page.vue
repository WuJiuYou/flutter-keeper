<script setup>

import { Command } from "@tauri-apps/api/shell";


const getFlutterTags = async () => {
    const commandResult = await new Command("git", ['ls-remote','--tags','https://github.com/flutter/flutter.git','--sort=-creatordate','v*.*.*']).execute();
    if(commandResult.code === 0){
        const stdout = commandResult.stdout.split('\n');
        const stable = stdout.map(el => el.split('/v')[1])
        console.log('stable:::::',stable);
    }else{
        console.log('commandResult:::::',commandResult.stderr);
    }
}

getFlutterTags()
</script>



<template>
    <a-result status="warning" title="This is title content">
        <template #subtitle>
            This is subtitle content
        </template>

        <template #extra>
            <a-space>
                <a-button type='primary'>Back</a-button>
            </a-space>
        </template>
    </a-result>
</template>


<style scoped></style>
  