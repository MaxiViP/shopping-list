<template>
	<div class="min-h-screen bg-gray-100 p-4">
		<div class="max-w-2xl mx-auto bg-white rounded-xl shadow p-6">
			<h1 class="text-2xl font-bold mb-6">Импорт списка покупок</h1>

			<!-- Состояние загрузки -->
			<div v-if="importing" class="text-center py-8">
				<font-awesome-icon icon="spinner" class="text-blue-500 text-3xl animate-spin mb-4" />
				<p>{{ loadingMessage }}</p>
				<p v-if="importedCount > 0" class="text-sm text-green-600 mt-2">
					Успешно импортировано {{ importedCount }} товаров. Перенаправляем на главную...
				</p>
			</div>

			<!-- Ошибка -->
			<div v-else-if="importError" class="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-lg mb-6">
				<p class="font-bold mb-1">Не удалось импортировать список</p>
				<p class="text-sm mb-3">{{ importError }}</p>
				<div class="flex gap-3">
					<button
						@click="retryImport"
						class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
					>
						Попробовать снова
					</button>
					<button
						@click="goToWishlist"
						class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
					>
						На главную
					</button>
				</div>
			</div>

			<!-- Форма ввода (основное состояние) -->
			<div v-else>
				<p class="text-gray-600 mb-4">Вставьте ссылку на список покупок, которую вам отправили:</p>

				<div class="flex flex-col sm:flex-row gap-3 mb-5">
					<input
						v-model="importUrl"
						placeholder="https://ваш-сайт/import/..."
						class="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
						@keyup.enter="handleUrlImport"
					/>
					<button
						@click="handleUrlImport"
						class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
						:disabled="importing"
					>
						Импортировать
					</button>
				</div>

				<div class="text-sm text-gray-500 bg-gray-50 p-3 rounded border border-gray-200">
					<p class="mb-1 font-medium">Внимание:</p>
					<ul class="list-disc pl-5 space-y-1">
						<li>После импорта вы будете автоматически перенаправлены на главную страницу</li>
						<li>Пользовательские товары не будут импортированы</li>
						<li>Импортируются только стандартные товары из каталога</li>
						<li>Товары, которые уже есть в вашем списке, будут пропущены</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductStore } from '@/stores/productStore'
import { useUserStore } from '@/stores/userStore'
import { useRouter, useRoute } from 'vue-router'

const productStore = useProductStore()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const { allProducts, wishlist } = storeToRefs(productStore)

const importUrl = ref('')
const importing = ref(false)
const importError = ref('')
const importedCount = ref(0)
const loadingMessage = ref('Загружаем каталог товаров...')

// Вспомогательная функция для текста
const getCountText = (count) => {
	if (count === 1) return 'товар'
	if (count >= 2 && count <= 4) return 'товара'
	return 'товаров'
}

// Автоматический импорт при прямом переходе по ссылке
onMounted(async () => {
	// Проверим авторизацию
	if (!userStore.currentUser) {
		console.log('Пользователь не авторизован, перенаправляем на логин')
		router.push('/login')
		return
	}

	const encodedData = route.query.list || route.params.data || route.params[0]
	if (encodedData) {
		importUrl.value = window.location.href

		importing.value = true
		loadingMessage.value = 'Импортируем список покупок...'

		try {
			// ЯВНО загружаем продукты перед импортом
			if (!productStore.productsLoaded || allProducts.value.length === 0) {
				loadingMessage.value = 'Загружаем каталог товаров...'
				await productStore.loadProducts()
			}

			await handleEncodedData(encodedData)
			
			// Если импорт успешен - сразу редирект на главную
			if (importedCount.value > 0) {
				loadingMessage.value = `Успешно импортировано ${importedCount.value} ${getCountText(importedCount.value)}. Перенаправляем...`
				
				// Ждем 1.5 секунды чтобы пользователь увидел сообщение
				setTimeout(() => {
					router.push('/')
				}, 1500)
			} else {
				// Если ничего не импортировали, показываем ошибку
				importing.value = false
			}
			
		} catch (error) {
			importError.value = 'Ошибка импорта: ' + error.message
			importing.value = false
		}
	}
})

