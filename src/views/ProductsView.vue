<template>
	<div class="min-h-screen bg-gray-100 p-2">
    <header 
        ref="header"
        :class="[
            'sticky top-0 z-40 bg-gray-100 p-4 transition-transform duration-300',
            isHeaderHidden ? '-translate-y-full' : 'translate-y-0',
            isScrolled ? 'shadow-md' : ''
        ]"
    >
        <div class="flex justify-between items-center">
            <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 truncate pr-2">
                Список покупок
            </h1>
            
            <div class="flex items-center gap-3 sm:gap-4">
                <router-link
                    to="/history"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors flex items-center gap-2 flex-shrink-0"
                    title="История покупок"
                >
                    <font-awesome-icon icon="history" />
                    <span class="hidden sm:inline">История покупок</span>
                    <span class="sm:hidden">История</span>
                </router-link>
                
                <span class="text-gray-600 hidden sm:block flex-shrink-0"> 
                    Привет, {{ userStore.currentUser?.username }}! 
                </span>
                
                <button
                    @click="handleLogout"
                    class="text-sm bg-gray-200 hover:bg-gray-300 px-2 sm:px-3 py-1 rounded-lg transition-colors flex-shrink-0"
                    title="Выйти"
                >
                    <span class="hidden sm:inline">Выйти</span>
                    <font-awesome-icon icon="sign-out-alt" class="sm:hidden" />
                </button>
            </div>
        </div>
        
        <!-- Индикатор прокрутки (опционально) -->
        <div v-if="isScrolled && !isHeaderHidden" class="mt-2">
            <div class="h-1 bg-blue-200 rounded-full overflow-hidden">
                <div 
                    :style="{ width: scrollProgress + '%' }" 
                    class="h-full bg-blue-500 transition-all duration-200"
                ></div>
            </div>
        </div>
    </header>
    
    <!-- Кнопка "Наверх" при скрытом хедере -->
    <button
        v-if="isHeaderHidden && isScrolled"
        @click="scrollToTop"
        class="fixed bottom-4 right-4 z-50 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 animate-bounce sm:hidden"
        title="Показать шапку"
    >
        <font-awesome-icon icon="chevron-up" />
    </button>
		<!-- Поисковая строка и избранное на одном уровне -->
		<div class="flex flex-col gap-4 mb-8 max-w-6xl mx-auto">
			<!-- Поиск -->
			<div class="flex-1 relative">
				<font-awesome-icon icon="search" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
				<input
					:value="searchQuery"
					@input="handleSearchInput"
					@compositionstart="isComposing = true"
					@compositionend="handleCompositionEnd"
					placeholder="Поиск товара..."
					class="w-full pl-12 py-4 rounded-xl border focus:ring-2 focus:ring-blue-500"
					autocomplete="off"
					autocorrect="off"
					autocapitalize="off"
					spellcheck="false"
					inputmode="search"
				/>

				<!-- Результаты поиска -->
				<div
					v-if="searchQuery && filteredProducts.length > 0"
					class="absolute w-full mt-2 bg-white rounded-xl shadow-lg max-h-[60vh] overflow-y-auto z-20 border"
				>
					<ul class="divide-y grid grid-cols-1 sm:grid-cols-2 gap-0">
						<li
							v-for="p in filteredProducts"
							:key="p.id"
							@click="selectProduct(p)"
							class="p-4 hover:bg-blue-50 cursor-pointer flex justify-between items-center group"
						>
							<div class="flex-1 min-w-0">
								<div class="font-medium text-gray-900 truncate">{{ p.name }}</div>
								<div class="text-sm text-gray-500 truncate">{{ p.category }}</div>
							</div>
							<button
								@click.stop="handleFavoriteClick(p.id)"
								class="ml-3 flex-shrink-0"
								:title="favorites.includes(p.id) ? 'Удалить из избранного' : 'Добавить в избранное'"
							>
								<font-awesome-icon
									icon="heart"
									:class="[
										'text-lg transition-colors',
										favorites.includes(p.id) ? 'text-red-500' : 'text-gray-300 group-hover:text-red-400',
									]"
								/>
							</button>
						</li>
					</ul>
				</div>

				<!-- Сообщение "Ничего не найдено" -->
				<div
					v-if="searchQuery && filteredProducts.length === 0"
					class="absolute w-full mt-2 bg-white rounded-xl shadow-lg z-20 border p-6 text-center text-gray-500"
				>
					Ничего не найдено
				</div>
			</div>

			<!-- Вкладка избранного -->
			<div class="w-full">
				<div class="bg-white rounded-xl shadow h-full">
					<!-- Шапка с кликом -->
					<div
						class="p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors"
						@click="favoritesOpen = !favoritesOpen"
					>
						<h2 class="text-lg font-semibold flex items-center">
							<font-awesome-icon icon="heart" class="mr-2 text-red-500" />
							Избранное
							<span class="ml-2 bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-medium">
								{{ favorites.length }}
							</span>
							<!-- Иконка стрелки -->
							<font-awesome-icon
								:icon="favoritesOpen ? 'chevron-up' : 'chevron-down'"
								class="ml-auto text-gray-400 transition-transform duration-200"
								:class="{ 'rotate-180': favoritesOpen }"
							/>
						</h2>
					</div>

					<!-- Пустой список -->
					<div v-if="favorites.length === 0" class="p-6 text-center text-gray-500">
						<font-awesome-icon icon="heart" class="text-3xl text-gray-300 mb-3" />
						<p class="text-gray-600">Нет избранных товаров</p>
						<p class="text-sm text-gray-400 mt-1">Добавляйте товары в избранное, нажимая на сердечко</p>
					</div>

					<!-- Список товаров (аккордеон) -->
					<div v-if="favorites.length > 0 && favoritesOpen" class="max-h-64 overflow-y-auto overflow-x-hidden">
						<ul class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 p-2">
							<li
								v-for="id in favorites"
								:key="id"
								@click="addFavoriteToWishlist(id)"
								class="p-3 hover:bg-red-50 flex justify-between items-center rounded-lg cursor-pointer transition-all duration-150 border border-transparent hover:border-red-100 group"
							>
								<span class="flex-1 text-sm sm:text-base md:text-lg font-medium text-gray-800 truncate pr-2">
									{{ getProductNameById(id) }}
								</span>

								<div class="flex gap-1 flex-shrink-0" @click.stop>
									<button
										@click="addFavoriteToWishlist(id)"
										class="text-green-600 hover:text-green-800 p-1 rounded-lg hover:bg-green-50 transition-colors"
										title="Добавить в список желаний"
									>
										<font-awesome-icon icon="shopping-cart" class="text-xs sm:text-sm" />
									</button>
									<button
										@click="toggleFavorite(id)"
										class="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
										title="Удалить из избранного"
									>
										<font-awesome-icon icon="times" class="text-xs sm:text-sm" />X
									</button>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		<!-- Две колонки: Список желаний и Куплено -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 max-w-6xl mx-auto">
			<!-- Список желаний -->
			<div class="bg-white rounded-xl shadow">
				<div class="p-4 border-b flex justify-between items-center">
					<h2 class="text-lg font-semibold flex items-center">
						<font-awesome-icon icon="list" class="mr-2 text-blue-500" />
						Список желаний
						<span class="ml-2 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm">
							{{ wishlist.length }}
						</span>
					</h2>
					<div class="flex gap-2">
						<!-- Кнопка добавления товара (аккордеон) -->
						<button
							@click="addProductAccordionOpen = !addProductAccordionOpen"
							class="text-purple-600 hover:text-purple-800 hover:bg-purple-50 p-2 rounded-lg transition-colors"
							:title="addProductAccordionOpen ? 'Скрыть' : 'Добавить свой товар'"
						>
							<span class="text-lg transition-transform duration-300" :class="{ 'rotate-45': addProductAccordionOpen }">
								➕
							</span>
						</button>

						<button
							v-if="wishlist.length > 0"
							@click="exportWishlistToTxt"
							class="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors"
							title="Экспорт в TXT"
						>
							💾
						</button>
						<button
							v-if="wishlist.length > 0"
							@click="generateShareLink"
							class="text-green-600 hover:text-green-800 hover:bg-green-50 p-2 rounded-lg transition-colors"
							title="Поделиться списком"
						>
							🔗
						</button>
					</div>
				</div>

				<!-- Аккордеон добавления товара -->
				<div v-if="addProductAccordionOpen" class="border-b bg-gray-50">
					<div class="p-4">
						<div class="flex gap-2">
							<input
								v-model="quickAddProduct"
								@keyup.enter="addQuickProduct"
								placeholder="Напишите название товара..."
								class="flex-1 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								ref="productInput"
								@focus="scrollToInput"
							/>
							<button
								@click="addQuickProduct"
								class="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								:disabled="!quickAddProduct.trim()"
								title="Добавить товар"
							>
								Добавить
							</button>
						</div>
						<p class="text-xs text-gray-500 mt-2">Напишите любой товар и нажмите Enter или кнопку "Добавить"</p>
					</div>
				</div>

				<div v-if="wishlist.length === 0" class="p-6 text-center text-gray-500">
					<font-awesome-icon icon="shopping-cart" class="text-3xl text-gray-300 mb-2" />
					<p>Список желаний пуст</p>
					<p v-if="!addProductAccordionOpen" class="text-sm mt-2">
						Нажмите <span class="text-purple-600">➕</span> чтобы добавить товар
					</p>
				</div>

				<ul v-else class="max-h-96 overflow-y-auto overflow-x-hidden grid grid-cols-2 md:grid-cols-2 gap-2 p-2">
					<li
						v-for="i in wishlist"
						:key="i.id"
						@click="moveToCart(i.id)"
						class="p-2 sm:p-3 md:p-4 hover:bg-blue-50 flex justify-between items-center rounded break-words cursor-pointer group"
					>
						<span class="flex-1 text-sm sm:text-base md:text-lg truncate">
							{{ i.name }}
							<span v-if="i.isCustom" class="ml-1 text-xs text-purple-500 bg-purple-50 px-1 rounded">свой</span>
						</span>
						<div class="flex gap-2 flex-shrink-0" @click.stop>
							<button
								@click="moveToCart(i.id)"
								class="text-green-600 hover:text-green-800 p-1 sm:p-2 md:p-2 rounded hover:bg-green-50 transition-colors"
								title="Отметить как купленное"
							>
								<font-awesome-icon icon="check" class="text-sm sm:text-base md:text-lg" />
							</button>
							<button
								@click="toggleFavorite(i.id)"
								class="text-red-500 hover:text-red-700 p-1 sm:p-2 md:p-2 rounded hover:bg-red-50 transition-colors"
								title="Добавить в избранное"
							>
								<font-awesome-icon
									:icon="favorites.includes(i.id) ? 'heart' : ['far', 'heart']"
									class="text-sm sm:text-base md:text-lg"
								/>
							</button>
						</div>
					</li>
				</ul>

				<!-- Модальное окно для шаринга -->
				<div
					v-if="showShareModal"
					class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
					@click.self="showShareModal = false"
				>
					<div class="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
						<button
							@click="showShareModal = false"
							class="absolute -top-3 -right-3 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-900 transition-colors z-10"
							title="Закрыть"
						>
							<font-awesome-icon icon="times" class="text-sm" />
						</button>

						<div class="flex justify-between items-center mb-4">
							<h3 class="text-lg font-semibold">Поделиться списком</h3>
						</div>

						<p class="text-gray-600 mb-4">Отправьте эту ссылку другому пользователю:</p>

						<div class="flex gap-2 mb-4">
							<input type="text" :value="shareLink" readonly class="flex-1 border rounded-lg p-2 text-sm bg-gray-50" />
							<button
								@click="copyToClipboard"
								class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
							>
								Копировать
							</button>
						</div>

						<div class="flex gap-3">
							<button
								@click="shareByEmail"
								class="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
							>
								<font-awesome-icon icon="envelope" />
								Email
							</button>
							<button
								@click="shareToTelegram"
								class="flex-1 bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
							>
								<font-awesome-icon icon="paper-plane" />
								Telegram
							</button>
						</div>
					</div>
				</div>
			</div>
			<!-- Куплено -->
			<div class="bg-white rounded-xl shadow">
				<div class="p-4 border-b">
					<h2 class="text-lg font-semibold flex items-center">
						<font-awesome-icon icon="check-circle" class="mr-2 text-green-500" />
						Куплено
						<span class="ml-2 bg-green-100 text-green-600 px-2 py-1 rounded-full text-sm">
							{{ cart.length }}
						</span>
					</h2>
				</div>

				<div v-if="cart.length === 0" class="p-6 text-center text-gray-500">
					<font-awesome-icon icon="check-circle" class="text-3xl text-gray-300 mb-2" />
					<p>Нет купленных товаров</p>
				</div>

				<ul class="max-h-96 overflow-y-auto overflow-x-hidden grid grid-cols-2 md:grid-cols-2 gap-2">
					<li
						v-for="i in cart"
						:key="i.id"
						class="p-2 sm:p-3 md:p-4 hover:bg-green-50 flex justify-between items-center rounded break-words"
					>
						<span class="flex-1 line-through text-gray-600 text-sm sm:text-base md:text-lg truncate">
							{{ i.name }}
						</span>
						<button
							@click="moveFromCartToWishlist(i.id)"
							class="text-amber-600 hover:text-amber-800 p-1 sm:p-2 md:p-2 rounded flex-shrink-0"
							title="Вернуть в список желаний"
						>
							<font-awesome-icon icon="undo-alt" class="text-sm sm:text-base md:text-lg" />
						</button>
					</li>
				</ul>
			</div>
		</div>

		<!-- Форма добавления информации о покупке -->
		<div class="bg-white rounded-xl shadow p-4 mt-4 max-w-6xl mx-auto">
			<h3 class="text-lg font-semibold mb-4">Добавить информацию о покупке</h3>

			<form @submit.prevent="savePurchase" class="flex flex-col sm:flex-row sm:items-center gap-3">
				<!-- Магазин -->
				<input
					v-model="purchaseStore"
					placeholder="Магазин"
					class="flex-1 border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
				/>

				<!-- Сумма -->
				<input
					v-model.number="purchaseAmount"
					type="number"
					placeholder="Сумма (руб.)"
					class="w-full sm:w-32 border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
					min="0"
				/>

				<!-- Кнопка сохранения -->
				<button type="submit" class="bg-green-500 text-white px-4 py-3 rounded hover:bg-green-600 transition-colors">
					Сохранить покупку
				</button>
			</form>
		</div>

		<!-- Категории -->
		<div class="bg-white p-2 rounded-xl shadow max-w-6xl mx-auto">
			<h2 class="text-xl font-semibold mb-4">Категории товаров</h2>

			<div v-if="!selectedCategory">
				<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1">
					<button
						v-for="cat in categories"
						:key="cat"
						@click="selectedCategory = cat"
						class="p-2 bg-gray-100 hover:bg-blue-100 rounded-lg transition-colors text-center"
					>
						{{ cat }}
					</button>
				</div>
			</div>

			<div v-if="selectedCategory">
				<div class="flex items-center justify-between mb-4">
					<button @click="selectedCategory = null" class="text-blue-600 hover:text-blue-800 flex items-center">
						<font-awesome-icon icon="arrow-left" class="mr-2" />
						Назад к категориям
					</button>
					<h3 class="text-lg font-medium">{{ selectedCategory }}</h3>
				</div>

				<ul class="space-y-2">
					<li
						v-for="p in productsByCategory"
						:key="p.id"
						@click="addToWishlist(p)"
						class="p-3 rounded-lg flex justify-between items-center cursor-pointer transition-colors"
						:class="isInWishlist(p.id) ? 'bg-green-100 hover:bg-green-200' : 'bg-gray-50 hover:bg-blue-50'"
					>
						<span>{{ p.name }}</span>
						<button @click.stop="toggleFavorite(p.id)" class="ml-4">
							<font-awesome-icon
								icon="heart"
								:class="['text-lg', favorites.includes(p.id) ? 'text-red-500' : 'text-gray-300 hover:text-red-400']"
							/>
						</button>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductStore } from '@/stores/productStore'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import QRCode from 'qrcode'

