import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './userStore.js'
import { allProducts as staticProductsImport } from '@/data/products'

export const useProductStore = defineStore('products', () => {
	const userStore = useUserStore()
	const searchQuery = ref('')
	const selectedCategory = ref(null)

	// Состояние продуктов
	const allProducts = ref([])
	const isLoadingProducts = ref(false)
	const productsError = ref(null)
	const productsLoaded = ref(false)

	/**
	 * Загружает продукты (сейчас статически, в будущем можно легко заменить на API)
	 */
	async function loadProducts(force = false) {
		// Уже загружены и не требуется принудительная перезагрузка
		if (allProducts.value.length > 0 && productsLoaded.value && !force) {
			return
		}

		if (isLoadingProducts.value) {
			return // уже идёт загрузка — не дублируем
		}

		isLoadingProducts.value = true
		productsError.value = null
		productsLoaded.value = false

		try {
			const productsData = staticProductsImport || []

			if (!Array.isArray(productsData)) {
				throw new Error('Данные продуктов не являются массивом')
			}

			allProducts.value = [...productsData]
			productsLoaded.value = true

			console.log(`Загружено продуктов: ${allProducts.value.length}`)
		} catch (e) {
			console.error('Ошибка при загрузке продуктов:', e)
			productsError.value = 'Не удалось загрузить каталог товаров'
			allProducts.value = []
			productsLoaded.value = false
		} finally {
			isLoadingProducts.value = false
		}
	}

	// Данные формы покупки
	const purchaseStore = ref('')
	const purchaseAmount = ref(0)

	// Реактивные списки из userStore
	const wishlist = computed({
		get: () => userStore.getUserData('wishlist') || [],
		set: value => userStore.saveUserData('wishlist', value),
	})

	const cart = computed({
		get: () => userStore.getUserData('cart') || [],
		set: value => userStore.saveUserData('cart', value),
	})

	const favorites = computed({
		get: () => userStore.getUserData('favorites') || [],
		set: value => userStore.saveUserData('favorites', value),
	})

	const history = computed({
		get: () => userStore.getUserData('history') || [],
		set: value => userStore.saveUserData('history', value),
	})

	// Вычисляемые значения, зависящие от продуктов
	const categories = computed(() => {
		return [...new Set(allProducts.value.map(p => p.category))]
	})

	const filteredProducts = computed(() => {
		const query = searchQuery.value.trim().toLowerCase()
		if (!query) return []
		return allProducts.value.filter(p => p.name?.toLowerCase().startsWith(query)).slice(0, 50)
	})

	const productsByCategory = computed(() => {
		if (!selectedCategory.value) return []
		return allProducts.value.filter(p => p.category === selectedCategory.value)
	})

	// Методы управления списками
	function toggleFavorite(productId) {
		const current = favorites.value
		const index = current.indexOf(productId)
		if (index === -1) {
			favorites.value = [...current, productId]
		} else {
			favorites.value = current.filter(id => id !== productId)
		}
	}

	function addToWishlist(product) {
		if (!product?.id) return
		if (!wishlist.value.some(p => p.id === product.id)) {
			wishlist.value = [...wishlist.value, { ...product }]
		}
	}

	function moveToCart(productId) {
		const index = wishlist.value.findIndex(p => p.id === productId)
		if (index !== -1) {
			const product = wishlist.value[index]
			wishlist.value = wishlist.value.filter((_, i) => i !== index)
			cart.value = [...cart.value, { ...product }]
		}
	}

	function moveFromCartToWishlist(productId) {
		const index = cart.value.findIndex(p => p.id === productId)
		if (index !== -1) {
			const product = cart.value[index]
			cart.value = cart.value.filter((_, i) => i !== index)
			wishlist.value = [...wishlist.value, { ...product }]
		}
	}

	function completePurchase(store, amount) {
		if (!store || amount <= 0) return

		const purchase = {
			date: new Date().toISOString(),
			store,
			amount: parseFloat(amount),
			items: [...cart.value],
		}

		history.value = [...history.value, purchase]

		// Очистка
		wishlist.value = []
		cart.value = []
		purchaseStore.value = ''
		purchaseAmount.value = 0
	}

	function getReport() {
		const totalSpent = history.value.reduce((sum, h) => sum + (h.amount || 0), 0)
		const byStore = history.value.reduce((acc, h) => {
			acc[h.store] = (acc[h.store] || 0) + (h.amount || 0)
			return acc
		}, {})
		return { totalSpent, byStore, history: history.value }
	}

	return {
		// Продукты и их состояние
		allProducts,
		isLoadingProducts,
		productsError,
		productsLoaded,
		loadProducts,

		categories,
		filteredProducts,
		productsByCategory,
		searchQuery,
		selectedCategory,

		wishlist,
		cart,
		favorites,
		history,

		purchaseStore,
		purchaseAmount,

		toggleFavorite,
		addToWishlist,
		moveToCart,
		moveFromCartToWishlist,
		completePurchase,
		getReport,
	}
})
