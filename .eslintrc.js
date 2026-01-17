module.exports = {
	root: true,
	env: {
		node: true,
		browser: true,
		es2021: true,
	},
	parser: 'vue-eslint-parser',
	parserOptions: {
		parser: '@babel/eslint-parser',
		ecmaVersion: 2021,
		sourceType: 'module',
		requireConfigFile: false,
	},
	globals: {
		defineProps: 'readonly',
		defineEmits: 'readonly',
		defineExpose: 'readonly',
		withDefaults: 'readonly',
	},
	extends: ['eslint:recommended', 'plugin:vue/vue3-essential'],
	rules: {
		'no-unused-vars': 'warn',
		'vue/multi-word-component-names': 'off',
	},
}
