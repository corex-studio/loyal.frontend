import { initYandexMetrika } from 'yandex-metrika-vue3'
import { boot } from 'quasar/wrappers'

export default boot(({ app, router }) => {
  if (process.env.DEV) return
  app.use(initYandexMetrika, {
    id: '96523385',
    router: router,
    env: process.env.NODE_ENV,
    scriptSrc: 'https://mc.yandex.ru/metrika/tag.js',
    debug: false,
    options: {
      webvisor: true,
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      defer: true
    }
    // other options
  })
})
