import type { CommunityPrivileges } from './communities';

export interface EventDates {
  benchmark_start?: string;
  benchmark_stop?: string;
  creation?: string;
  modification?: string;
}

export interface EventColumnsDashboard {
  key: string;
  label?: string;
}

export interface Event {
  _id: number;
  name?: string;
  url?: string;
  community_id: string;
  bench_contact_ids?: Array<string>;
  dates?: EventDates;
  to?: string;
  privileges?: string;
  orig_id?: string;
  _schema?: string;
  references?: Array<string>;
  actions?: Array<CommunityPrivileges>;
  is_automated?: boolean;
}
