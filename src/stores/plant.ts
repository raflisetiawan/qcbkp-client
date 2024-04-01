import { defineStore } from 'pinia';
import { useApiWithAuthorization } from 'src/composables/api';
import { EditedPlant, Plant, PlantForm, PlantSelect } from 'src/types/plant';

export const usePlantStore = defineStore('plant', {
  state: () => ({
    plants: [] as Plant[],
    addPlantDialog: false,
    editPlantDialog: false,
    editedPlant: {} as EditedPlant,
  }),

  actions: {
    async setPlant() {
      const response = await useApiWithAuthorization.get('manage-plant');
      this.plants = response.data.data;
    },
    async addPlant(data: PlantForm) {
      await useApiWithAuthorization.post('manage-plant', data);
      await this.setPlant();
    },

    toggleAddPlantDialog(): void {
      this.addPlantDialog = !this.addPlantDialog;
    },
    toggleEditPlantDialog(): void {
      this.editPlantDialog = !this.editPlantDialog;
    },

    setEditedPlant(plantData: EditedPlant) {
      this.editedPlant.id = plantData.id;
      this.editedPlant.name = plantData.name;
      this.editedPlant.description = plantData.description;
    },

    async deletePlant(id: number) {
      await useApiWithAuthorization.delete(`manage-plant/${id}`);
      await this.setPlant();
    },
    async updatePlant(data: EditedPlant) {
      await useApiWithAuthorization.patch(`manage-plant/${data.id}`, data);
      await this.setPlant();
    },

    async getAllPlant(): Promise<PlantSelect[]> {
      const response = await useApiWithAuthorization.get('plants/all');
      return response.data.data;
    },
  },
});
