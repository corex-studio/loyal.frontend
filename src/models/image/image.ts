import { BaseModel } from 'src/corexModels/apiModels/baseModel'

export type ImageRaw = {
  uuid: string
  image: string
  thumbnail: string
  background_color: string
  created?: boolean
}

export class Image implements BaseModel {
  id: string
  image: string
  thumbnail: string
  background_color: string
  created?: boolean

  constructor(raw: ImageRaw) {
    this.id = raw.uuid
    this.image = raw.image
    this.thumbnail = raw.thumbnail
    this.background_color = raw.background_color
    this.created = raw.created
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
    }
  }
}
