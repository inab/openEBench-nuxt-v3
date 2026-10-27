export interface LinkItem {
	label?: string;
	comment?: string;
	uri?: string;
	url?: string;
	[key: string]: unknown;
}

export interface ChallengeRow {
	_id: string;
	acronym?: string;
	name?: string;
	[key: string]: unknown;
}

export interface EventWithChallenges {
	_id: string;
	name: string;
	url?: string;
	challenges?: ChallengeRow[];
	[key: string]: unknown;
}

export interface CommunityReference {
	href?: string;
	doi?: string;
	[key: string]: unknown;
}

export interface ChallengeApiResponse {
	data: unknown;
}

export interface CommunityDetail {
	_id?: string;
	name?: string;
	acronym?: string;
	description?: string;
	logo?: string;
	keywords?: string[];
	links?: LinkItem[];
}

export interface TabItem {
	key?: string;
	label?: string;
	[key: string]: unknown;
}

export interface MenuItem {
	label?: string;
	[key: string]: unknown;
}

export interface GraphVisualization {
	type?: string;
	schema_url?: string | null;
	metric?: string;
	optimization?: string | null;
	x_axis?: string;
	y_axis?: string;
	axes_scale?: string;
	available_metrics?: unknown;
	dates?: unknown;
}

export interface GraphParticipant {
	tool_id?: string;
	metric_value?: number;
	stderr?: number | null;
	metric_x?: number;
	stderr_x?: number;
	metric_y?: number;
	stderr_y?: number;
	label?: string;
	value?: number;
	error?: number;
}

export interface GraphData {
	_id?: string;
	key: string;
	name?: string;
	label: string;
	dates?: unknown;
	dataset_contact_ids?: unknown;
	data?: { dates?: unknown; dataset_contact_ids?: unknown[]; [key: string]: unknown };
	visualization?: GraphVisualization;
	inline_data?: {
		challenge_participants?: GraphParticipant[];
		visualization?: GraphVisualization;
	};
	challenge_participants?: GraphParticipant[];
	[key: string]: unknown;
}

export interface GraphMetric {
	_id: string;
	_metadata?: Record<string, unknown>;
	title?: string;
	metrics_label?: string;
	orig_id?: string;
	optimization?: string;
	[key: string]: unknown;
}

export interface ChallengeInfo {
	_id: string | number;
	acronym: string;
	name: string;
	challenge_label: string;
	[key: string]: unknown;
}

export interface InlineData {
	value?: number;
	error?: number;
	hide?: boolean;
	[key: string]: unknown;
}

export interface DatalinkInfo {
	uri?: string;
	inline_data?: InlineData | string;
	[key: string]: unknown;
}

export interface ChallengeDataset {
	_id: string;
	datalink?: DatalinkInfo;
	datalinks?: DatalinkInfo[];
	[key: string]: unknown;
}

export interface ParticipantAssessment {
	dates?: unknown;
	_metadata?: Record<string, string>;
	depends_on: { metrics_id?: unknown };
	datalink?: { inline_data?: InlineData };
	[key: string]: unknown;
}

export interface ChallengeParticipant {
	_id: string;
	participant_label: string;
	datalink?: DatalinkInfo;
	assessments: ParticipantAssessment[];
	[key: string]: unknown;
}

export interface RadarEntry {
	key: string;
	value?: number;
	error?: number;
	label?: string;
}

export interface ParticipantRadarItem extends GraphData {
	inline_data: {
		challenge_participants: RadarEntry[];
		visualization: GraphVisualization;
	};
}

export interface MetricsTable {
	participants: ChallengeParticipant[];
	metrics: GraphMetric[];
	dataMatrix: Array<Array<InlineData | null | undefined>>;
}
