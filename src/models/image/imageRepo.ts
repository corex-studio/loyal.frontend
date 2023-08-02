import { Image, ImageRaw } from './image'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { imageApi } from './imageApi'
import { reactive } from 'vue'

export class ImageRepo extends BaseRepo<Image> {
  api = imageApi

  async addImage(image: string | Blob): Promise<ImageRaw> {
    const formData: FormData = new FormData()
    formData.append('image', image)
    return await this.api.addImage(formData)
  }

  async delete(obj?: Image | null): Promise<void> {
    if (!obj) throw Error('Object without id')
    return await this.api.send({
      method: 'POST',
      action: 'delete_image',
      id: obj?.id,
      data: {
        image: obj.id,
      },
    })
  }
}

export const imageRepo = reactive(new ImageRepo())
