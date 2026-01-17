<template>
	<div class="min-h-screen bg-gray-100 p-2">
		<HeaderComponent @logout="handleLogout" />

		<SearchAndFavorites
			:search-query="searchQuery"
			:filtered-products="filteredProducts"
			:favorites="favorites"
			:favorites-open="favoritesOpen"
			:get-product-name-by-id="getProductNameById"
			@search-input="handleSearchInput"
			@select-product="selectProduct"
			@toggle-favorite="toggleFavorite"
			@toggle-favorites-open="favoritesOpen = !favoritesOpen"
			@add-favorite-to-wishlist="addFavoriteToWishlist"
		/>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 max-w-6xl mx-auto">
			<WishlistComponent
				:wishlist="wishlist"
				:favorites="favorites"
				:add-product-accordion-open="addProductAccordionOpen"
				@toggle-add-product="addProductAccordionOpen = !addProductAccordionOpen"
				@export-wishlist="exportWishlistToTxt"
				@share-wishlist="generateShareLink"
				@add-quick-product="addQuickProduct"
				@move-to-cart="moveToCart"
				@toggle-favorite="toggleFavorite"
			/>

			<CartComponent :cart="cart" @move-from-cart-to-wishlist="moveFromCartToWishlist" />
		</div>

		<PurchaseForm
			:store="purchaseStore"
			:amount="purchaseAmount"
			@update:store="val => (purchaseStore = val)"
			@update:amount="val => (purchaseAmount = val)"
			@save-purchase="savePurchase"
		/>

		<CategoriesComponent
			:categories="categories"
			:selected-category="selectedCategory"
			:products-by-category="productsByCategory"
			:favorites="favorites"
			:is-in-wishlist="isInWishlist"
			@select-category="selectedCategory = $event"
			@clear-category="selectedCategory = null"
			@add-to-wishlist="addToWishlist"
			@toggle-favorite="toggleFavorite"
		/>

		<ShareModal
			:show="showShareModal"
			:share-link="shareLink"
			@close="showShareModal = false"
			:qr-code-url="qrCodeUrl"
			@copy-to-clipboard="copyToClipboard"
			@share-by-email="shareByEmail"
			@share-to-telegram="shareToTelegram"
		/>
	</div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/productStore'
import { useUserStore } from '../stores/userStore'
import QRCode from 'qrcode'

// Компоненты
import HeaderComponent from '@/components/HeaderComponent.vue'
import SearchAndFavorites from '@/components/SearchAndFavorites.vue'
import WishlistComponent from '@/components/WishlistComponent.vue'
import CartComponent from '@/components/CartComponent.vue'
import PurchaseForm from '@/components/PurchaseForm.vue'
import CategoriesComponent from '@/components/CategoriesComponent.vue'
import ShareModal from '@/components/ShareModal.vue'

const router = useRouter()
const userStore = useUserStore()
const productStore = useProductStore()

// Обработчики
const handleLogout = () => {
	userStore.logout()
	router.push('/login')
}

// Данные формы покупки
const purchaseStore = ref('')
const purchaseAmount = ref(0)

// Состояние UI
const favoritesOpen = ref(false)
const addProductAccordionOpen = ref(false)
const showShareModal = ref(false)
const shareLink = ref('')
const qrCodeUrl = ref('')

// Получение данных из store
const {
	searchQuery,
	filteredProducts,
	wishlist,
	cart,
	favorites,
	categories,
	allProducts,
	selectedCategory,
	productsByCategory,
} = storeToRefs(productStore)

const { addToWishlist, moveToCart, toggleFavorite, moveFromCartToWishlist } = productStore

// Вспомогательные функции
const getProductNameById = id => allProducts.value.find(p => p.id === id)?.name || 'Не найдено'

const wishlistItemIds = computed(() => {
	return wishlist.value.map(item => item.id)
})

const isInWishlist = productId => {
	return wishlistItemIds.value.includes(productId)
}

const addFavoriteToWishlist = productId => {
	const product = allProducts.value.find(p => p.id === productId)
	if (product) {
		addToWishlist(product)
	}
}

const selectProduct = product => {
	addToWishlist(product)
	searchQuery.value = ''
}

// Поиск
const isComposing = ref(false)
const searchTimeout = ref(null)

