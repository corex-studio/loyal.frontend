import { QVueGlobals, useQuasar } from 'quasar'

export const isApple = (q?:QVueGlobals) => {
  // const q = useQuasar()
  if (!q) q = useQuasar()
  const is = q.platform.is
  return is.ios || is.ipad || is.iphone || is.ipod || is.mac || is.safari
}
