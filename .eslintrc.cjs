module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	globals: {
		defineProps: 'readonly',
		defineEmits: 'readonly',
		defineExpose: 'readonly',
		$cookies: true,
	},
	parser: 'vue-eslint-parser',
	extends: ['eslint:recommended', 'plugin:vue/vue3-essential', 'plugin:@typescript-eslint/recommended'],
	parserOptions: {
		ecmaVersion: 'latest',
		parser: '@typescript-eslint/parser',
		sourceType: 'module',
	},
	plugins: ['vue', '@typescript-eslint'],
	rules: {
		'vue/multi-word-component-names': 'off',
		'@typescript-eslint/no-empty-function': 'off', // 关闭空方法检查
		'@typescript-eslint/no-unused-vars': 'off', //关闭未使用的方法或变量提示   但是发布上线前要把它打开  处理一下
		'no-console': 'off', //关闭console报错历史  但是发布上线前要把它打开  处理一下
		'@typescript-eslint/no-explicit-any': 'off', // 关闭any类型的警告
		'vue/no-v-model-argument': 'off',
		'no-implicit-globals': 1, //禁止在全局范围内使用var 和命名的function 声明
		'no-self-assign': 2, //禁止自我赋值
		'no-self-compare': 2, //禁止自我比较
		'no-unused-vars': 'off',
		'no-undef': 'off',
		'no-var': 2, //要求使用const let 而不是 var
		'arrow-parens': 2, //要求箭头函数的参数使用圆括号
		'vue/valid-v-bind': 'off',
		'@typescript-eslint/ban-types': [
			'error',
			{
				extendDefaults: true,
				types: {
					'{}': false,
				},
			},
		],
	},
	settings: {
		'import/resolver': {
			alias: {
				extensions: ['.ts', '.js', '.jsx', '.tsx'],
			},
		},
	},
}
