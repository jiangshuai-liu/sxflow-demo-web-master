import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
import VueDevTools from 'vite-plugin-vue-devtools'

import compression from 'vite-plugin-compression'
import createDevtools from './devtools'

export default function createVitePlugins(viteEnv, isBuild = false) {
	const vitePlugins: (PluginOption | PluginOption[])[] = [
		vue(),
		createSvgIconsPlugin({
			iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
			symbolId: 'icon-[dir]-[name]',
		}),
		createDevtools(viteEnv),
		// compression({
		// 	verbose: true, // 是否在控制台输出压缩结果
		// 	disable: false, // 是否禁用压缩
		// 	threshold: 10240, // 压缩文件的大小阈值（以字节为单位）
		// 	algorithm: 'gzip', // 压缩算法
		// 	ext: '.gz', // 压缩文件的后缀名
		// 	deleteOriginFile: true, // 是否删除原文件
		// 	// 包括/排除正则
		// 	// include: /\.(js|css|json|html|svg)$/,
		// 	// exclude: /node_modules/,
		// }),
	]
	return vitePlugins
}
