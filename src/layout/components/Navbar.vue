<template>
	<div class="navbar">
		<div class="right-menu">
			<template v-if="device !== 'mobile'"> </template>

			<el-dropdown
				class="avatar-container right-menu-item hover-effect"
				trigger="click"
			>
				<div class="avatar-wrapper">
					<img
						:src="userTitle"
						class="user-avatar"
					/>
					<span>{{ internalData.$cookies.get('username') }} </span>
					<CaretBottom style="width: 0.6em; height: 0.6em; margin-left: 5px" />
				</div>

				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item
							divided
							@click="logout"
						>
							{{ $t('navbar.logout') }}
						</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
	</div>
</template>
<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'
import { ElMessageBox } from 'element-plus'

import useStore from '@/store'

// 组件依赖

// 图标依赖
import { CaretBottom } from '@element-plus/icons-vue'

const internalInstance = getCurrentInstance()
const internalData = internalInstance.appContext.config.globalProperties
const { app } = useStore()

const userTitle = new URL(`../../assets/index/userTitle.png`, import.meta.url).href

const device = computed(() => app.device)

function logout() {
	ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(() => {
		window.location.href = 'http://130.10.8.98/'
	})
}
</script>

<style lang="scss" scoped>
ul {
	list-style: none;
	margin: 0;
	padding: 0;
}
.navbar {
	height: 56px;
	overflow: hidden;
	position: relative;
	background: #fff;
	// box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
	display: flex;
	align-items: center;
	justify-content: flex-end;
	box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.12);
	z-index: 2;

	.right-menu {
		float: right;
		height: 100%;
		line-height: 50px;

		&:focus {
			outline: none;
		}

		.right-menu-item {
			display: inline-block;
			padding: 0 8px;
			height: 100%;
			font-size: 18px;
			color: #5a5e66;
			vertical-align: text-bottom;

			&.hover-effect {
				cursor: pointer;
				transition: background 0.3s;

				&:hover {
					background: rgba(0, 0, 0, 0.025);
				}
			}
		}

		.avatar-container {
			margin-right: 30px;
			line-height: 2.5; //new

			.avatar-wrapper {
				margin-top: 5px;
				position: relative;

				.user-avatar {
					cursor: pointer;
					width: 32px;
					height: 32px;
					border-radius: 10px;
					margin-right: 16px;
				}

				.el-icon-caret-bottom {
					cursor: pointer;
					position: absolute;
					right: -20px;
					top: 25px;
					font-size: 12px;
				}
			}
		}
	}
}
</style>
