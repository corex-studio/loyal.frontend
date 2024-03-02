import { setApp } from 'yandex-metrika-vue3'
import { boot } from 'quasar/wrappers'

export default boot(({ app }) => {
  // @ts-ignore
  app.use(setApp, undefined)
  // {
  //   id: null,
  //     router: router,
  //   env: process.env.NODE_ENV,
  //   scriptSrc: 'https://mc.yandex.ru/metrika/tag.js',
  //   debug: true,
  //   options: {
  //   webvisor: true,
  //     clickmap: true,
  //     trackLinks: true,
  //     accurateTrackBounce: true,
  //     defer: true,
  // },
  //   // other options
  // }
})
