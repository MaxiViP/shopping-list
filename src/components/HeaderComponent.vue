<template>
  <header
    ref="header"
    :class="[
      'sticky top-0 z-40 bg-gray-200 p-4 mb-4 transition-transform duration-300 border-b border-gray-700',
      isHeaderHidden ? '-translate-y-full' : 'translate-y-0',
      isScrolled ? 'shadow-md' : '',
    ]"
  >
    <div class="flex items-center justify-between">
      <!-- ЛЕВАЯ ЧАСТЬ: Логотип и название -->
      <div class="flex items-center gap-3 sm:gap-4 min-w-0">
        <div class="flex-shrink-0">
          <img
            src="@/assets/logo.png"
            alt="Логотип Список покупок"
            :class="[
              'object-contain transition-all duration-200',
              isHeaderHidden ? 'h-7 w-7' : 'h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11',
            ]"
          />
        </div>
        <h1
          :class="[
            'font-bold text-gray-800 truncate',
            isHeaderHidden ? 'text-lg hidden sm:block' : 'text-xl sm:text-2xl md:text-3xl',
            'hidden xs:block',
          ]"
        >
          Список покупок
        </h1>
      </div>

      <!-- ПРАВАЯ ЧАСТЬ: Кнопки -->
      <div class="flex items-center gap-3 sm:gap-4">
        <router-link
          to="/history"
          :class="[
            'bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2 flex-shrink-0',
            isHeaderHidden ? 'px-2 py-1 text-sm' : 'px-3 py-2 sm:px-4 sm:py-2',
            isVerySmallScreen ? 'px-2 py-1 text-xs' : '',
          ]"
          title="История покупок"
        >
          <font-awesome-icon icon="history" />
          <span class="hidden sm:inline">История покупок</span>
          <span class="sm:hidden">История</span>
        </router-link>

        <span v-if="!isHeaderHidden" class="text-gray-600 hidden sm:block flex-shrink-0 whitespace-nowrap">
          Привет, {{ userStore.currentUser?.username }}!
        </span>

        <button
          @click="$emit('logout')"
          :class="[
            'bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors flex-shrink-0',
            isHeaderHidden ? 'px-2 py-1 text-xs' : 'px-2 sm:px-3 py-1 text-sm',
            isVerySmallScreen ? 'px-1.5 py-0.5 text-xs' : '',
          ]"
          title="Выйти"
        >
          <span class="hidden sm:inline">Выйти</span>
          <font-awesome-icon
            icon="sign-out-alt"
            :class="[isHeaderHidden ? '' : 'sm:hidden', isVerySmallScreen ? 'text-sm' : '']"
          />
        </button>
      </div>
    </div>

    <!-- Индикатор прокрутки -->
    <div v-if="isScrolled && !isHeaderHidden" class="mt-2">
      <div class="h-1 bg-blue-200 rounded-full overflow-hidden">
        <div :style="{ width: scrollProgress + '%' }" class="h-full bg-blue-500 transition-all duration-200"></div>
      </div>
    </div>
  </header>

  <!-- Кнопка "Наверх" -->
  <button
    v-if="isHeaderHidden && isScrolled"
    @click="scrollToTop"
    class="fixed bottom-4 right-4 z-50 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 animate-bounce sm:hidden"
    title="Показать шапку"
  >
    <font-awesome-icon icon="chevron-up" />
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useUserStore } from '../stores/userStore'

const userStore = useUserStore()
defineEmits(['logout'])

const header = ref(null)
const lastScrollTop = ref(0)
const scrollDirection = ref('down')
const isHeaderHidden = ref(false)
const isScrolled = ref(false)
const scrollProgress = ref(0)
const windowWidth = ref(window.innerWidth)
let ticking = false

const isMobile = computed(() => windowWidth.value < 768)
const isVerySmallScreen = computed(() => windowWidth.value < 420)

// Скролл с requestAnimationFrame
const handleScroll = () => {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop

  if (!ticking) {
    window.requestAnimationFrame(() => {
      // Прогресс скролла
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const newProgress = totalHeight > 0 ? (currentScroll / totalHeight) * 100 : 0
      if (scrollProgress.value !== newProgress) scrollProgress.value = newProgress

      // Направление
      scrollDirection.value = currentScroll > lastScrollTop.value ? 'down' : 'up'

      // Логика хедера
      if (isMobile.value) {
        if (scrollDirection.value === 'down' && currentScroll > 50) isHeaderHidden.value = true
        else if (scrollDirection.value === 'up') isHeaderHidden.value = false
        if (currentScroll <= 50) isHeaderHidden.value = false
      }

      // Флаг скролла
      isScrolled.value = currentScroll > 100
      lastScrollTop.value = currentScroll <= 0 ? 0 : currentScroll
      ticking = false
    })
    ticking = true
  }
}

// Наверх
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  isHeaderHidden.value = false
}

// Ресайз окна
const handleResize = () => {
  windowWidth.value = window.innerWidth
  if (!isMobile.value) isHeaderHidden.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize)
  handleResize()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
img {
  transition: all 0.3s ease;
}

.min-w-0 {
  min-width: 0;
}

@media (max-width: 419px) {
  .hidden.xs\:block {
    display: none !important;
  }
}
@media (min-width: 420px) and (max-width: 639px) {
  .hidden.xs\:block {
    display: block !important;
  }
}
</style>
