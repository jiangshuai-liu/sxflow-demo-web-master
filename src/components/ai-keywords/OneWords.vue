<template>
	<span>{{ useWords }}</span>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
let props = defineProps({
	content: String,
})

let useWords = ref('')
const showOneToLast = (str) => {
	console.log(str)
	if (str?.length) {
		let i = 1
		let timer = null
		function StopDeal() {
			clearInterval(timer)
			timer = null
		}
		// outPuting()
		timer = setInterval(() => {
			console.log(str)

			if (i < str.length) {
				let useStr = str.slice(0, i++)
				// console.log(useStr)
				useWords.value = useStr
			} else {
				// console.log(str)
				StopDeal()
				useWords.value = str
			}
		}, 50)
	}
}
showOneToLast(props.content)
</script>
<style lang="scss" scoped></style>
