import { defineStore } from 'pinia';
import { useApiWithAuthorization } from 'src/composables/api';
import {
  AddIssueForm,
  Issue,
  EditedIssue,
  IssueWithQualityIssue,
} from 'src/types/issue';

export const useIssueStore = defineStore('issue', {
  state: () => ({
    issues: [] as Issue[],
    filterDate: null as string | null | undefined | number,
    showFilterDateDialog: false,
    selectedPlant: null as string | null,
  }),
  getters: {
    getFilterDate: (state) => state.filterDate,
  },
  actions: {
    async initIssues() {
      if (this.filterDate) {
        const response = await useApiWithAuthorization.get('issue-by-date', {
          params: {
            date: this.filterDate,
            plant_id: this.selectedPlant,
          },
        });

        this.setIssues(response.data.issues);
      } else {
        const response = await useApiWithAuthorization.get('issue-by-date');
        this.setIssues(response.data.issues);
      }
    },
    async addIssue(data: AddIssueForm, user_id: number) {
      await useApiWithAuthorization.post(
        'issue',
        {
          ...data,
          plant_id: data.plant.value,
          user_id,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      await this.initIssues();
    },
    setIssues(issues: Issue[]) {
      this.issues = issues;
    },
    async deleteIssue(issueId: number) {
      await useApiWithAuthorization.delete(`issue/${issueId}`);
      await this.initIssues();
    },
    async updateIssue(data: EditedIssue) {
      await useApiWithAuthorization.post(
        `issue/${data.id}`,
        {
          ...data,
          plant_id: data.plant.value,
          _method: 'PATCH',
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      await this.initIssues();
    },

    async getIssueDateById(id: string | string[]) {
      const response = await useApiWithAuthorization.get(
        `issue/${id}/issue-date`
      );
      this.filterDate = response.data.issue_date;
    },

    async getIssueWithQualityIssueById(
      id: string | string[]
    ): Promise<IssueWithQualityIssue> {
      const response = await useApiWithAuthorization.get(
        `issue/${id}/quality-issue`
      );
      return response.data.issue;
    },

    async getIssueWithQuality(date: string) {
      const response = await useApiWithAuthorization.get(
        'issues-with-quality',
        {
          params: { date },
        }
      );

      return response.data.issues;
    },
  },
});
