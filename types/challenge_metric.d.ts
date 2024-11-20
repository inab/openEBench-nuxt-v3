export interface ChallengeCommonMetric {
  metrics_id?: string;
  tool_id?: string;
}

export interface Metadata {
  "level_2:metric_id": string;
}

export interface Metric {
  _id: string;
  _schema: string;
  title: string;
  description: string;
  metrics_contact_ids: string[];
  formal_definition?: string;
  references?: string[];
  orig_id: string;
  representation_hints?: string[];
  optimization?: string;
  _metadata?: Metadata;
}
