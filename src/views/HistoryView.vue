<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">История покупок</h1>

    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
      <button 
        @click="generateReport" 
        class="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition-colors"
      >
        Сгенерировать отчёт
      </button>
      <button 
        @click="backToProducts" 
        class="bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-600 transition-colors"
      >
        Назад
      </button>
    </div>

    <div v-if="report" class="space-y-6">
      <!-- Общая сумма -->
      <div class="bg-white p-4 rounded-lg shadow">
        <p class="text-lg font-semibold text-gray-700">Общая сумма: <span class="text-blue-600">{{ report.totalSpent }} руб.</span></p>
      </div>

      <!-- Сумма по магазинам -->
      <div class="bg-white p-4 rounded-lg shadow">
        <h3 class="text-md font-semibold mb-2 text-gray-700">По магазинам:</h3>
        <ul class="list-disc pl-6 space-y-1">
          <li v-for="(amount, store) in report.byStore" :key="store" class="text-gray-600">
            <span class="font-medium">{{ store }}</span>: {{ amount }} руб.
          </li>
        </ul>
      </div>

      <!-- Детали покупок -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="entry in report.history" 
          :key="entry.date" 
          class="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <p class="text-sm text-gray-500 mb-2">
            <span class="font-semibold">Дата:</span> {{ formatDate(entry.date) }}<br>
            <span class="font-semibold">Магазин:</span> {{ entry.store }}<br>
            <span class="font-semibold">Сумма:</span> {{ entry.amount }} руб.
          </p>
          <h4 class="font-semibold text-gray-700 mb-1">Товары:</h4>
          <ul class="list-disc pl-5 space-y-1 text-gray-600">
            <li v-for="item in entry.items" :key="item.id">{{ item.name }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 mt-8">
      Нет данных для отображения. Сначала добавьте покупки.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useProductStore } from '../stores/productStore.js';
import { useUserStore } from '../stores/userStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
const productStore = useProductStore();

const report = ref(null);

onMounted(() => {
  if (!userStore.isAuthenticated) {
    router.push('/login');
  }
});

function generateReport() {
  report.value = productStore.getReport();
}

function formatDate(date) {
  return new Date(date).toLocaleString();
}

function backToProducts() {
  router.push('/products');
}
</script>

<style scoped>
/* Можно добавить плавное появление карточек */
</style>
