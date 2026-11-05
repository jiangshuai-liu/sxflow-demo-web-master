<script lang="ts">
export default {
  name: "member",
};
</script>

<script setup lang="ts">
import { reactive, onMounted, toRefs } from "vue";

const state = reactive({
  // 遮罩层
  loading: true,
  // 选中数组
  ids: [],
  // 非单个禁用
  single: true,
  // 非多个禁用
  multiple: true,
  total: 0,
});
//  queryParams, memberList,
const { loading, total } = toRefs(state);

function handleQuery() {
  state.loading = true;
}

onMounted(() => {
  handleQuery();
});
</script>

<template>
  <div class="app-container"></div>
</template>

<style scoped></style>
