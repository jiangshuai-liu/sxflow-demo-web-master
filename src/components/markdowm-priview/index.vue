<template>
	<div class="textmd">
		<t-pr-markdown :text="text"></t-pr-markdown>
		<textarea
			style="width: 100%; height: 200px"
			rows=""
			cols=""
		></textarea>
	</div>
</template>
<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		text?: string
	}>(),
	{
		text: `
# 一级标题

- 列表1
- 列表2
- 列表3
\`\`\`js
//js函数
function changeUrlUse(abc : string) :string {
	console.log(abc)
  return abc
}

\`\`\`
\`\`\`css
.aaa{
  background:red;
}
\`\`\`


### 1.4 表格示例

| 字段        |      说明      | 
| ------------- | :-----------: |
| code      | 分组之后的结构数据 | 
| data      |   真实form表单存储数据    |
| msg |   用于存储后端传过来的数据    |
`,
	}
)
</script>
<style lang="scss" scoped>
.textmd {
	width: 60%;
	margin-left: 20%;
	border: 1px solid black;
}
</style>
