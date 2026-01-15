<template>
	<div class="min-h-screen flex items-center justify-center bg-gray-100">
		<div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
			<h1 class="text-2xl font-bold mb-6 text-center">
				{{ isRegisterMode ? 'Регистрация' : 'Вход' }}
			</h1>
			
			<input 
				v-model="username" 
				placeholder="Логин" 
				class="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
				@keyup.enter="handleSubmit"
			/>
			<input 
				v-model="password" 
				type="password" 
				placeholder="Пароль" 
				class="w-full p-3 mb-6 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
				@keyup.enter="handleSubmit"
			/>
			
			<button 
				@click="handleSubmit" 
				class="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors font-medium mb-4"
			>
				{{ isRegisterMode ? 'Зарегистрироваться' : 'Войти' }}
			</button>
			
			<div class="text-center">
				<button 
					@click="toggleMode" 
					class="text-blue-500 hover:text-blue-700 text-sm"
				>
					{{ isRegisterMode ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться' }}
				</button>
			</div>
			
			<p v-if="error" class="text-red-500 mt-4 text-center bg-red-50 p-3 rounded">{{ error }}</p>
			
			<div v-if="isLoading" class="mt-4 text-center">
				<div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore.js'

const userStore = useUserStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const error = ref('')
const isRegisterMode = ref(false)
const isLoading = ref(false)

onMounted(() => {
	// Инициализируем хранилище пользователей
	userStore.init()
	
	// Если пользователь уже авторизован, перенаправляем
	if (userStore.isAuthenticated) {
		router.push('/products')
	}
})

const handleSubmit = async () => {
	if (!username.value || !password.value) {
		error.value = 'Заполните все поля'
		return
	}

	isLoading.value = true
	error.value = ''

	try {
		if (isRegisterMode.value) {
			userStore.register(username.value, password.value)
			// После регистрации автоматически входим
			userStore.login(username.value, password.value)
		} else {
			userStore.login(username.value, password.value)
		}
		
		// Перенаправляем на главную страницу
		router.push('/products')
		
	} catch (e) {
		error.value = e.message
	} finally {
		isLoading.value = false
	}
}

const toggleMode = () => {
	isRegisterMode.value = !isRegisterMode.value
	error.value = ''
}
</script>