const header = ref(null)
let lastScrollTop = ref(0)
let scrollDirection = ref('down')
const isHeaderHidden = ref(false)
const isScrolled = ref(false)
const scrollProgress = ref(0)

// Определяем мобильное устройство
const isMobile = computed(() => {
    return window.innerWidth < 768
})


const handleScroll = () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop
    
    // Прогресс прокрутки (для индикатора)
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight
    if (totalHeight > 0) {
        scrollProgress.value = (currentScroll / totalHeight) * 100
    }
    
    // Определяем направление прокрутки
    if (currentScroll > lastScrollTop.value) {
        scrollDirection.value = 'down'
    } else {
        scrollDirection.value = 'up'
    }
    
    // Скрываем/показываем хедер только на мобильных
    if (isMobile.value) {
        // Если прокрутили больше 50px вниз - скрываем
        if (scrollDirection.value === 'down' && currentScroll > 50) {
            isHeaderHidden.value = true
        } 
        // Если прокрутили вверх - показываем
        else if (scrollDirection.value === 'up') {
            isHeaderHidden.value = false
        }
        
        // Если в самом верху - всегда показываем
        if (currentScroll <= 50) {
            isHeaderHidden.value = false
        }
    }
    
    // Флаг, что прокрутка была
    isScrolled.value = currentScroll > 100
    
    lastScrollTop.value = currentScroll <= 0 ? 0 : currentScroll
}

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
    isHeaderHidden.value = false
}

