import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/LoginView.vue'
import ProductList from '../views/ProductsView.vue'
import History from '../views/HistoryView.vue'
import { useUserStore } from '../stores/userStore.js'

const routes = [
	{ path: '/', redirect: '/login' },
	{ path: '/login', name: 'login', component: Login },
	{ path: '/products', name: 'products', component: ProductList, meta: { requiresAuth: true } },
	{ path: '/history', name: 'history', component: History, meta: { requiresAuth: true } },
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

router.beforeEach(async (to, from, next) => {
	const userStore = useUserStore()

	// Инициализируем хранилище пользователей
	userStore.init()

	// Если маршрут требует авторизации и пользователь не авторизован
	if (to.meta.requiresAuth && !userStore.isAuthenticated) {
		return next({ name: 'login' })
	}

	// Если пользователь авторизован и пытается зайти на логин
	if (to.name === 'login' && userStore.isAuthenticated) {
		return next({ name: 'products' })
	}

	// Во всех остальных случаях разрешаем переход
	return next()
})

export default router
