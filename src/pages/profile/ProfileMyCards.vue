<template>
  <div
    style="max-width: 416px; width: 100%; height: fit-content"
    class="column px-5 bg-backing-color border-radius text-on-backing-color"
  >
    <div v-for="(el, index) in $paymentCard.items" :key="index">
      <q-separator v-if="index" />
      <div class="row full-width items-center no-wrap my-7 justify-between">
        <div class="row gap-3 items-center">
          <q-img
            v-if="el.type === CardType.VISA"
            width="34px"
            src="~assets/visa.svg"
          />
          <q-img
            v-if="el.type === CardType.MASTERCARD"
            width="32px"
            src="~assets/masterCard.svg"
          />

          <q-img
            v-if="el.type === CardType.MIR"
            width="32px"
            src="~assets/mir.svg"
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
            name="fa-solid fa-xmark"
            color="white"
          />
        </div>
      </div>
    </div>
  </div>
  <Pagination
    :loading="$paymentCard.loadings.list"
    class="px-10 mt-15 full-width"
    @update:modelValue="setPage($event)"
    @appendItems="setPage($event, true)"
    :page="$paymentCard.pagination.page"
    :last-page="$paymentCard.pagination.last_page"
  ></Pagination>
  <AcceptModal
    :model-value="acceptModal"
    @update:model-value="acceptModal = false"
    @accept="deleteCard()"
  />
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { paymentCardRepo } from 'src/models/customer/paymentCards/paymentCardRepo'
import {
  CardType,
  PaymentCard,
} from 'src/models/customer/paymentCards/paymentCard'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import AcceptModal from 'src/components/dialogs/AcceptModal.vue'
import { Notify } from 'quasar'
import Pagination from 'src/components/inputs/Pagination.vue'

const acceptModal = ref(false)

const cardToDelete = ref<PaymentCard | null>(null)

const loadCards = async (page = 1, appendItems = false) => {
  await paymentCardRepo.list(
    {},
    {
      page: page ? page : paymentCardRepo.pagination.page,
      appendItems: appendItems,
      pageSize: 10,
    }
  )
}

const setPage = async (page = 1, appendItems = false) => {
  await loadCards(page, appendItems)
}

onMounted(() => {
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
    Notify.create({
      message: 'Карта успешно удалена',
    })
    cardToDelete.value = null
  } catch {
    Notify.create({
      message: 'Ошибка при удалении карты',
      color: 'danger',
    })
    cardToDelete.value = null
  }
}
</script>
