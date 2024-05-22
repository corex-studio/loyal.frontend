import { useQuasar } from 'quasar'

export const isApple = () => {
  const q = useQuasar()
  const is = q.platform.is
  return is.ios || is.ipad || is.iphone || is.ipod || is.mac || is.safari
}