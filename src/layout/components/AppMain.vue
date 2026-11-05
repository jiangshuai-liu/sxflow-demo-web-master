<template>
  <section :class="{ 'app-main': true, noAi: app.noAi }">
    <ai-chat
      v-if="showAi == true"
      :class="{ 'chat-container': true, noAiChat: app.noAi }"
    />
    <router-view v-slot="{ Component }">
      <transition name="router-fade" mode="out-in">
        <!-- <keep-alive> -->
        <component :is="Component" />
        <!-- </keep-alive> -->
      </transition>
    </router-view>
  </section>
</template>

<script setup lang="ts">
import aiChat from "coms/ai-chat/index.vue";
import useStore from "@/store";
import { onMounted, ref } from "vue";
let showAi = ref(false);
const { app } = useStore();

onMounted(() => {
  showAi.value = import.meta.env.VITE_APP_AI;
});
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  height: calc(100vh - 57px);
  // height: 100vh;
  width: 100%;
  position: relative;
  overflow: auto;
  background: #f2f3f7;
  padding: 24px 32px;
  box-sizing: border-box;
  // display: flex;
  padding-left: 432px;

  transition: 0.5s all;
  &::-webkit-scrollbar-track-piece {
    background: #d3dce6;
  }

  &::-webkit-scrollbar {
    width: 0px;
  }

  &::-webkit-scrollbar-thumb {
    background: #99a9bf;
    border-radius: 20px;
  }
}

.fixed-header + .app-main {
  padding-top: 56px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
