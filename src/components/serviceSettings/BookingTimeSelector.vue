<template>
  <div class="column full-width gap-8 pl-1">
    <div class="subtitle-text">Время</div>

    <div class="row full-width gap-8 body">
      <div
        v-for="(el, index) in availableTimes?.slice(0, 4)"
        :key="index"
        @click="$emit('updated', el)"
        :class="{ 'time-element-selected': el === time }"
        class="px-9 py-6 border-radius cursor-pointer time-element"
      >
        {{ el }}
      </div>
      <div
        class="time-element row items-center border-radius px-9 py-6 gap-3 cursor-pointer"
        :class="{
          'time-element-selected':
            time && availableTimes?.slice(4).includes(time),
        }"
      >
        Другое время
        <CIcon size="20px" name="fa-regular fa-angle-down" />

        <q-menu v-model="menu" fit>
          <div ref="menuRef" class="column no-wrap full-width">
            <div
              v-for="(el, index) in totalDayTimes()"
              :class="[el, { 'bold ': el === time }]"
              :key="index"
              @click="selectTime(el)"
              :style="
                !availableTimes?.includes(el)
                  ? 'opacity: 0.5; cursor: not-allowed !important'
                  : ''
              "
              class="full-width body cursor-pointer pa-6 time-row"
            >
              {{ el }}
            </div>
          </div>
        </q-menu>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { AvailableHours } from 'src/models/carts/cart'
import { computed, ref, watch } from 'vue'
import CIcon from '../template/helpers/CIcon.vue'
import { getTimesBetween, totalDayTimes } from 'src/models/store'

const props = defineProps<{
  availableHours: AvailableHours | null
  time: string | null
}>()

const emit = defineEmits<{
  (evt: 'updated', val: string): void
}>()

const menuRef = ref<HTMLElement | null>()

const menu = ref(false)

watch(
  () => menu.value,
  (v) => {
    if (v) {
      setTimeout(() => {
        if (!availableTimes.value || !menuRef.value) return
        const foundTimeElement = menuRef.value.getElementsByClassName(
          availableTimes.value[0]
        )
        if (foundTimeElement) {
          foundTimeElement[0].scrollIntoView()
        }
      }, 0)
    }
  }
)

const selectTime = (v: string) => {
  if (availableTimes.value?.includes(v)) {
    emit('updated', v)
    menu.value = false
  }
}

const availableTimes = computed(() => {
  if (!props.availableHours) return
  return props.availableHours.today.flatMap((v) => {
    return getTimesBetween(v.start.slice(11, 16), v.end.slice(11, 16))
  })
})
</script>

<style lang="scss" scoped>
.time-element {
  border: 1px var(--secondary-button-color) solid;
  transition: background-color 0.4s ease-out;
}

.time-element:hover {
  background-color: var(--secondary-button-color);
  color: var(--on-secondary-button-color);
  transition: background-color 0.4s ease-out;
}

.time-element-selected {
  outline: 2px var(--primary) solid;
}
</style>
