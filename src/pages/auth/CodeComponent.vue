<template>
  <div ref="block" class="row full-width justify-center no-wrap gap-10">
    <CInput
      @keydown="kek($event, 1)"
      :model-value="props.code.first"
      mask="#"
      :height="$q.screen.lt.md ? '44px' : '50px'"
      :width="$q.screen.lt.md ? '44px' : '50px'"
      class="input firstInput"
      :input-class="`${
        error ? 'text-danger' : 'text-on-input-color'
      } subtitle-text bold `"
      :class="
        error
          ? $uiSettings.item?.inputType === 'filled'
            ? 'error-input-filled'
            : 'error-input-outlined'
          : ''
      "
      outlined
      @update:model-value="updateFirstDigit"
    />
    <CInput
      @keydown="kek($event, 2)"
      :model-value="props.code.second"
      mask="#"
      :height="$q.screen.lt.md ? '44px' : '50px'"
      :width="$q.screen.lt.md ? '44px' : '50px'"
      class="input secondInput"
      :class="
        error
          ? $uiSettings.item?.inputType === 'filled'
            ? 'error-input-filled'
            : 'error-input-outlined'
          : ''
      "
      outlined
      :input-class="`${
        error ? 'text-danger' : 'text-on-input-color'
      } subtitle-text bold`"
      @update:model-value="updateSecondDigit"
    />
    <CInput
      @keydown="kek($event, 3)"
      :model-value="props.code.third"
      mask="#"
      :height="$q.screen.lt.md ? '44px' : '50px'"
      :width="$q.screen.lt.md ? '44px' : '50px'"
      class="input thirdInput"
      :class="
        error
          ? $uiSettings.item?.inputType === 'filled'
            ? 'error-input-filled'
            : 'error-input-outlined'
          : ''
      "
      outlined
      :input-class="`${
        error ? 'text-danger' : 'text-on-input-color'
      } subtitle-text bold`"
      @update:model-value="updateThirdDigit"
    />
    <CInput
      @keydown="kek($event, 4)"
      :model-value="props.code.fourth"
      mask="#"
      :height="$q.screen.lt.md ? '44px' : '50px'"
      :width="$q.screen.lt.md ? '44px' : '50px'"
      class="input fourthInput"
      :class="
        error
          ? $uiSettings.item?.inputType === 'filled'
            ? 'error-input-filled'
            : 'error-input-outlined'
          : ''
      "
      outlined
      :input-class="`${
        error ? 'text-danger' : 'text-on-input-color'
      } subtitle-text bold`"
      @update:model-value="updateFourthDigit"
    />
  </div>
</template>
<script lang="ts" setup>
import CInput from 'src/components/template/inputs/CInput.vue'
import { ref, onMounted } from 'vue'

const props = defineProps<{
  code: {
    first: string | null
    second: string | null
    third: string | null
    fourth: string | null
  }
  error?: boolean
}>()

const emit = defineEmits<{
  (
    evt: 'update',
    val: {
      first: string | null
      second: string | null
      third: string | null
      fourth: string | null
    }
  ): void
  (evt: 'logIn', val: boolean): void
}>()

const block = ref<HTMLDivElement>()

const firstInputRef = ref<HTMLInputElement>()

const secondInputRef = ref<HTMLInputElement>()

const thirdInputRef = ref<HTMLInputElement>()

const fourthInputRef = ref<HTMLInputElement>()

const setInputRef = () => {
  const inputs = block.value?.getElementsByTagName('input')

  if (inputs?.length) {
    firstInputRef.value = inputs[0]
    secondInputRef.value = inputs[1]
    thirdInputRef.value = inputs[2]
    fourthInputRef.value = inputs[3]
  }
}

const kek = (v: KeyboardEvent, inputNumber: number) => {
  setTimeout(() => {
    if (v.key === 'Backspace' || v.key === 'ArrowLeft') {
      if (inputNumber === 4) {
        thirdInputRef.value?.focus()
        thirdInputRef.value?.select()
      } else if (inputNumber === 3) {
        secondInputRef.value?.focus()
        secondInputRef.value?.select()
      } else if (inputNumber === 2) {
        firstInputRef.value?.focus()
        firstInputRef.value?.select()
      }
    } else if (v.key === 'ArrowRight') {
      inputNumber === 1
        ? (secondInputRef.value?.focus(), secondInputRef.value?.select())
        : inputNumber === 2
        ? (thirdInputRef.value?.focus(), thirdInputRef.value?.select())
        : inputNumber === 3
        ? (fourthInputRef.value?.focus(), fourthInputRef.value?.select())
        : void 0
    }
  }, 0)
}

const updateFirstDigit = (v: string | null) => {
  emit('update', { ...props.code, first: v })
  if (v) {
    secondInputRef.value?.focus()
    secondInputRef.value?.select()
  }
}

const updateSecondDigit = (v: string | null) => {
  emit('update', { ...props.code, second: v })
  if (v) {
    thirdInputRef.value?.focus()
    thirdInputRef.value?.select()
  }
}

const updateThirdDigit = (v: string | null) => {
  emit('update', { ...props.code, third: v })
  if (v) {
    fourthInputRef.value?.focus()
    fourthInputRef.value?.select()
  }
}

const updateFourthDigit = (v: string | null) => {
  emit('update', { ...props.code, fourth: v })
  setTimeout(() => {
    if (Object.values(props.code).every((v) => !!v?.length)) {
      emit('logIn', true)
    }
  }, 200)
}

onMounted(() => {
  setInputRef()
  firstInputRef.value?.focus()
})
</script>

<style lang="scss" scoped>
.input :deep(.q-field__native) {
  text-align: center;
}

.error-input-outlined :deep(.q-field--outlined .q-field__control:before) {
  border: 2px $danger solid !important;
}

.error-input-filled :deep(.q-field__control) {
  outline: 2px $danger solid !important;
}
</style>
