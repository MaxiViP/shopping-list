<template>
	<div class="bg-white p-2 rounded-xl shadow max-w-6xl mx-auto mt-4">
		<h2 class="text-xl font-semibold mb-4">Категории товаров</h2>

		<div v-if="!selectedCategory">
			<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1">
				<button
					v-for="cat in categories"
					:key="cat"
					@click="$emit('select-category', cat)"
					class="p-2 bg-gray-100 hover:bg-blue-100 rounded-lg transition-colors text-center"
				>
					{{ cat }}
				</button>
			</div>
		</div>

		<div v-if="selectedCategory">
			<div class="flex items-center justify-between mb-4">
				<button @click="$emit('clear-category')" class="text-blue-600 hover:text-blue-800 flex items-center">
					<font-awesome-icon icon="arrow-left" class="mr-2" />
					Назад к категориям
				</button>
				<h3 class="text-lg font-medium">{{ selectedCategory }}</h3>
			</div>

			<ul class="space-y-2">
				<li
					v-for="p in productsByCategory"
					:key="p.id"
					@click="$emit('add-to-wishlist', p)"
					class="p-3 rounded-lg flex justify-between items-center cursor-pointer transition-colors"
					:class="isInWishlist(p.id) ? 'bg-green-100 hover:bg-green-200' : 'bg-gray-50 hover:bg-blue-50'"
				>
					<span>{{ p.name }}</span>
					<button @click.stop="$emit('toggle-favorite', p.id)" class="ml-4">
						<font-awesome-icon
							icon="heart"
							:class="['text-lg', favorites.includes(p.id) ? 'text-red-500' : 'text-gray-300 hover:text-red-400']"
						/>
					</button>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup>
defineProps({
	categories: Array,
	selectedCategory: String,
	productsByCategory: Array,
	favorites: Array,
	isInWishlist: Function,
})

defineEmits(['select-category', 'clear-category', 'add-to-wishlist', 'toggle-favorite'])
</script>
