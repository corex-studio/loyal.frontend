<template>
  <div
    v-if="currentCards.length"
    :style="$q.screen.xs ? '' : 'max-width: 416px;'"
    style="width: 100%; height: fit-content"
    class="column px-5 bg-backing-color border-radius text-on-backing-color"
  >
    <div v-for="(el, index) in currentCards" :key="index">
      <q-separator v-if="index" />
      <div class="row full-width items-center no-wrap my-7 justify-between">
        <div class="row gap-3 items-center">
          <q-img
            v-if="el.type === CardType.VISA"
            width="34px"
            src="assets/visa.svg"
          />
          <q-img
            v-if="el.type === CardType.MASTERCARD"
            width="32px"
            src="assets/masterCard.svg"
          />

          <q-img
            v-if="el.type === CardType.MIR"
            width="32px"
            src="assets/mir.svg"
          />
          <div class="column gap-8">
            <div class="body">{{ el.type }} ···· {{ el.endsWith }}</div>
          </div>
        </div>
        <div
          @click="selectCardToDelete(el)"
          style="width: 27px; height: 27px"
          class="rounded-100 bg-red row cursor-pointer"
        >
          <CIcon
            style="transform: translate(30%, 9%)"
            name="fa-regular fa-xmark"
            color="white"
          />
        </div>
      </div>
    </div>
  </div>
  <div
    v-else
    :style="$q.screen.xs ? '' : 'max-width: 416px;'"
    style="min-height: 224px"
    class="bg-backing-color text-on-backing-color border-radius box-shadow column no-wrap justify-center items-center gap-10"
  >
    <CIcon
      color="on-backing-color"
      name="fa-thin fa-rectangle-history-circle-plus"
      size="65px"
    />
    <div class="row full-width justify-center">
      <div class="header3 col-9" style="text-align: center">
        У вас нет сохраненных карт. <br />Вы можете сохранить карту во время
        оплаты заказа
      </div>
    </div>
  </div>

  <AcceptModal
    :model-value="acceptModal"
    @update:model-value="acceptModal = false"
    @accept="deleteCard()"
  />
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { paymentCardRepo } from 'src/models/customer/paymentCards/paymentCardRepo'
import {
  CardType,
  PaymentCard,
} from 'src/models/customer/paymentCards/paymentCard'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import AcceptModal from 'src/components/dialogs/AcceptModal.vue'
import { authentication } from 'src/models/authentication/authentication'
import { notifier } from 'src/services/notifier'

const acceptModal = ref(false)
const cardToDelete = ref<PaymentCard | null>(null)

const currentCards = computed(() => {
  return paymentCardRepo.items.filter((v) => v.active)
})

const loadCards = async (page = 1, appendItems = false) => {
  await paymentCardRepo.list(
    {
      active: true,
    },
    {
      page: page ? page : paymentCardRepo.pagination.page,
      appendItems: appendItems,
      pageSize: 'all',
    },
  )
}

onMounted(() => {
  if (!authentication.user) return
  void loadCards()
})

const selectCardToDelete = (v: PaymentCard) => {
  cardToDelete.value = v
  acceptModal.value = true
}

const deleteCard = async () => {
  if (!cardToDelete.value) return
  try {
    await paymentCardRepo.delete(cardToDelete.value)
    cardToDelete.value.active = false
    notifier.success('Карта успешно удалена')
    cardToDelete.value = null
  } catch {
    notifier.error('Ошибка при удалении карты')
    cardToDelete.value = null
  }
}
</script>