const handleUrlImport = async () => {
	if (!importUrl.value.trim()) {
		importError.value = 'Пожалуйста, вставьте ссылку'
		return
	}

	importing.value = true
	loadingMessage.value = 'Загружаем каталог товаров...'
	importError.value = ''

	try {
		// СНАЧАЛА загружаем продукты
		if (!productStore.productsLoaded || allProducts.value.length === 0) {
			await productStore.loadProducts()
		}

		const url = new URL(importUrl.value.trim())
		const listParam = url.searchParams.get('list')
		const pathSegments = url.pathname.split('/').filter(Boolean)
		const lastSegment = pathSegments[pathSegments.length - 1]

		const encodedData = listParam || lastSegment

		if (!encodedData) {
			importError.value = 'В ссылке не найдены данные для импорта'
			importing.value = false
			return
		}

		loadingMessage.value = 'Импортируем ваш список...'
		await handleEncodedData(encodedData)
		
		// Если импорт успешен - сразу редирект на главную
		if (importedCount.value > 0) {
			loadingMessage.value = `Успешно импортировано ${importedCount.value} ${getCountText(importedCount.value)}. Перенаправляем...`
			
			// Ждем 1.5 секунды чтобы пользователь увидел сообщение
			setTimeout(() => {
				router.push('/')
			}, 1500)
		} else {
			// Если ничего не импортировали, показываем ошибку
			importing.value = false
		}
	} catch (err) {
		importError.value = err.message || 'Некорректный формат ссылки'
		importing.value = false
	}
}

const handleEncodedData = async encodedData => {
	try {
		const products = allProducts.value

		// Проверяем, загружены ли продукты
		if (!products || products.length === 0) {
			throw new Error('Каталог товаров пуст. Пожалуйста, обновите страницу и попробуйте снова.')
		}

		console.log('=== ИМПОРТ СПИСКА ===')
		console.log('Полученные закодированные данные:', encodedData)

		// Декодируем данные
		let jsonString
		try {
			jsonString = decodeURIComponent(atob(encodedData))
		} catch (e) {
			throw new Error('Повреждённые или неверные данные в ссылке')
		}

		let data
		try {
			data = JSON.parse(jsonString)
		} catch (e) {
			throw new Error('Неверный формат данных')
		}

		const itemIds = Array.isArray(data.wishlist) ? data.wishlist : []

		console.log('Найденные ID товаров:', itemIds)
		console.log('Количество ID:', itemIds.length)

		if (itemIds.length === 0) {
			throw new Error('В списке нет товаров для импорта')
		}

		let imported = 0
		const failedImports = []
		const skippedCustom = []
		const alreadyInList = []
		const successfulImports = []

		for (const itemId of itemIds) {
			// Пропускаем пользовательские товары (отрицательные ID)
			if (itemId < 0) {
				skippedCustom.push(itemId)
				console.log('Пропущен пользовательский товар с ID:', itemId)
				continue
			}
			
			const product = products.find(p => p.id === itemId)
			if (product) {
				// Проверяем, нет ли уже этого товара в wishlist
				if (!wishlist.value.some(w => w.id === itemId)) {
					productStore.addToWishlist(product)
					imported++
					successfulImports.push(product.name)
				} else {
					alreadyInList.push(product.name)
				}
			} else {
				failedImports.push(itemId)
			}
		}

		console.log('=== РЕЗУЛЬТАТЫ ИМПОРТА ===')
		console.log('Успешно импортировано:', imported)
		console.log('Уже были в списке:', alreadyInList.length)
		console.log('Пропущено пользовательских:', skippedCustom.length)
		console.log('Не найдено в каталоге:', failedImports.length)

		importedCount.value = imported
		
		// Формируем сообщение об ошибке если нужно
		if (imported === 0) {
			if (skippedCustom.length === itemIds.length) {
				throw new Error('В списке только пользовательские товары, которые не могут быть импортированы')
			} else if (alreadyInList.length === itemIds.length) {
				throw new Error('Все товары уже есть в вашем списке желаний')
			} else if (failedImports.length === itemIds.length) {
				throw new Error('Ни один товар не найден в каталоге')
			} else {
				throw new Error('Не удалось импортировать товары')
			}
		}

		// Успешный импорт - логируем детали
		console.log('✅ Импорт успешен!')
		console.log('Импортированные товары:', successfulImports)
		
		// Если есть предупреждения - логируем их
		if (skippedCustom.length > 0) {
			console.log('⚠️ Пропущено пользовательских товаров:', skippedCustom.length)
		}
		if (alreadyInList.length > 0) {
			console.log('ℹ️ Уже были в списке:', alreadyInList.length)
		}
		if (failedImports.length > 0) {
			console.log('❌ Не найдено в каталоге:', failedImports.length)
		}

	} catch (error) {
		console.error('Ошибка импорта:', error)
		throw error
	}
}

const retryImport = () => {
	importError.value = ''
	importedCount.value = 0
	importUrl.value = ''
}

const goToWishlist = () => {
	router.push('/')
}
</script>