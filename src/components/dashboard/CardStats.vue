<template>
  <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">{{ title }}</h3>
        <p class="text-3xl font-bold text-gray-900 mt-2">{{ value }}</p>
        <div v-if="subtitle" class="text-sm text-gray-600 mt-1">{{ subtitle }}</div>
      </div>
      <div class="flex-shrink-0">
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <span class="text-2xl">{{ icon }}</span>
        </div>
      </div>
    </div>
    
    <!-- Optional trend indicator -->
    <div v-if="trend" class="mt-4 flex items-center">
      <span 
        :class="[
          'text-sm font-medium',
          trend.type === 'increase' ? 'text-green-600' : 'text-red-600'
        ]"
      >
        <span v-if="trend.type === 'increase'">↗</span>
        <span v-else>↘</span>
        {{ trend.value }}%
      </span>
      <span class="text-sm text-gray-500 ml-1">dari bulan lalu</span>
    </div>
  </div>
</template>

<script setup>
// Define props untuk komponen
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  trend: {
    type: Object,
    default: null
    // Expected format: { type: 'increase'|'decrease', value: number }
  }
})
</script>

<style scoped>
/* Additional custom styles if needed */
.card-stats {
  @apply bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200;
}
</style>