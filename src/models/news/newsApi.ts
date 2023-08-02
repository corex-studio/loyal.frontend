import { api } from 'boot/axios'
import { AxiosResponse } from 'axios'
import { NewsRaw, News } from './news'
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi'
import { ImageRaw } from '../image/image'

export class NewsApi extends BaseModelApi<News> {
  routeName = 'news'
  fromJson = (json: NewsRaw) => new News(json)

  async setImage(newsUuid: string, formData: FormData): Promise<ImageRaw> {
    const res: AxiosResponse<ImageRaw> = await api.post(
      `${this.routeName}/${newsUuid}/add_image/`,
      formData
    )
    return res.data
  }

  async publish(newsUuid: string): Promise<News> {
    const res: AxiosResponse<NewsRaw> = await api.put(
      `${this.routeName}/${newsUuid}/publish/`
    )
    return new News(res.data)
  }
  async disable(newsUuid: string): Promise<News> {
    const res: AxiosResponse<NewsRaw> = await api.put(
      `${this.routeName}/${newsUuid}/disable/`
    )
    return new News(res.data)
  }
}

export const newsApi = new NewsApi()
