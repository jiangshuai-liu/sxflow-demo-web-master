<template>
	<div v-if="!item.meta || !item.meta.hidden">
		<!-- <template
      v-if="
        (hasOneShowingChild(item.children, item) &&
          (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
          (!item.meta || !item.meta.alwaysShow)) ||
        childAllHidden(onlyOneChild.children) ||
        item.children?.length == 0
      "
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.url)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.url)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <template #title>
            <div class="sliderTitle">
              <svg-icon
                style="opacity: 0"
                v-if="onlyOneChild.meta && onlyOneChild.meta.icon"
                :icon-class="onlyOneChild.meta.icon"
              />
              {{ item.label }}
            </div>
            {{ onlyOneChild }}
          </template>
        </el-menu-item>
      </app-link>
    </template> -->
		<template v-if="item.children?.length == 0">
			<app-link :to="resolvePath(item.url)">
				<el-menu-item
					:index="resolvePath(item.url)"
					:class="{ 'submenu-title-noDropdown': !isNest }"
				>
					<!-- {{ item.url }} -->
					<!-- {{ isNest }} -->
					<svg-icon
						:icon-class="item.icon"
						v-if="!isNest"
					/>
					<template #title>
						<div class="sliderTitle">
							<svg-icon
								:icon-class="item.icon"
								v-if="isNest"
							/>
							<!-- style="opacity: 0" -->
							{{ item.label }}
						</div>
					</template>
				</el-menu-item>
			</app-link>
		</template>
		<el-sub-menu
			v-else
			:index="resolvePath(item.url)"
			popper-append-to-body
			:class="{ 'submenu-title-noDropdown': isNest }"
		>
			<!-- popper-append-to-body -->
			<!-- <svg-icon
				:icon-class="item.icon"
				v-if="!isNest"
			/> -->
			<template #title>
				<!-- <div class="sliderTitle"> -->
				<!-- {{ item.url }} -->
				<svg-icon
					v-if="item.icon"
					:icon-class="item.icon"
				></svg-icon>
				<span v-if="item.label">
					{{ item.label }}
				</span>

				<!-- </div> -->
			</template>

			<sidebar-item
				v-for="child in item.children"
				:key="child.url"
				:item="child"
				:is-nest="true"
				:base-path="resolvePath(child.url)"
				class="nest-menu"
			/>
		</el-sub-menu>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import path from 'path-browserify'
import { isExternal } from '@/utils/validate'
import AppLink from './Link.vue'

import { generateTitle } from '@/utils/i18n'
import SvgIcon from '@/components/SvgIcon/index.vue'

const props = defineProps({
	item: {
		type: Object,
		required: true,
	},
	isNest: {
		type: Boolean,
		required: false,
	},
	basePath: {
		type: String,
		required: true,
	},
})

const onlyOneChild = ref()

const childAllHidden = (children = [] as any) => {
	const backRes = children.every((item) => item.meta.hidden == true)
	return !backRes
}

function hasOneShowingChild(children = [] as any, parent: any) {
	if (!children) {
		children = []
	}
	const showingChildren = children.filter((item: any) => {
		if (item.meta && item.meta.hidden) {
			return false
		} else {
			// Temp set(will be used if only has one showing child)
			onlyOneChild.value = item
			return true
		}
	})
	// console.log(showingChildren, "showingChildren");

	// When there is only one child router, the child router is displayed by default
	if (showingChildren.length === 1) {
		return true
	}

	// Show parent if there are no child router to display
	if (showingChildren.length === 0) {
		onlyOneChild.value = { ...parent, url: '', noShowingChildren: true }
		// console.log(onlyOneChild.value, showingChildren);

		return true
	}

	return false
}

function resolvePath(routePath: string) {
	// console.log(props.item, path.resolve(props.basePath, routePath), 'path.resolve(props.basePath, routePath)')
	if (isExternal(routePath)) {
		return routePath
	}
	if (isExternal(props.basePath)) {
		return props.basePath
	}

	// console.log(props.basePath, routePath, 'props.basePath, routePath')

	return path.resolve(props.basePath, routePath)
}
</script>

<style lang="scss" scoped></style>
