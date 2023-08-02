import { ImageRaw, Image } from './image'
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi'
import { AxiosResponse } from 'axios'
import { api } from 'src/boot/axios'

export class ImageApi extends BaseModelApi<Image> {
  routeName = 'images'
  fromJson = (json: ImageRaw) => new Image(json)

  async addImage(formData: FormData): Promise<ImageRaw> {
    const res: AxiosResponse<ImageRaw> = await api.post(
      `${this.routeName}/`,
      formData
    )
    return res.data
  }
}

export const imageApi = new ImageApi()
