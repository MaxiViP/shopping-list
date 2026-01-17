<template>
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

		<ul
			v-else
			class="max-h-96 overflow-y-auto overflow-x-hidden grid grid-cols-2 md:grid-cols-2 gap-2 p-2 justify-items-start"
		>
			<li
				v-for="i in cart"
				:key="i.id"
				class="w-full p-2 sm:p-3 md:p-4 hover:bg-green-50 flex justify-between items-center rounded break-words"
			>
				<!-- Название товара -->
				<span class="flex-1 line-through text-gray-600 text-sm sm:text-base md:text-lg truncate">
					{{ i.name }}
				</span>

				<!-- Кнопка с SVG -->
				<button
					@click="$emit('move-from-cart-to-wishlist', i.id)"
					class="ml-4 text-amber-600 hover:text-amber-800 p-1 sm:p-2 md:p-2 rounded flex-shrink-0"
					title="Вернуть в список желаний"
				>
					<font-awesome-icon icon="undo-alt" class="text-sm sm:text-base md:text-lg" />
				</button>
			</li>
		</ul>
	</div>
</template>

<script setup>
defineProps({
	cart: {
		type: Array,
		required: true,
		default: () => [],
	},
})

defineEmits(['move-from-cart-to-wishlist'])
</script>