const handleSearchInput = value => {
	if (isComposing.value) return

	if (searchTimeout.value) {
		clearTimeout(searchTimeout.value)
	}

	const isMobile = window.innerWidth < 768
	searchTimeout.value = setTimeout(
		() => {
			searchQuery.value = value
		},
		isMobile ? 50 : 0
	)
}

// Быстрое добавление товара
const addQuickProduct = productName => {
	if (productName.trim()) {
		const customProduct = {
			id: -Date.now(),
			name: productName.trim(),
			category: 'Другое',
			isCustom: true,
		}
		productStore.addToWishlist(customProduct)
	}
}

// Сохранение покупки
const savePurchase = () => {
	if (!purchaseStore.value || purchaseAmount.value <= 0) {
		alert('Введите магазин и корректную сумму')
		return
	}

	productStore.completePurchase(purchaseStore.value, purchaseAmount.value)
	purchaseStore.value = ''
	purchaseAmount.value = 0
}

// Экспорт и шаринг
const exportWishlistToTxt = () => {
	if (wishlist.value.length === 0) {
		alert('Список желаний пуст')
		return
	}

	const content = generateExportContent()
	downloadFile(content, 'wishlist.txt', 'text/plain')
}

const generateExportContent = () => {
	let content = '=== Мой список покупок ===\n\n'
	content += 'Список желаний:\n'

	wishlist.value.forEach((item, index) => {
		content += `${index + 1}. ${item.name}`
		if (item.isCustom) {
			content += ' (пользовательский товар)'
		}
		content += '\n'
	})

	content += '\n---\n'
	content += `Всего товаров: ${wishlist.value.length}\n`
	content += `Дата экспорта: ${new Date().toLocaleDateString()}\n`

	return content
}

const downloadFile = (content, filename, mimeType) => {
	const blob = new Blob([content], { type: mimeType })
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = filename
	document.body.appendChild(a)
	a.click()
	document.body.removeChild(a)
	URL.revokeObjectURL(url)
}

const generateShareLink = async () => {
	if (wishlist.value.length === 0) {
		alert('Список желаний пуст')
		return
	}

	// Фильтруем только стандартные товары (ID >= 0)
	const standardItems = wishlist.value.filter(item => item.id >= 0)
	
	if (standardItems.length === 0) {
		alert('В вашем списке только пользовательские товары, которые нельзя поделиться.')
		return
	}

	const data = {
		wishlist: standardItems.map(item => item.id),
		v: 1,
		t: Date.now(),
	}

	console.log('Экспортируем товары:', standardItems.map(item => ({id: item.id, name: item.name})))

	const jsonString = JSON.stringify(data)
	const encodedData = btoa(encodeURIComponent(jsonString))

	shareLink.value = `${window.location.origin}/import/${encodedData}`

	// Предупреждение о длинной ссылке
	if (shareLink.value.length > 2000) {
		alert('Ссылка получилась длинной. Возможно, стоит экспортировать в TXT.')
	}

	try {
		qrCodeUrl.value = await QRCode.toDataURL(shareLink.value, {
			width: 240,
			margin: 2,
			color: { dark: '#000000', light: '#ffffff' },
		})
	} catch (err) {
		console.error('QR-код не сгенерировался:', err)
	}

	showShareModal.value = true
}

const copyToClipboard = async () => {
	try {
		await navigator.clipboard.writeText(shareLink.value)
		alert('Ссылка скопирована в буфер обмена!')
	} catch (err) {
		console.error('Ошибка копирования:', err)
		const textArea = document.createElement('textarea')
		textArea.value = shareLink.value
		document.body.appendChild(textArea)
		textArea.select()
		document.execCommand('copy')
		document.body.removeChild(textArea)
		alert('Ссылка скопирована!')
	}
}

const shareByEmail = () => {
	const subject = 'Мой список покупок'
	const body = `Привет! Посмотри мой список покупок:\n\n${shareLink.value}\n\nВсего товаров: ${wishlist.value.length}`
	window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

const shareToTelegram = () => {
	const text = `Мой список покупок (${wishlist.value.length} товаров): ${shareLink.value}`
	window.open(
		`https://t.me/share/url?url=${encodeURIComponent(shareLink.value)}&text=${encodeURIComponent(text)}`,
		'_blank'
	)
}

// Очистка
onUnmounted(() => {
	if (searchTimeout.value) {
		clearTimeout(searchTimeout.value)
	}
})
</script>