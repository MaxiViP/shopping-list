<template>
    <header 
        ref="header"
        :class="[
            'sticky top-0 z-40 bg-gray-100 p-4 transition-transform duration-300',
            isHeaderHidden ? '-translate-y-full' : 'translate-y-0',
            isScrolled ? 'shadow-md' : ''
        ]"
    >
        <slot />
        
        <!-- Индикатор прокрутки -->
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
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const header = ref(null)
let lastScrollTop = ref(0)
let scrollDirection = ref('down')
const isHeaderHidden = ref(false)
const isScrolled = ref(false)
const scrollProgress = ref(0)

const isMobile = computed(() => {
    return window.innerWidth < 768
})

const handleScroll = () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop
    
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight
    if (totalHeight > 0) {
        scrollProgress.value = (currentScroll / totalHeight) * 100
    }
    
    if (currentScroll > lastScrollTop.value) {
        scrollDirection.value = 'down'
    } else {
        scrollDirection.value = 'up'
    }
    
    if (isMobile.value) {
        if (scrollDirection.value === 'down' && currentScroll > 50) {
            isHeaderHidden.value = true
        } else if (scrollDirection.value === 'up') {
            isHeaderHidden.value = false
        }
        
        if (currentScroll <= 50) {
            isHeaderHidden.value = false
        }
    }
    
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

const handleResize = () => {
    if (!isMobile.value) {
        isHeaderHidden.value = false
    }
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

defineExpose({
    scrollToTop,
    isHeaderHidden,
    isScrolled
})
</script>