// Отслеживаем изменения размера окна
const handleResize = () => {
    // На десктопе всегда показываем хедер
    if (!isMobile.value) {
        isHeaderHidden.value = false
    }
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)
    handleResize() // инициализируем при монтировании
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', handleResize)
})

// Внутри setup
const router = useRouter()
const userStore = useUserStore()

const handleLogout = () => {
	userStore.logout()
	router.push('/login')
}
const productStore = useProductStore()

const purchaseStore = ref('')
const purchaseAmount = ref(0)

// Сохраняем покупку в историю
function savePurchase() {
	if (!purchaseStore.value || purchaseAmount.value <= 0) {
		alert('Введите магазин и корректную сумму')
		return
	}

	productStore.completePurchase(purchaseStore.value, purchaseAmount.value)

	// Очистка формы
	purchaseStore.value = ''
	purchaseAmount.value = 0
}

const favoritesOpen = ref(false)

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

const getProductNameById = id => allProducts.value.find(p => p.id === id)?.name || 'Не найдено'

const wishlistItemIds = computed(() => {
	return wishlist.value.map(item => item.id)
})

// Добавьте эту функцию - она будет правильно проверять наличие товара в wishlist
const isInWishlist = productId => {
	return wishlistItemIds.value.includes(productId)
}

// Функция для добавления избранного в список желаний
const addFavoriteToWishlist = productId => {
	const product = allProducts.value.find(p => p.id === productId)
	if (product) {
		addToWishlist(product)
	}
}

