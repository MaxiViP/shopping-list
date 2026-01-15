import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
	const users = ref(JSON.parse(localStorage.getItem('shopping_users')) || [])
	const currentUser = ref(null)
	const isAuthenticated = ref(false)
	const isInitialized = ref(false)

	// Инициализация из localStorage
	const init = () => {
		if (isInitialized.value) return

		try {
			// Загружаем пользователей из localStorage
			const savedUsers = localStorage.getItem('shopping_users')
			if (savedUsers) {
				users.value = JSON.parse(savedUsers)
			}

			// Проверяем, есть ли сохраненная сессия
			const savedSession = localStorage.getItem('shopping_session')
			if (savedSession) {
				const session = JSON.parse(savedSession)
				const user = users.value.find(u => u.username === session.username)
				if (user) {
					currentUser.value = user
					isAuthenticated.value = true
				}
			}
		} catch (error) {
			console.error('Ошибка загрузки данных пользователей:', error)
			// Очищаем поврежденные данные
			localStorage.removeItem('shopping_users')
			localStorage.removeItem('shopping_session')
		}

		isInitialized.value = true
	}

	function register(username, password) {
		init()

		if (!username || !password) {
			throw new Error('Заполните все поля')
		}

		if (users.value.find(u => u.username === username)) {
			throw new Error('Пользователь уже существует')
		}

		const newUser = {
			id: Date.now().toString(),
			username,
			password, // В реальном приложении пароль должен хешироваться!
			data: {
				wishlist: [],
				cart: [],
				favorites: [],
				history: [],
			},
		}

		users.value.push(newUser)
		saveUsers()

		return newUser
	}

	function login(username, password) {
		init()

		const user = users.value.find(u => u.username === username && u.password === password)

		if (!user) {
			throw new Error('Неверный логин или пароль')
		}

		currentUser.value = user
		isAuthenticated.value = true
		saveSession(username)

		return user
	}

	function logout() {
		currentUser.value = null
		isAuthenticated.value = false
		localStorage.removeItem('shopping_session')
	}

	function saveUserData(key, value) {
		if (currentUser.value) {
			currentUser.value.data[key] = value

			// Обновляем в общем списке пользователей
			const index = users.value.findIndex(u => u.id === currentUser.value.id)
			if (index !== -1) {
				users.value[index].data[key] = value
				saveUsers()
			}
		}
	}

	function getUserData(key) {
		return currentUser.value ? currentUser.value.data[key] : null
	}

	function saveUsers() {
		localStorage.setItem('shopping_users', JSON.stringify(users.value))
	}

	function saveSession(username) {
		const session = {
			username,
			lastLogin: new Date().toISOString(),
		}
		localStorage.setItem('shopping_session', JSON.stringify(session))
	}

	return {
		register,
		login,
		logout,
		saveUserData,
		getUserData,
		isAuthenticated,
		currentUser,
		init,
		isInitialized,
	}
})
