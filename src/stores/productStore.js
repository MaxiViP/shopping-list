import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './userStore.js'
import { allProducts as staticProducts } from '@/data/products' 
 
export const useProductStore = defineStore('products', () => {
	const userStore = useUserStore()
	const searchQuery = ref('')
	const selectedCategory = ref(null)

	// Делаем allProducts реактивным
	const allProducts = ref(staticProducts)

	// Данные формы для покупки
	const purchaseStore = ref('')
	const purchaseAmount = ref(0)

	// Получаем данные из userStore с реактивностью
	const wishlist = computed({
		get() {
			return userStore.getUserData('wishlist') || []
		},
		set(value) {
			userStore.saveUserData('wishlist', value)
		},
	})

	const cart = computed({
		get() {
			return userStore.getUserData('cart') || []
		},
		set(value) {
			userStore.saveUserData('cart', value)
		},
	})

	const favorites = computed({
		get() {
			return userStore.getUserData('favorites') || []
		},
		set(value) {
			userStore.saveUserData('favorites', value)
		},
	})

	const history = computed({
		get() {
			return userStore.getUserData('history') || []
		},
		set(value) {
			userStore.saveUserData('history', value)
		},
	})

	const categories = computed(() => {
		return [...new Set(allProducts.value.map(p => p.category))]
	})

	const filteredProducts = computed(() => {
		const query = searchQuery.value.trim().toLowerCase()
		if (!query) return []
		return allProducts.value.filter(p => p.name.toLowerCase().startsWith(query)).slice(0, 50)
	})

	const productsByCategory = computed(() => {
		if (!selectedCategory.value) return []
		return allProducts.value.filter(p => p.category === selectedCategory.value)
	})

	// =================== Методы ===================
	function toggleFavorite(productId) {
		const currentFavorites = favorites.value
		const index = currentFavorites.indexOf(productId)
		if (index === -1) {
			favorites.value = [...currentFavorites, productId]
		} else {
			favorites.value = currentFavorites.filter(id => id !== productId)
		}
	}

	function addToWishlist(product) {
		if (!wishlist.value.some(p => p.id === product.id)) {
			wishlist.value = [...wishlist.value, product]
		}
	}

	function moveToCart(productId) {
		const productIndex = wishlist.value.findIndex(p => p.id === productId)
		if (productIndex !== -1) {
			const product = wishlist.value[productIndex]
			wishlist.value = wishlist.value.filter(p => p.id !== productId)
			cart.value = [...cart.value, product]
		}
	}

	function moveFromCartToWishlist(productId) {
		const productIndex = cart.value.findIndex(p => p.id === productId)
		if (productIndex !== -1) {
			const product = cart.value[productIndex]
			cart.value = cart.value.filter(p => p.id !== productId)
			wishlist.value = [...wishlist.value, product]
		}
	}

	// Сохраняем покупку с магазином и суммой
	function completePurchase(store, amount) {
		if (!store || amount <= 0) return

		const purchase = {
			date: new Date().toISOString(),
			store,
			amount: parseFloat(amount),
			items: [...cart.value], // все купленные товары
		}

		history.value = [...history.value, purchase]

		// Очистка корзины и формы
		wishlist.value = []
		cart.value = []
		purchaseStore.value = ''
		purchaseAmount.value = 0
	}

	function getReport() {
		const totalSpent = history.value.reduce((sum, h) => sum + h.amount, 0)
		const byStore = history.value.reduce((acc, h) => {
			acc[h.store] = (acc[h.store] || 0) + h.amount
			return acc
		}, {})
		return { totalSpent, byStore, history: history.value }
	}

	return {
		allProducts,
		categories,
		filteredProducts,
		productsByCategory,
		searchQuery,
		selectedCategory,
		wishlist,
		cart,
		favorites,
		history,

		// форма покупки
		purchaseStore,
		purchaseAmount,
		completePurchase,

		toggleFavorite,
		addToWishlist,
		moveToCart,
		moveFromCartToWishlist,
		getReport,
	}
})
