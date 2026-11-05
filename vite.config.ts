import path from 'path'
import { loadEnv } from 'vite'
import createVitePlugins from './vite/plugins'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default async ({ mode, command }) => {
	const env = loadEnv(mode, process.cwd())

	// 全局 scss 资源
	return defineConfig({
		define: {
			// enable hydration mismatch details in production build
			__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
		},
		base: env.VITE_APP_BASE_PATH,
		server: {
			hmr: true,
			port: Number(env.VITE_APP_PORT),
			host: '0.0.0.0',
			// headers: {
			// 	'Access-Control-Allow-Origin': 'http://130.10.7.41:9527',
			// },
			// headers: {
			// 	'Access-Control-Allow-Origin': 'http://130.10.7.41:9527', // 主应用的域名
			// 	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
			// 	'Access-Control-Allow-Headers': 'Content-Type, Authorization',
			// },
			proxy: {
				'/api/v1/code': {
					// target: 'http://130.10.7.149:10031', //闫宇
					target: 'http://130.10.7.144:10030', 
					changeOrigin: true,
				},
				'/api/v1/cpbwry': {
					// target: 'http://130.10.7.149:10031', //闫宇
					target: 'http://130.10.7.144:10030', 
					changeOrigin: true,
				},

				'/api': {
					// target: 'http://130.10.7.80:10030',
					// target: 'http://130.10.7.44:10030',
					// target: 'http://130.10.7.32:10030',
					target: 'http://130.10.8.40:10030',
          // target: 'http://130.10.7.160:10030',
					// target: 'http://130.10.8.39',
					changeOrigin: true,
					// rewrite: (path) => path.replace(/^\/shz\/api/, '/api'),
				},

				'/chat': {
					// target: 'http://130.10.7.80:10030',
					// target: 'http://130.10.7.30:7861',
					// target: 'http://130.10.7.32:10030',
					target: 'http://130.10.8.40:10030',
					// target: 'http://130.10.8.39',
					changeOrigin: true,
				},

				'/cas': {
					target: 'http://130.10.8.40:3803',
					// target: 'http://130.10.7.44:8080',
					// target: 'http://130.10.7.103:3801',
					// target: 'http://130.10.7.32:8088',
					// target: 'http://130.10.8.39',
					changeOrigin: true,
					// rewrite: (path) => path.replace(/^\/shz\/cas/, '/cas'),
				},
			},
		},

		plugins: createVitePlugins(env, command === 'build'),
		resolve: {
			alias: {
				'@': path.resolve('./src'),
				coms: path.resolve('./src/components'),
				api: path.resolve('./src/api'),
				'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
			},
		},
		build: {
			outDir: env.VITE_APP_DIRNAME || 'demo_web',
			minify: 'terser',
			terserOptions: {
				compress: {
					drop_console: false,
					drop_debugger: true,
				},
			},
		},
		test: {
			browser: {
				enabled: true,
				name: 'chromium',
				provider: 'playwright',
			},
		},
	})
}
