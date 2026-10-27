export interface ChallengeCommonMetric {
	metrics_id?: string;
	tool_id?: string;
}

export interface ChallengeMetricCategory {
	category: string;
	description: string;
	metrics: ChallengeCommonMetric[];
}

export interface Metadata {
	'level_2:metric_id': string;
}

export interface Metric {
	_id: string;
	_schema: string;
	name?: string;
	title: string;
	description: string;
	metrics_contact_ids: string[];
	formal_definition?: string;
	references?: string[];
	orig_id: string;
	representation_hints?: Record<string, unknown>;
	optimization?: string;
	_metadata?: Metadata;
}

export interface Tool {
	_id: string;
	_schema: string;
	activation: string;
	description: string;
	is_automated: boolean;
	name?: string;
	references?: string[];
	status: string;
	tool_access?: string[];
	tool_contact_ids?: string[];
	community_ids?: string[];
	orig_id: string;
	registry_tool_id: string;
}

export interface MetricData {
	_id?: string;
	title: string;
	description: string;
	metrics_contact_ids: string[];
	formal_definition: string;
	references: string[];
	orig_id: string;
	_metadata: Record<string, string>;
	representation_hints?: Record<string, unknown>;
}
