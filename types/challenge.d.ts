import type { CommunityPrivileges } from "./communities";

export interface ChallengeDates {
  benchmark_start?: string;
  benchmark_stop?: string;
  creation?: string;
  modification?: string;
}

export interface ChallengeMetric {
  metrics_id?: string;
  tool_id?: string;
}

export interface ChallengeMetrics {
  category: string;
  description: string;
  metrics: Array<ChallengeMetric>;
}

export interface Challenge {
  _id: number;
  name?: string;
  acronym?: string;
  _schema?: string;
  benchmarking_event_id: string;
  challenge_contact_ids?: Array<string>;
  dates?: ChallengeDates;
  url?: string;
  orig_id?: string;
  references?: Array<string>;
  metrics_categories?: Array<string>;
  actions?: Array<CommunityPrivileges>;
}
