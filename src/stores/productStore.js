import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './userStore.js'

// Все продукты (статический список)
const allProducts = ref([
	// 🥛 Молочные продукты
	{ id: 1, name: 'Молоко', category: 'Молочные продукты' },
	{ id: 2, name: 'Кефир', category: 'Молочные продукты' },
	{ id: 3, name: 'Ряженка', category: 'Молочные продукты' },
	{ id: 4, name: 'Сметана', category: 'Молочные продукты' },
	{ id: 5, name: 'Йогурт', category: 'Молочные продукты' },
	{ id: 6, name: 'Творог', category: 'Молочные продукты' },
	{ id: 7, name: 'Сыр', category: 'Молочные продукты' },
	{ id: 8, name: 'Масло сливочное', category: 'Молочные продукты' },
	{ id: 9, name: 'Сливки', category: 'Молочные продукты' },
	{ id: 10, name: 'Сгущённое молоко', category: 'Молочные продукты' },

	// 🥚 Яйца
	{ id: 11, name: 'Яйца', category: 'Яйца' },

	// 🍞 Хлеб и выпечка
	{ id: 12, name: 'Хлеб', category: 'Хлеб и выпечка' },
	{ id: 13, name: 'Батон', category: 'Хлеб и выпечка' },
	{ id: 14, name: 'Булочки', category: 'Хлеб и выпечка' },
	{ id: 15, name: 'Лаваш', category: 'Хлеб и выпечка' },
	{ id: 16, name: 'Лепёшки', category: 'Хлеб и выпечка' },

	// 🥦 Овощи и фрукты
	{ id: 17, name: 'Картофель', category: 'Овощи и фрукты' },
	{ id: 18, name: 'Морковь', category: 'Овощи и фрукты' },
	{ id: 19, name: 'Лук', category: 'Овощи и фрукты' },
	{ id: 20, name: 'Капуста', category: 'Овощи и фрукты' },
	{ id: 21, name: 'Свёкла', category: 'Овощи и фрукты' },
	{ id: 22, name: 'Помидоры', category: 'Овощи и фрукты' },
	{ id: 23, name: 'Огурцы', category: 'Овощи и фрукты' },
	{ id: 24, name: 'Перец', category: 'Овощи и фрукты' },
	{ id: 25, name: 'Яблоки', category: 'Овощи и фрукты' },
	{ id: 26, name: 'Груши', category: 'Овощи и фрукты' },
	{ id: 27, name: 'Бананы', category: 'Овощи и фрукты' },
	{ id: 28, name: 'Апельсины', category: 'Овощи и фрукты' },
	{ id: 29, name: 'Мандарины', category: 'Овощи и фрукты' },
	{ id: 30, name: 'Виноград', category: 'Овощи и фрукты' },

	// 🥩 Мясо и птица
	{ id: 31, name: 'Говядина', category: 'Мясо и птица' },
	{ id: 32, name: 'Свинина', category: 'Мясо и птица' },
	{ id: 33, name: 'Курица', category: 'Мясо и птица' },
	{ id: 34, name: 'Индейка', category: 'Мясо и птица' },
	{ id: 35, name: 'Фарш', category: 'Мясо и птица' },
	{ id: 36, name: 'Колбаса', category: 'Мясо и птица' },
	{ id: 37, name: 'Сосиски', category: 'Мясо и птица' },
	{ id: 38, name: 'Ветчина', category: 'Мясо и птица' },

	// 🐟 Рыба и морепродукты
	{ id: 39, name: 'Рыба', category: 'Рыба и морепродукты' },
	{ id: 40, name: 'Филе рыбы', category: 'Рыба и морепродукты' },
	{ id: 41, name: 'Сельдь', category: 'Рыба и морепродукты' },
	{ id: 42, name: 'Лосось', category: 'Рыба и морепродукты' },
	{ id: 43, name: 'Креветки', category: 'Рыба и морепродукты' },
	{ id: 44, name: 'Мидии', category: 'Рыба и морепродукты' },

	// 🍚 Бакалея
	{ id: 45, name: 'Рис', category: 'Бакалея' },
	{ id: 46, name: 'Гречка', category: 'Бакалея' },
	{ id: 47, name: 'Макароны', category: 'Бакалея' },
	{ id: 48, name: 'Мука', category: 'Бакалея' },
	{ id: 49, name: 'Сахар', category: 'Бакалея' },
	{ id: 50, name: 'Соль', category: 'Бакалея' },
	{ id: 51, name: 'Растительное масло', category: 'Бакалея' },
	{ id: 52, name: 'Чай', category: 'Бакалея' },
	{ id: 53, name: 'Кофе', category: 'Бакалея' },
	{ id: 54, name: 'Специи', category: 'Бакалея' },

	// 🍫 Сладости
	{ id: 55, name: 'Шоколад', category: 'Сладости' },
	{ id: 56, name: 'Конфеты', category: 'Сладости' },
	{ id: 57, name: 'Печенье', category: 'Сладости' },
	{ id: 58, name: 'Вафли', category: 'Сладости' },
	{ id: 59, name: 'Пряники', category: 'Сладости' },
	{ id: 60, name: 'Мёд', category: 'Сладости' },
	{ id: 61, name: 'Варенье', category: 'Сладости' },

	// 🧴 Бытовая химия
	{ id: 62, name: 'Стиральный порошок', category: 'Бытовая химия' },
	{ id: 63, name: 'Гель для стирки', category: 'Бытовая химия' },
	{ id: 64, name: 'Средство для мытья посуды', category: 'Бытовая химия' },
	{ id: 65, name: 'Чистящее средство', category: 'Бытовая химия' },
	{ id: 66, name: 'Средство для ванной', category: 'Бытовая химия' },
	{ id: 67, name: 'Освежитель воздуха', category: 'Бытовая химия' },

	// 🪥 Косметика и гигиена
	{ id: 68, name: 'Шампунь', category: 'Косметика и гигиена' },
	{ id: 69, name: 'Гель для душа', category: 'Косметика и гигиена' },
	{ id: 70, name: 'Мыло', category: 'Косметика и гигиена' },
	{ id: 71, name: 'Зубная паста', category: 'Косметика и гигиена' },
	{ id: 72, name: 'Зубная щётка', category: 'Косметика и гигиена' },
	{ id: 73, name: 'Бритва', category: 'Косметика и гигиена' },
	{ id: 74, name: 'Дезодорант', category: 'Косметика и гигиена' },

	// 🧻 Товары для дома
	{ id: 75, name: 'Туалетная бумага', category: 'Товары для дома' },
	{ id: 76, name: 'Салфетки', category: 'Товары для дома' },
	{ id: 77, name: 'Бумажные полотенца', category: 'Товары для дома' },
	{ id: 78, name: 'Губки', category: 'Товары для дома' },
	{ id: 79, name: 'Тряпки', category: 'Товары для дома' },
	{ id: 80, name: 'Мешки для мусора', category: 'Товары для дома' },

	// 👜 Галантерея
	{ id: 81, name: 'Носки', category: 'Галантерея' },
	{ id: 82, name: 'Колготки', category: 'Галантерея' },
	{ id: 83, name: 'Перчатки', category: 'Галантерея' },
	{ id: 84, name: 'Ремень', category: 'Галантерея' },
	{ id: 85, name: 'Зонт', category: 'Галантерея' },
	{ id: 86, name: 'Сумка', category: 'Галантерея' },

	// 🐶 Товары для животных
	{ id: 87, name: 'Корм для кошек', category: 'Товары для животных' },
	{ id: 88, name: 'Корм для собак', category: 'Товары для животных' },
	{ id: 89, name: 'Наполнитель для лотка', category: 'Товары для животных' },
	{ id: 90, name: 'Миски', category: 'Товары для животных' },
	{ id: 91, name: 'Игрушки для животных', category: 'Товары для животных' },

	// ✏️ Канцелярия
	{ id: 92, name: 'Ручка', category: 'Канцелярия' },
	{ id: 93, name: 'Карандаш', category: 'Канцелярия' },
	{ id: 94, name: 'Тетрадь', category: 'Канцелярия' },
	{ id: 95, name: 'Блокнот', category: 'Канцелярия' },
	{ id: 96, name: 'Маркер', category: 'Канцелярия' },
	{ id: 97, name: 'Бумага', category: 'Канцелярия' },
])

export const useProductStore = defineStore('products', () => {
	const userStore = useUserStore()
	const searchQuery = ref('')
	const selectedCategory = ref(null)

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
