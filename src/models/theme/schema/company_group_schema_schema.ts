export type OrderThemeRedirectSchema = {
  link: string | null
  label: string | null
}

export type OrderThemeSchema = {
  redirect: OrderThemeRedirectSchema[]

}

export type CompanyGroupThemeSchema = {
  order: OrderThemeSchema | null
}
