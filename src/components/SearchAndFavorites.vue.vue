<template>
    <div class="flex flex-col gap-4 mb-8 max-w-6xl mx-auto">
        <!-- Поиск -->
        <div class="flex-1 relative">
            <font-awesome-icon icon="search" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
                :value="searchQuery"
                @input="$emit('search-input', $event)"
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
                        @click="$emit('select-product', p)"
                        class="p-4 hover:bg-blue-50 cursor-pointer flex justify-between items-center group"
                    >
                        <div class="flex-1 min-w-0">
                            <div class="font-medium text-gray-900 truncate">{{ p.name }}</div>
                            <div class="text-sm text-gray-500 truncate">{{ p.category }}</div>
                        </div>
                        <button
                            @click.stop="$emit('toggle-favorite', p.id)"
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
                    @click="$emit('toggle-favorites-open')"
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
                            @click="$emit('add-favorite-to-wishlist', id)"
                            class="p-3 hover:bg-red-50 flex justify-between items-center rounded-lg cursor-pointer transition-all duration-150 border border-transparent hover:border-red-100 group"
                        >
                            <span class="flex-1 text-sm sm:text-base md:text-lg font-medium text-gray-800 truncate pr-2">
                                {{ getProductNameById(id) }}
                            </span>

                            <div class="flex gap-1 flex-shrink-0" @click.stop>
                                <button
                                    @click="$emit('add-favorite-to-wishlist', id)"
                                    class="text-green-600 hover:text-green-800 p-1 rounded-lg hover:bg-green-50 transition-colors"
                                    title="Добавить в список желаний"
                                >
                                    <font-awesome-icon icon="shopping-cart" class="text-xs sm:text-sm" />
                                </button>
                                <button
                                    @click="$emit('toggle-favorite', id)"
                                    class="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
                                    title="Удалить из избранного"
                                >
                                    <font-awesome-icon icon="times" class="text-xs sm:text-sm" />
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
    searchQuery: String,
    filteredProducts: Array,
    favorites: Array,
    favoritesOpen: Boolean,
    getProductNameById: Function
})

defineEmits([
    'search-input',
    'select-product',
    'toggle-favorite',
    'toggle-favorites-open',
    'add-favorite-to-wishlist'
])

const isComposing = ref(false)

const handleCompositionEnd = () => {
    isComposing.value = false
}
</script>