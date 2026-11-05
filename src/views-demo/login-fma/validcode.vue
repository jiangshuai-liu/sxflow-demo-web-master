<template>
	<div class="code-area">
		<div class="flex-box">
			<input
				v-for="n in maxlength"
				@type="isPwd ? 'password' : 'text'"
				:key="n"
				class="input-item"
				@keydown="keydownHandle"
				@keyup="keyupHandle"
				@paste="pasteHandle"
				autocomplete="off"
			/>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		//最大长度 值为4或者6
		maxlength: {
			type: Number,
			default: 4,
		},
		//是否是密码
		isPwd: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			input_lock: false,
			doms: [],
		}
	},
	mounted() {
		let doms = document.getElementsByClassName('input-item')
		this.doms = doms
		//防止中文输入法多输入
		;[].forEach.call(doms, (inputDom) => {
			inputDom.addEventListener('compositionstart', () => {
				console.log('compositionstart')
				this.input_lock = true
			})
			inputDom.addEventListener('compositionend', (event) => {
				this.input_lock = false
				console.log('compositionend')
				this.keyupHandle(event)
			})
		})
		doms[0].focus()
	},
	methods: {
		//退格处理
		keydownHandle(event) {
			if (this.input_lock || event.key !== 'Backspace' || event.target.value != '') {
				return false
			}

			let preDom = event.target.previousElementSibling
			if (preDom) {
				preDom.value = ''
				preDom.focus()
			}
		},
		//键入
		keyupHandle(event) {
			if (this.input_lock) return false
			let {
				target,
				target: { value },
			} = event
			value = this.formatValue(value)
			if (/[^\w./]/.test(value) || value == '') {
				target.value = ''
				return false
			}
			target.value = value.charAt(value.length - 1)
			let nextDom = target.nextElementSibling
			if (nextDom) {
				nextDom.value = ''
				nextDom.focus()
			} else {
				target.blur()
				this.getVal()
			}
		},
		//粘贴
		pasteHandle(event) {
			// 当进行粘贴时
			let paste = this.formatValue((event.clipboardData || window.clipboardData).getData('text'))
			if (paste.length == this.maxlength) {
				for (let i = 0; i < this.maxlength; i++) {
					this.doms[i].value = paste.charAt(i)
				}
				event.target.blur()
				this.getVal()
			} else {
				this.clear()
			}
			event.preventDefault()
		},
		//取值
		getVal() {
			//输入完成
			let value = [].reduce.call(this.doms, (pre, el) => pre + el.value, '')
			this.$emit('finish', value)
		},
		//清除验证码或者密码
		clear() {
			[].forEach.call(this.doms, (el) => (el.value = ''))
			this.doms[0].focus()
		},
		//格式化
		formatValue(value) {
			return value
				.replace(/[^\w./]/gi, '')
				.replaceAll('.', '')
				.trim()
		},
	},
}
</script>

<style lang="scss">
input,
button,
select,
textarea {
	outline: none;
}

.btn:focus,
.btn:active:focus {
	outline: none;
	border-color: transparent;
	box-shadow: none;
}

input {
	color: #333;
	caret-color: #399ffd;
}

@supports (-webkit-mask: none) and (not (cater-color: red)) {
	input {
		color: #399ffd;
	}

	input::first-line {
		color: #333;
	}
}

.code-area {
	text-align: center;

	.flex-box {
		display: flex;
		flex-wrap: wrap;
		position: relative;
		justify-content: center;
	}

	.input-item {
		position: relative;
		width: 40px;
		height: 50px;
		margin-right: 9px;
		font-size: 15px;
		font-weight: bold;
		line-height: 50px;
		box-sizing: border-box;
		border: 1px solid #009999;
		text-align: center;
	}

	.input-item:last-child {
		margin-right: 0;
	}

	input:focus {
		border-color: #1890ff;
	}
}
</style>