function selectProduct(product) {
	addToWishlist(product) // добавляем товар в список желаний
	searchQuery.value = '' // очищаем поле поиска
}

function handleFavoriteClick(productId) {
	toggleFavorite(productId) // добавляем/удаляем из избранного
	searchQuery.value = '' // скрываем результаты поиска
}

// Для обработки поиска на мобильных
const isComposing = ref(false)
const searchTimeout = ref(null)

const handleSearchInput = event => {
	if (isComposing.value) return

	const value = event.target.value

	// Очищаем предыдущий таймаут
	if (searchTimeout.value) {
		clearTimeout(searchTimeout.value)
	}

	// Для мобильных устройств добавляем небольшую задержку
	const isMobile = window.innerWidth < 768
	searchTimeout.value = setTimeout(
		() => {
			searchQuery.value = value
		},
		isMobile ? 50 : 0
	) // 50ms задержка для мобильных
}

const handleCompositionEnd = event => {
	isComposing.value = false
	searchQuery.value = event.target.value
}

// Очистка таймера
onUnmounted(() => {
	if (searchTimeout.value) {
		clearTimeout(searchTimeout.value)
	}
})

// Аккордеон добавления товара
const addProductAccordionOpen = ref(false)

// Для быстрого добавления товара
const quickAddProduct = ref('')

