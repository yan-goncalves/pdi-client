export type BaseType = {
  id: number
  createdAt: Date
  updatedAt: Date
}

export type ButtonApiProps = {
  label: string
  loadingLabel?: string | null
}

export type TextFieldApiProps = {
  labelPlaceholder: string
}

export type ImageApiProps = {
  url: string
  alternativeText: string
}
