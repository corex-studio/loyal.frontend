<template>
  <div
    :style="`border: 1px #${$uiSettings.item?.secondaryColor.color} solid`"
    class="pa-10 border-radius mt-lg-15 mt-md-12 mt-xs-8 gap-10 column"
  >
    <div class="column full-width items-center gap-5">
      <div class="bold header3">Оплата заказа</div>
      <div class="body text-center">
        Потоврная попытка оплаты будет доступна через 0:{{
          currentSecond < 10 ? '0' + currentSecond : currentSecond
        }}
      </div>
    </div>
    <div class="progress-line-parent">
      <div :style="`width: ${progressLineWidth}`" class="progress-line"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'

const emit = defineEmits<{
  (evt: 'done'): void
}>()

const currentSecond = ref(0)
let timer: NodeJS.Timeout | null = null
const startTimer = () => {
  timer = setInterval(() => {
    if (currentSecond.value < 30) {
      currentSecond.value += 1
    } else {
      if (timer) {
        clearInterval(timer)
        timer = null
      }
      emit('done')
    }
  }, 1000)
}

const progressLineWidth = computed(() => {
  return `${(currentSecond.value / 30) * 100}%`
})

onMounted(() => {
  startTimer()
})
</script>

<style lang="scss" scoped>
.progress-line-parent {
  height: 8px;
  width: 100%;
  background-color: var(--backing-color);
  border-radius: 12px;
  overflow: hidden;
}

.progress-line {
  background-color: var(--primary);
  height: inherit;
  z-index: 10;
  transition: width 0.5s ease;
}
</style>
