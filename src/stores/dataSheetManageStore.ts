import { defineStore } from 'pinia';

export interface DataSheet {
  id: number;
  title: string;
  submitter: string;
  submissionDate: string;
  status: '제출됨' | '승인됨' | '반려됨';
  content: string;
  rejectionReason?: {
    groups: string[];
    reason: string;
    attachments?: string[];
  };
}

export const useDataSheetManageStore = defineStore('data-sheet-manage', {
  state: () => ({
    dataSheets: [
      { id: 1, title: '2024년 1분기 온실가스 배출량', submitter: '김철수', submissionDate: '2024-04-01', status: '제출됨', content: '1분기 온실가스 배출량 데이터입니다.' },
      { id: 2, title: '2023년 연간 에너지 사용량', submitter: '이영희', submissionDate: '2024-01-15', status: '승인됨', content: '2023년 연간 에너지 사용량 데이터입니다.' },
      { id: 3, title: '2024년 2분기 수자원 사용량', submitter: '박지성', submissionDate: '2024-07-10', status: '반려됨', content: '2분기 수자원 사용량 데이터입니다.', rejectionReason: { groups: ['group-a'], reason: '데이터 형식이 맞지 않습니다.', attachments: [] } },
      { id: 4, title: '2024년 1분기 폐기물 발생량', submitter: '안정환', submissionDate: '2024-04-05', status: '제출됨', content: '1분기 폐기물 발생량 데이터입니다.' },
    ] as DataSheet[],
  }),

  getters: {
    getDataSheetById: state => (id: number) => {
      return state.dataSheets.find(sheet => sheet.id === id);
    },
  },

  actions: {
    approveDataSheet(id: number) {
      const sheet = this.getDataSheetById(id);
      if (sheet) {
        sheet.status = '승인됨';
        // TODO: Send email
      }
    },
    rejectDataSheet(id: number, reason: { groups: string[]; reason: string; attachments?: string[] }) {
      const sheet = this.getDataSheetById(id);
      if (sheet) {
        sheet.status = '반려됨';
        sheet.rejectionReason = reason;
        // TODO: Send email
      }
    },
    // Add more actions as needed, e.g., updateDataSheet, deleteDataSheet
  },
});
