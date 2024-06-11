<template>
  <div style="overflow-x: hidden" class="bg-black1 text-white pb-30">
    <div
      style="height: 100vh"
      class="c-container row items-center relative-position"
    >
      <q-img
        width="1400px"
        style="
          position: absolute;
          top: -10%;
          right: -39%;
          z-index: 0;
          opacity: 0.55;
        "
        src="assets/card.png"
      />
      <div>
        <div class="row full-width">
          <div class="huge col-7" style="z-index: 1">
            Омниканальная платформа для совершенствования опыта между гостем и
            рестораном <span style="color: #6138d3"> Loyalhub.</span>
          </div>
        </div>
        <div style="z-index: 10" class="mt-20 header3 relative-position">
          Платформа включает в себя ряд продуктов, позволяющих быстро запускать
          мобильные приложения лояльности и сайты, удобно работать с заказами,
          получать оцифрованные данные о гостях, использовать инструменты для
          увеличения среднего чека и лояльности гостей, настраивать
          push-уведомления и получать аналитику по их действиям.
        </div>
      </div>
    </div>
    <div class="c-container">
      <div class="huge mt-15">Функциональные характеристики ПО:</div>
      <div class="mt-15 header">Цели и назначения:</div>
      <div class="mt-10 subtitle-text">
        Loyalhub – это омниканальная платформа для совершенствования опыта между
        гостем и рестораном.
      </div>
      <div class="mt-10 subtitle-text">
        Платформа Loyalhub создана для представителей сегмента HoReCa. Она
        позволяет работать с различными каналами взаимодействия с гостями. Целью
        взаимодействия является увеличение лояльности гостей, сбор информации и
        управление полученными в результате работы данными, обеспечение обратной
        связи и автоматизация части бизнес-процессов с помощью цифровых решений.
      </div>
      <div class="header mt-20">Ключевые функции:</div>
      <ul class="pl-20 subtitle-text column gap-5 mt-8">
        <li>Создание и запуск брендированных мобильных приложений</li>
        <li>Создание и запуск сайтов</li>
        <li>Использование платежного сервиса</li>
        <li>Использование сервиса уведомлений СМС и PUSH</li>
        <li>Использование интерактивных тейбл-тентов</li>
        <li>Работа в CRM-системе</li>
        <li>Создание виртуальных карт лояльности</li>
        <li>Создание виртуального меню, доступного по QR-коду</li>
        <li>Использование Telegram-бота</li>
        <li>Сбор отзывов</li>
      </ul>
      <div class="row full-width gap-25 mt-30">
        <div class="col column no-wrap gap-15">
          <div class="huge3">Ссылки для скачивания файлов:</div>
          <div class="bordered-block header3 column gap-10">
            <a
              href="https://s3.timeweb.com/1f39f2f5-loyalhub/core/functional_characteristics.pdf"
              target="_blank"
              ><span class="primary-text pr-5">•</span> Функциональные
              характеристики ПО</a
            >
            <a
              href="https://s3.timeweb.com/1f39f2f5-loyalhub/core/description_of_processes.pdf"
              target="_blank"
              ><span class="primary-text pr-5">•</span> Описание процессов
              жизненного цикла</a
            >
            <a
              href="https://s3.timeweb.com/1f39f2f5-loyalhub/core/user_guide.pdf"
              target="_blank"
              ><span class="primary-text pr-5">•</span> Руководство
              пользователя</a
            >
            <a
              href="https://s3.timeweb.com/1f39f2f5-loyalhub/core/setup_instruction.pdf"
              target="_blank"
              ><span class="primary-text pr-5">•</span> Инструкция по
              установке</a
            >
          </div>
        </div>
        <div class="col column gap-15">
          <div class="huge3">Стоимость:</div>
          <div
            class="bordered-block header3 column no-wrap gap-10"
            style="background-color: #6138d3"
          >
            <div>6 000 рублей/точка (до 2 торговых точек)</div>
            <div>5 000 рублей/точка (2-4 торговых точки)</div>
            <div>4 000 рублей/точка (5-20 торговых точек)</div>
            <div>3 000 рублей/точка (более 20 торговых точек)</div>
            <div class="mt-5">
              Для точного подбора стоимости, оставьте заявку:
            </div>
            <div class="column pl-10 gap-8">
              <div class="row gap-5 items-center">
                <q-icon name="fa-regular fa-phone" />
                <a href="tel:+79003519050"> +7 (900) 351-90-50 </a>
              </div>
              <div class="row items-center gap-5">
                <q-icon name="fa-regular fa-envelope" />
                <a href="mailto:support@loyalhub.ru"> support@loyalhub.ru </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-30 column">
        <div class="huge3">Служба технической поддержки:</div>
        <div class="header3 mt-10">
          Телефон:<a href="tel:+79003519050"> +7 (900) 351-90-50</a>
        </div>
        <div class="header3 mt-6">
          Email: <a href="mailto:support@loyalhub.ru">support@loyalhub.ru</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup></script>

<style lang="scss" scoped>
.bordered-block {
  border-radius: 20px;
  padding: 30px;
  border: 1px #6138d3 solid;
}

.primary-text {
  color: #6138d3;
}
</style>
