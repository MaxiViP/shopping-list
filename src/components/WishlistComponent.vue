<template>
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
                <button
                    @click="$emit('toggle-add-product')"
                    class="text-purple-600 hover:text-purple-800 hover:bg-purple-50 p-2 rounded-lg transition-colors"
                    :title="addProductAccordionOpen ? 'Скрыть' : 'Добавить свой товар'"
                >
                    <span class="text-lg transition-transform duration-300" :class="{ 'rotate-45': addProductAccordionOpen }">
                        ➕
                    </span>
                </button>

                <button
                    v-if="wishlist.length > 0"
                    @click="$emit('export-wishlist')"
                    class="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                    title="Экспорт в TXT"
                >
                    💾
                </button>
                <button
                    v-if="wishlist.length > 0"
                    @click="$emit('share-wishlist')"
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
                        @keyup.enter="$emit('add-quick-product', quickAddProduct)"
                        placeholder="Напишите название товара..."
                        class="flex-1 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        ref="productInput"
                    />
                    <button
                        @click="$emit('add-quick-product', quickAddProduct)"
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
                @click="$emit('move-to-cart', i.id)"
                class="p-2 sm:p-3 md:p-4 hover:bg-blue-50 flex justify-between items-center rounded break-words cursor-pointer group"
            >
                <span class="flex-1 text-sm sm:text-base md:text-lg truncate">
                    {{ i.name }}
                    <span v-if="i.isCustom" class="ml-1 text-xs text-purple-500 bg-purple-50 px-1 rounded">свой</span>
                </span>
                <div class="flex gap-2 flex-shrink-0" @click.stop>
                    <button
                        @click="$emit('move-to-cart', i.id)"
                        class="text-green-600 hover:text-green-800 p-1 sm:p-2 md:p-2 rounded hover:bg-green-50 transition-colors"
                        title="Отметить как купленное"
                    >
                        <font-awesome-icon icon="check" class="text-sm sm:text-base md:text-lg" />
                    </button>
                    <button
                        @click="$emit('toggle-favorite', i.id)"
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
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

defineProps({
    wishlist: Array,
    favorites: Array,
    addProductAccordionOpen: Boolean
})

defineEmits([
    'toggle-add-product',
    'export-wishlist',
    'share-wishlist',
    'add-quick-product',
    'move-to-cart',
    'toggle-favorite'
])

const quickAddProduct = ref('')
</script>