// Функция добавления быстрого товара
const addQuickProduct = () => {
	if (quickAddProduct.value.trim()) {
		const customProduct = {
			id: -Date.now(), // Отрицательный ID для пользовательских товаров
			name: quickAddProduct.value.trim(),
			category: 'Другое',
			isCustom: true,
		}
		productStore.addToWishlist(customProduct)
		quickAddProduct.value = '' // Очищаем поле
	}
}

// Состояние для шаринга
const showShareModal = ref(false)
const shareLink = ref('')
const qrCodeUrl = ref('')

// Экспорт в TXT
const exportWishlistToTxt = () => {
	if (productStore.wishlist.length === 0) {
		alert('Список желаний пуст')
		return
	}

	const content = generateExportContent()
	downloadFile(content, 'wishlist.txt', 'text/plain')
}

// Генерация контента для TXT
const generateExportContent = () => {
	let content = '=== Мой список покупок ===\n\n'
	content += 'Список желаний:\n'

	productStore.wishlist.forEach((item, index) => {
		content += `${index + 1}. ${item.name}\n`
	})

	content += '\n---\n'
	content += `Всего товаров: ${productStore.wishlist.length}\n`
	content += `Дата экспорта: ${new Date().toLocaleDateString()}\n`

	return content
}

// Скачивание файла
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

