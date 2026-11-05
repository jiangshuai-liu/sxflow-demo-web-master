<template>
  <el-empty :image="emptyImg"></el-empty>
</template>
<script setup lang="ts">
const emptyImg = new URL(`../../assets/empty.png`, import.meta.url).href;
</script>
<style lang="scss" scoped>
:deep(.el-empty__description) {
  P {
    height: 23px;
    font-family: Microsoft YaHei UI, Microsoft YaHei UI;
    font-weight: 400;
    font-size: 18px;
    line-height: 23px;
    color: #909399;
  }
}
</style>
