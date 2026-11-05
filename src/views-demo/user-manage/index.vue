<template>
	<div>
		<div>
			<el-table
				class="sxTable"
				:data="userlist"
				style="width: 100%"
				header-cell-class-name="sxTableHeader"
				header-row-class-name="sxTableHeader"
				ref="multipleTableRef"
				border
			>
				<template #empty>
					<common-empty />
				</template>

				<el-table-column
					class-name="sxTableColumn"
					type="index"
					width="80"
					label="序号"
					align="center"
				/>

				<el-table-column
					class-name="sxTableColumn"
					prop="uname"
					label="用户名称"
					align="center"
					show-overflow-tooltip
				>
				</el-table-column>
				<el-table-column
					class-name="sxTableColumn"
					prop="unickname"
					label="用户名"
					align="center"
					show-overflow-tooltip
				/>

				<el-table-column
					class-name="sxTableColumn"
					fixed="right"
					label="操作"
					width="80"
					align="center"
				>
					<template #default="scope">
						<el-button
							link
							type="primary"
							size="small"
							@click="unLockItem(scope.row)"
							>解锁</el-button
						>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div></div>
	</div>
</template>
<script setup lang="ts">
import { querylockuserlist, unlockuserlist } from 'api/user-manage'
import { ref } from 'vue'

let userlist = ref([])

const init = () => {
	querylockuserlist({}).then((res) => {
		userlist.value = res.data
	})
}

const unLockItem = (item) => {
	unlockuserlist({ keys: [item.lockKey] }).then((res) => {
		console.log(res.data, 'unlock')
		if (res.code == 1) {
			init()
		}
	})
}

init()
</script>
<style lang="scss" scoped></style>
