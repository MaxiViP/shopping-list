<template>
	<div class="min-h-screen bg-gray-100 p-4">
		<div class="flex justify-between items-center mb-6">
			<h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Список покупок</h1>
			<router-link to="/history">История покупок</router-link>
			<div class="flex items-center gap-4">
				<span class="text-gray-600 hidden sm:block"> Привет, {{ userStore.currentUser?.username }}! </span>
				<button
					@click="handleLogout"
					class="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-lg transition-colors"
				>
					Выйти
				</button>
			</div>
		</div>
		<!-- Поисковая строка и избранное на одном уровне -->
		<div class="flex flex-col gap-4 mb-8 max-w-6xl mx-auto">
			<!-- Поиск -->
			<div class="flex-1 relative">
				<font-awesome-icon icon="search" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
				<input
					v-model="searchQuery"
					placeholder="Поиск товара..."
					class="w-full pl-12 py-4 rounded-xl border focus:ring-2 focus:ring-blue-500"
				/>

				<!-- Результаты поиска -->
				<div
					v-if="searchQuery"
					class="absolute w-full mt-2 bg-white rounded-xl shadow-lg max-h-[60vh] overflow-y-auto z-10"
				>
					<div v-if="filteredProducts.length === 0" class="p-6 text-center text-gray-500">Ничего не найдено</div>

					<ul v-else class="divide-y grid grid-cols-1 sm:grid-cols-2 gap-2">
						<li
							v-for="p in filteredProducts"
							:key="p.id"
							@click="selectProduct(p)"
							class="p-4 hover:bg-blue-50 cursor-pointer flex justify-between items-center"
						>
							<div>
								<div class="font-medium">{{ p.name }}</div>
								<div class="text-sm text-gray-500">{{ p.category }}</div>
							</div>
							<button @click.stop="handleFavoriteClick(p.id)" class="ml-4">
								<font-awesome-icon
									icon="heart"
									:class="['text-lg', favorites.includes(p.id) ? 'text-red-500' : 'text-gray-300 hover:text-red-400']"
								/>
							</button>
						</li>
					</ul>
				</div>
			</div>

			<!-- Вкладка избранного -->
			<div class="w-full">
				<div class="bg-white rounded-xl shadow h-full">
					<!-- Шапка с кликом -->
					<div class="p-4 border-b cursor-pointer" @click="favoritesOpen = !favoritesOpen">
						<h2 class="text-lg font-semibold flex items-center">
							<font-awesome-icon icon="heart" class="mr-2 text-red-500" />
							Избранное
							<span class="ml-2 bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm">
								{{ favorites.length }}
							</span>
							<!-- Иконка стрелки -->
							<font-awesome-icon :icon="favoritesOpen ? 'chevron-up' : 'chevron-down'" class="ml-auto text-gray-400" />
						</h2>
					</div>

					<!-- Пустой список -->
					<div v-if="favorites.length === 0" class="p-6 text-center text-gray-500">
						<font-awesome-icon icon="heart" class="text-3xl text-gray-300 mb-2" />
						<p>Нет избранных товаров</p>
					</div>

					<!-- Список товаров (аккордеон) -->
					<div v-if="favorites.length > 0 && favoritesOpen" class="max-h-64 overflow-y-auto overflow-x-hidden">
						<ul class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-1">
							<li
								v-for="id in favorites"
								:key="id"
								class="p-2 sm:p-3 md:p-4 hover:bg-red-50 flex justify-between items-center rounded"
							>
								<span class="flex-1 text-sm sm:text-base md:text-lg">
									{{ getProductNameById(id) }}
								</span>
								<div class="flex gap-2">
									<button
										@click="addFavoriteToWishlist(id)"
										class="text-green-600 hover:text-green-800 p-1 sm:p-2 md:p-2 rounded"
										title="Добавить в список желаний"
									>
										<font-awesome-icon icon="shopping-cart" class="text-sm sm:text-base md:text-lg" />
									</button>
									<button
										@click="toggleFavorite(id)"
										class="text-red-500 hover:text-red-700 p-1 sm:p-2 md:p-2 rounded"
										title="Удалить из избранного"
									>
										<font-awesome-icon icon="times" class="text-sm sm:text-base md:text-lg" />
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
				<div class="p-4 border-b">
					<h2 class="text-lg font-semibold flex items-center">
						<font-awesome-icon icon="list" class="mr-2 text-blue-500" />
						Список желаний
						<span class="ml-2 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm">
							{{ wishlist.length }}
						</span>
					</h2>
				</div>

				<div v-if="wishlist.length === 0" class="p-6 text-center text-gray-500">
					<font-awesome-icon icon="shopping-cart" class="text-3xl text-gray-300 mb-2" />
					<p>Список желаний пуст</p>
				</div>

				<ul class="max-h-96 overflow-y-auto overflow-x-hidden grid grid-cols-2 md:grid-cols-2 gap-2">
					<li
						v-for="i in wishlist"
						:key="i.id"
						class="p-2 sm:p-3 md:p-4 hover:bg-blue-50 flex justify-between items-center rounded break-words"
					>
						<span class="flex-1 text-sm sm:text-base md:text-lg truncate">
							{{ i.name }}
						</span>
						<div class="flex gap-2 flex-shrink-0">
							<button
								@click="moveToCart(i.id)"
								class="text-green-600 hover:text-green-800 p-1 sm:p-2 md:p-2 rounded"
								title="Отметить как купленное"
							>
								<font-awesome-icon icon="check" class="text-sm sm:text-base md:text-lg" />
							</button>
							<button
								@click="toggleFavorite(i.id)"
								class="text-red-500 hover:text-red-700 p-1 sm:p-2 md:p-2 rounded"
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

  <form
    @submit.prevent="savePurchase"
    class="flex flex-col sm:flex-row sm:items-center gap-3"
  >
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
    <button
      type="submit"
      class="bg-green-500 text-white px-4 py-3 rounded hover:bg-green-600 transition-colors"
    >
      Сохранить покупку
    </button>
  </form>
</div>


		<!-- Категории -->
		<div class="bg-white p-6 rounded-xl shadow max-w-6xl mx-auto">
			<h2 class="text-xl font-semibold mb-4">Категории товаров</h2>

			<div v-if="!selectedCategory">
				<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
					<button
						v-for="cat in categories"
						:key="cat"
						@click="selectedCategory = cat"
						class="p-4 bg-gray-100 hover:bg-blue-100 rounded-lg transition-colors text-center"
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
						class="p-3 bg-gray-50 hover:bg-blue-50 rounded-lg flex justify-between items-center cursor-pointer"
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
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductStore } from '@/stores/productStore'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

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

const favoritesOpen = ref(true)

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
  searchQuery.value = ''     // скрываем результаты поиска
}

</script>
