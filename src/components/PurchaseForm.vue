<template>
    <div class="bg-white rounded-xl shadow p-4 mt-4 max-w-6xl mx-auto">
        <h3 class="text-lg font-semibold mb-4">Добавить информацию о покупке</h3>

        <form @submit.prevent="$emit('save-purchase')" class="flex flex-col sm:flex-row sm:items-center gap-3">
            <!-- Магазин -->
            <input
                v-model="store"
                placeholder="Магазин"
                class="flex-1 border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <!-- Сумма -->
            <input
                v-model.number="amount"
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
</template>

<script setup>
import { ref, defineEmits, watch } from 'vue'

const store = ref('')
const amount = ref(0)

const emit = defineEmits(['save-purchase', 'update:store', 'update:amount'])

watch(store, (value) => {
    emit('update:store', value)
})

watch(amount, (value) => {
    emit('update:amount', value)
})
</script>