import { defineStore } from 'pinia';
import { useApiWithAuthorization } from 'src/composables/api';
import { Memo } from 'src/types/memo';

export const useMemoStore = defineStore('memo', {
  state: () => ({
    memos: [] as Memo[],
    memosByIssueId: [] as Memo[],
    showAddMemoDialog: false,
    issue_id: 0,
    showEditMemoDialog: false,
    editedMemo: {} as Memo,
  }),

  actions: {
    async getMemos() {
      const response = await useApiWithAuthorization.get('memo');
      this.memosByIssueId = response.data.memos;
    },

    async setMemosByIssueId(issueId: string | number | string[] | undefined) {
      const response = await useApiWithAuthorization.get(`memo/${issueId}`);
      this.memos = response.data.memos;
    },

    async addMemo(data: Memo) {
      await useApiWithAuthorization.post('memo', data);
      await this.getMemos();
    },

    async getMemoByIssueId(issueId: string | string[]) {
      const response = await useApiWithAuthorization.get(`memo/${issueId}`);
      return response.data.memos;
    },

    async updateMemo(data: Memo) {
      await useApiWithAuthorization.patch(`memo/${data.id}`, data);
      await this.setMemosByIssueId(data.issue_id);
    },

    async deleteMemo(data: Memo) {
      await useApiWithAuthorization.delete(`memo/${data.id}`);
      await this.setMemosByIssueId(data.issue_id);
    },
  },
});
