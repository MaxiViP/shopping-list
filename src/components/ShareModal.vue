<template>
	<div
		v-if="show"
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
		@click.self="$emit('close')"
	>
		<div class="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
			<button
				@click="$emit('close')"
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
					@click="$emit('copy-to-clipboard')"
					class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
				>
					Копировать
				</button>
			</div>

			<div class="flex gap-3">
				<button
					@click="$emit('share-by-email')"
					class="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
				>
					<font-awesome-icon icon="envelope" />
					Email
				</button>
				<button
					@click="$emit('share-to-telegram')"
					class="flex-1 bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
				>
					<font-awesome-icon icon="paper-plane" />
					Telegram
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
defineProps({
	show: Boolean,
	shareLink: String,
})

defineEmits(['close', 'copy-to-clipboard', 'share-by-email', 'share-to-telegram'])
</script>
