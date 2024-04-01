import { defineStore } from 'pinia';
import { useApiWithAuthorization } from 'src/composables/api';
import { Information } from 'src/types/information';

export const useInformationStore = defineStore('information', {
  state: () => ({
    informations: [] as Information[],
    showAddInformationDialog: false,
    showEditInformationDialog: false,
    editedInformation: {} as Information,
  }),
  actions: {
    async setInformation(from?: string, to?: string) {
      const response = await useApiWithAuthorization.get('manage-information', {
        params: {
          start_date: from,
          end_date: to,
        },
      });
      this.informations = response.data.data;
    },
    async addInformation(data: Information) {
      await useApiWithAuthorization.post('manage-information', data);
      await this.setInformation();
    },

    async deleteInformation(id: number | undefined) {
      await useApiWithAuthorization.delete(`manage-information/${id}`);
      await this.setInformation();
    },

    async updateInformation(data: Information) {
      await useApiWithAuthorization.patch(
        `manage-information/${data.id}`,
        data
      );
      await this.setInformation();
    },

    async showInformation(id: string | string[]): Promise<Information> {
      const response = await useApiWithAuthorization.get(
        `manage-information/${id}`
      );
      return response.data.data;
    },
  },
});
