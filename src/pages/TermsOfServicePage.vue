<template>
  <div
    v-if="!!info && !loading"
    class="px-xl-35 px-sm-20 px-xs-5 px-md-25 px-lg-30 pb-20"
  >
    <div class="row mb-4">
      <div class="col">
        <h4>
          <strong>Условия использования</strong>
        </h4>
      </div>
    </div>
    <div class="column gap-15">
      <!-- <div class="row">
        <div class="col">
          <h6 class="mt-0 mb-10 bold">Контакты:</h6>
          <div class="mb-5">
            Фактический адрес: 105318, г. Москва, Семёновская пл., д. 7, корп.
            17
          </div>
          <div>Телефон: 8 (926) 094-91-22</div>
        </div>
      </div> -->
      <div class="row">
        <div class="row full-width">
          <h6 class="mt-0 mb-10 bold">Реквизиты:</h6>
          <div class="row full-width">
            <div
              v-for="(el, index) in info.legal_entities"
              :key="index"
              class="column col-7 gap-5 mb-10"
            >
              <q-separator class="divider-color" v-if="index" />
              <div>{{ el.name || ' -' }}</div>
              <div>ИНН: {{ el.code || ' -' }}</div>
              <div>КПП: {{ el.registration_code || ' -' }}</div>
              <div>Юридический адрес: {{ el.legal_address || ' -' }}</div>
              <div>Тел.: {{ el.contact_phone || ' -' }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="column gap-5">
          <h6 class="mt-0 mb-10 bold">Способы оплаты:</h6>
          <div>Банковской картой</div>
          <div>
            Для выбора оплаты товара с помощью банковской карты на
            соответствующей странице необходимо выбрать способ оплаты "онлайн" и
            нажать кнопку
            <span class="bold"> Перейти к оплате</span>. Оплата происходит через
            ООО "ПЭЙСЕЛЕКШН" с использованием банковских карт следующих
            платёжных систем:
          </div>
          <div class="row full-width justify-evenly my-15">
            <img
              style="object-fit: contain"
              width="150px"
              src="~assets/psMir.png"
            />
            <img
              style="object-fit: contain"
              width="150px"
              src="~assets/psVisa.png"
            />

            <img
              style="object-fit: contain"
              width="150px "
              src="~assets/psMasterCard.png"
            />

            <img
              style="object-fit: contain"
              width="150px "
              src="~assets/psJCB.svg"
            />
          </div>
          <div>
            Для оплаты (ввода реквизитов Вашей карты) Вы будете перенаправлены
            на платёжный шлюз ООО "ПЭЙСЕЛЕКШН". Соединение с платёжным шлюзом и
            передача информации осуществляется в защищённом режиме с
            использованием протокола шифрования SSL. В случае если Ваш банк
            поддерживает технологию безопасного проведения интернет-платежей
            Verified By Visa, MasterCard SecureCode, MIR Accept, J-Secure, для
            проведения платежа также может потребоваться ввод специального
            пароля.
          </div>
          <div class="mb-10">
            Настоящий сайт поддерживает 256-битное шифрование.
            Конфиденциальность сообщаемой персональной информации обеспечивается
            ООО "ПЭЙСЕЛЕКШН". Введённая информация не будет предоставлена
            третьим лицам за исключением случаев, предусмотренных
            законодательством РФ. Проведение платежей по банковским картам
            осуществляется в строгом соответствии с требованиями платёжных
            систем МИР, Visa Int., MasterCard Europe Sprl, JCB.
          </div>
          <div>
            Если заказ был отменен или не принят по другим причинам, то денежные
            средства возвращаются на счет покупателя.Возврат переведённых
            средств, производится на ваш банковский счёт в течение 5-30 рабочих
            дней (срок зависит от банка, который выдал вашу банковскую карту).
          </div>
        </div>
      </div>
      <div class="row">
        <div class="column gap-5">
          <h6 class="mt-0 mb-3 bold">Условия предзаказа товара:</h6>
          <ol class="column gap-5">
            <li>Услугой предзаказа можно воспользоваться на сайте заведения</li>
            <li>
              Вы можете выбрать любое блюдо доступное для заказа в меню на
              сайте.
            </li>
            <li>
              Количество продукции ограничено (все блюда готовятся только из
              свежих продуктов, поэтому количество некоторых блюд может быть
              ограничено). При отсутствии возможности приготовить заказанное
              блюдо, гостю предоставляется альтернативный продукт или
              возвращаются деньги.
            </li>
          </ol>
        </div>
      </div>

      <div class="row">
        <div class="column gap-5">
          <h6 class="mt-0 mb-0 bold">
            Перечень Кафе, предоставляющих услугу предзаказов:
          </h6>
          <ul class="gap-5 column">
            <li v-for="(el, index) in info.sales_points" :key="index">
              {{ el.address }}
            </li>
          </ul>
        </div>
      </div>
      <div>
        <h6 class="my-0 bold">Документы:</h6>
        <div class="row no-wrap items-center gap-5 mt-10 ml-5">
          <q-icon size="26px" name="fal fa-file-powerpoint" />
          <a
            :href="linkToPolicy"
            target="_blank"
            class="my-0"
            style="font-size: 17px"
            >Политика в отношении обработки персональных данных</a
          >
        </div>
      </div>
    </div>
  </div>
  <div v-if="loading" class="absolute-center items-center justify-center flex">
    <q-spinner-puff color="accent1" size="20%" />
  </div>
</template>
<script lang="ts" setup>
import { TermsOfServiceInfo } from 'src/models/companyGroup/companyGroup'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const info = ref<TermsOfServiceInfo | null>(null)
const loading = ref(false)
const route = useRoute()

const linkToPolicy = computed(() => {
  return `http://${window.location.host}/${String(
    route.params.externalId
  )}/policy`
})

onMounted(async () => {
  loading.value = true
  const res = await companyGroupRepo.getTermsOfServiceInfo(
    String(route.params.externalId)
  )
  info.value = res

  loading.value = false
})
</script>
