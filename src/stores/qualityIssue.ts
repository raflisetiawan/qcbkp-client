import { defineStore } from 'pinia';
import { useApiWithAuthorization } from 'src/composables/api';
import { Issue } from 'src/types/issue';
import {
  QualityIssue,
  QualityIssueForm,
  QualityIssueWithIssueAndUser,
} from 'src/types/qualityIssue';

export const useQualityIssueStore = defineStore('quality-issue', {
  state: () => ({
    /**
     * List of quality issues.
     *
     * @type {QualityIssue[]}
     */
    qualityIssues: [] as QualityIssue[],

    /**
     * Flag to control the visibility of the Add Quality Issue dialog.
     *
     * @type {boolean}
     */
    showAddQualityIssueDialog: false,

    /**
     * Flag to control the visibility of the Edit Quality Issue dialog.
     *
     * @type {boolean}
     */
    showEditQualityIssueDialog: false,

    /**
     * The Quality Issue being edited.
     *
     * @type {QualityIssue}
     */
    editedQualityIssue: {} as QualityIssue,

    issueOfQualityIssue: {} as Issue,
  }),

  actions: {
    /**
     * Fetches quality issues by issue ID.
     *
     * @param {string | string[]} id - The ID of the quality issue.
     * @returns {Promise<void>}
     */
    async getQualityIssueByIssueId(id: string | string[]): Promise<void> {
      const response = await useApiWithAuthorization.get(
        `quality-issues/${id}`
      );
      this.qualityIssues = response.data.quality_issues;
      this.issueOfQualityIssue = response.data.issue;
    },

    /**
     * Adds a new quality issue.
     *
     * @param {QualityIssueForm} data - The data for the new quality issue.
     * @returns {Promise<void>}
     */
    async addQualityIssue(data: QualityIssueForm): Promise<void> {
      const now = new Date();
      const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');
      await useApiWithAuthorization.post('quality-issue', {
        ...data,
        closed_date: formattedDate,
      });
      await this.getQualityIssueByIssueId(data.issue_id);
    },

    /**
     * Deletes a quality issue by ID.
     *
     * @param {number} id - The ID of the quality issue.
     * @param {string | string[]} issue_id - The ID of the issue.
     * @returns {Promise<void>}
     */
    async deleteQualityIssue(
      id: number,
      issue_id: string | string[]
    ): Promise<void> {
      await useApiWithAuthorization.delete(`quality-issue/${id}`);
      await this.getQualityIssueByIssueId(issue_id);
    },

    /**
     * Updates a quality issue.
     *
     * @param {QualityIssueForm} data - The updated data for the quality issue.
     * @returns {Promise<void>}
     */
    async updateQualityIssue(data: QualityIssueForm): Promise<void> {
      await useApiWithAuthorization.patch(`quality-issue/${data.id}`, data);
      await this.getQualityIssueByIssueId(data.issue_id);
    },

    async getQualityIssueById(
      id: string | string[]
    ): Promise<QualityIssueWithIssueAndUser> {
      const response = await useApiWithAuthorization.get(`quality-issue/${id}`);

      return response.data;
    },
  },
});
