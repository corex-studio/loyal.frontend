import { SchemeRaw, Section, SectionRaw } from './section';
import BaseRepo from 'src/corexModels/apiModels/baseRepo';
import { sectionApi } from './sectionApi';
import { reactive } from 'vue';
import { ImageRaw } from '../image/image';
import { cloneDeep } from 'lodash';

export class SectionRepo extends BaseRepo<Section> {
  api = sectionApi;
  sections: Section[] = [];
  lastViewed: Section | null = null;

  async addBackgroundImage(
    sectionUuid: string,
    image: string | Blob
  ): Promise<ImageRaw> {
    const formData: FormData = new FormData();
    formData.append('image', image);
    formData.append('main_image', String(true));
    return await this.api.addBackgroundImage(sectionUuid, formData);
  }

  async setScheme(data: SchemeRaw) {
    const newData: any = cloneDeep(data);
    newData.figures.forEach((v: any) =>
      v.table
        ? (v.table.images = v.table.images.map((el: any) => el.uuid))
        : void 0
    );
    const res: SchemeRaw = await this.api.send({
      method: 'POST',
      action: 'set_scheme',
      id: this.item?.id,
      data: newData,
    });
    return res;
  }

  async createSection(data: {
    sales_point: string;
    name: string;
  }): Promise<Section> {
    const res: SectionRaw = await this.api.send({
      method: 'POST',
      action: '',
      data,
    });
    return new Section(res);
  }

  async setSorting(ids: string[]): Promise<Section[]> {
    const res: {
      results: SectionRaw[];
    } = await this.api.send({
      method: 'POST',
      action: 'set_sorting',
      data: {
        objects: ids,
      },
    });
    return res.results.map((v) => new Section(v));
  }
}

export const sectionRepo = reactive(new SectionRepo());
