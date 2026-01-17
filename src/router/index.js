// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/LoginView.vue'
import ProductList from '../views/ProductsView.vue'
import History from '../views/HistoryView.vue'
import ImportWishlist from '../views/ImportWishlist.vue' 
import { useUserStore } from '../stores/userStore.js'

const routes = [
	{ path: '/', redirect: '/login' },
	{ path: '/login', name: 'login', component: Login },
	{ path: '/products', name: 'products', component: ProductList, meta: { requiresAuth: true } },
	{ path: '/history', name: 'history', component: History, meta: { requiresAuth: true } },
	{ path: '/import/:data?', name: 'import', component: ImportWishlist, meta: { requiresAuth: true } }, 
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

router.beforeEach(async (to, from, next) => {
	const userStore = useUserStore()
	userStore.init()

	if (to.meta.requiresAuth && !userStore.isAuthenticated) {
		return next({ name: 'login' })
	}

	if (to.name === 'login' && userStore.isAuthenticated) {
		return next({ name: 'products' })
	}

	return next()
})

export default router