// Генерация shareable ссылки
const generateShareLink = async () => {
	if (productStore.wishlist.length === 0) {
		alert('Список желаний пуст')
		return
	}

	const data = {
		wishlist: productStore.wishlist.map(item => ({
			id: item.id,
			name: item.name,
			category: item.category,
		})),
		timestamp: Date.now(),
		source: window.location.hostname,
	}

	// Кодируем в base64 для URL
	const jsonString = JSON.stringify(data)
	const encodedData = btoa(encodeURIComponent(jsonString))
	shareLink.value = `${window.location.origin}/import/${encodedData}`
	// Генерируем QR-код
	try {
		qrCodeUrl.value = await QRCode.toDataURL(shareLink.value)
	} catch (err) {
		console.error('Ошибка генерации QR-кода:', err)
	}

	showShareModal.value = true
}

// Копирование ссылки в буфер обмена
const copyToClipboard = async () => {
	try {
		await navigator.clipboard.writeText(shareLink.value)
		alert('Ссылка скопирована в буфер обмена!')
	} catch (err) {
		console.error('Ошибка копирования:', err)
		// Fallback для старых браузеров
		const textArea = document.createElement('textarea')
		textArea.value = shareLink.value
		document.body.appendChild(textArea)
		textArea.select()
		document.execCommand('copy')
		document.body.removeChild(textArea)
		alert('Ссылка скопирована!')
	}
}

// Отправка по email
const shareByEmail = () => {
	const subject = 'Мой список покупок'
	const body = `Привет! Посмотри мой список покупок:\n\n${shareLink.value}\n\nВсего товаров: ${productStore.wishlist.length}`
	window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

// Отправка в Telegram
const shareToTelegram = () => {
	const text = `Мой список покупок (${productStore.wishlist.length} товаров): ${shareLink.value}`
	window.open(
		`https://t.me/share/url?url=${encodeURIComponent(shareLink.value)}&text=${encodeURIComponent(text)}`,
		'_blank'
	)
}
</script>
