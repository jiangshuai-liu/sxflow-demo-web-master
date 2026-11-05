<template>
	<div>授权系统权限 {{ companyId }}</div>
</template>
<script setup lang="ts">
import { companyIdType } from '@/types/rbac/organization'

const props = withDefaults(defineProps<companyIdType>(), {})
</script>
<style lang="scss" scoped></style>
