import { defineStore } from 'pinia';
import { TrackRecord } from 'src/types/track-record';

export const useTrackRecordStore = defineStore('track-record', {
  state: () => ({
    track_records: [] as TrackRecord[] | [],
    showEditTrackTecordDialog: false,
    editedIssue: 0 as number,
    showDiscoveryFileDialog: false,
    discoveryFileUrl: '',
  }),
});
