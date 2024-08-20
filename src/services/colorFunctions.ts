export const getTextColorOnColor = (color?: string | null) => {
  if (!color) return undefined
  if (color.startsWith('#')) {
    color = colorHexToRgb(color)
  }

  const symbolsToReplace = ['rgb', 'rgba', '(', ')', ' ']
  symbolsToReplace.forEach((v) => (color = color?.replaceAll(v, '')))
  const rgbValues = color.split(',')
  const r = Number(rgbValues[0])
  const g = Number(rgbValues[1])
  const b = Number(rgbValues[2])
  const yiq = 0.299 * r + 0.587 * g + 0.114 * b
  return yiq >= 160 ? 'black' : 'white'
}

export const colorHexToRgb = (hex: string) => {
  hex = hex.replace(/^#/, '')
  let r, g, b
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16)
    g = parseInt(hex[1] + hex[1], 16)
    b = parseInt(hex[2] + hex[2], 16)
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16)
    g = parseInt(hex.substring(2, 4), 16)
    b = parseInt(hex.substring(4, 6), 16)
  }

  return `${r},${g},${b}`
}
