<template>
  <div 
    :class="[
      'bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-all duration-200',
      clickable ? 'hover:shadow-lg hover:scale-105 cursor-pointer' : 'hover:shadow-lg',
      loading ? 'animate-pulse' : ''
    ]"
    @click="handleClick"
  >
    <!-- Loading State -->
    <div v-if="loading" class="animate-pulse">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div class="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div class="h-3 bg-gray-300 rounded w-1/3"></div>
        </div>
        <div class="w-12 h-12 bg-gray-300 rounded-lg"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-4">
      <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
        <span class="text-red-500 text-xl">⚠️</span>
      </div>
      <p class="text-sm text-red-600 font-medium">{{ error }}</p>
      <button 
        v-if="onRetry"
        @click.stop="onRetry" 
        class="text-xs text-red-500 hover:text-red-700 mt-1 underline"
      >
        Coba lagi
      </button>
    </div>

    <!-- Normal State -->
    <div v-else>
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">{{ title }}</h3>
          <p class="text-3xl font-bold text-gray-900 mt-2">
            <CountUp :value="value" :duration="animationDuration" />
          </p>
          <div v-if="subtitle" class="text-sm text-gray-600 mt-1">{{ subtitle }}</div>
        </div>
        <div class="flex-shrink-0">
          <div 
            :class="[
              'w-12 h-12 rounded-lg flex items-center justify-center',
              iconColor || 'bg-blue-100'
            ]"
          >
            <span class="text-2xl">{{ icon }}</span>
          </div>
        </div>
      </div>
      
      <!-- Trend indicator -->
      <div v-if="trend" class="mt-4 flex items-center">
        <span 
          :class="[
            'text-sm font-medium flex items-center',
            trend.type === 'increase' ? 'text-green-600' : 'text-red-600'
          ]"
        >
          <svg 
            v-if="trend.type === 'increase'"
            class="w-4 h-4 mr-1" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
          <svg 
            v-else
            class="w-4 h-4 mr-1" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fill-rule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          {{ trend.value }}%
        </span>
        <span class="text-sm text-gray-500 ml-1">{{ trend.period || 'dari bulan lalu' }}</span>
      </div>

      <!-- Action button -->
      <div v-if="actionLabel" class="mt-4">
        <button 
          @click.stop="handleAction"
          class="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          {{ actionLabel }}
          <svg class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Component for animated counting
const CountUp = {
  props: ['value', 'duration'],
  setup(props) {
    const displayValue = ref(0)
    
    onMounted(() => {
      if (typeof props.value === 'number') {
        const target = props.value
        const duration = props.duration || 1000
        const increment = target / (duration / 16) // 60fps
        
        const timer = setInterval(() => {
          displayValue.value += increment
          if (displayValue.value >= target) {
            displayValue.value = target
            clearInterval(timer)
          }
        }, 16)
      } else {
        displayValue.value = props.value
      }
    })
    
    return () => typeof props.value === 'number' 
      ? Math.floor(displayValue.value).toLocaleString()
      : props.value
  }
}

const props = defineProps({
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
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  clickable: {
    type: Boolean,
    default: false
  },
  iconColor: {
    type: String,
    default: ''
  },
  actionLabel: {
    type: String,
    default: ''
  },
  animationDuration: {
    type: Number,
    default: 1000
  },
  onRetry: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['click', 'action'])

const handleClick = () => {
  if (props.clickable && !props.loading && !props.error) {
    emit('click')
  }
}

const handleAction = () => {
  emit('action')
}
</script>