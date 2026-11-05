<template>
  <div class="SxCommonFooter">
    <div class="btnClose">
      <slot name="close"></slot>
    </div>

    <div class="btnSubmit">
      <slot name="submit"></slot>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
.SxCommonFooter {
  display: flex;
  justify-content: space-between;
  .el-button {
    width: 240px !important;
  }
}

.btnSubmit {
  display: flex;
  justify-content: space-between;
}
</style>
