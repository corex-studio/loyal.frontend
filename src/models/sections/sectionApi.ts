import { SectionRaw, Section } from './section'
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi'
import { AxiosResponse } from 'axios'
import { api } from 'src/boot/axios'
import { ImageRaw } from '../image/image'

export class SectionApi extends BaseModelApi<Section> {
  routeName = 'sections'
  fromJson = (json: SectionRaw) => new Section(json)

  async addBackgroundImage(
    sectionUuid: string,
    formData: FormData
  ): Promise<ImageRaw> {
    const res: AxiosResponse<ImageRaw> = await api.post(
      `${this.routeName}/${sectionUuid}/add_image/`,
      formData
    )
    return res.data
  }
}

export const sectionApi = new SectionApi()
