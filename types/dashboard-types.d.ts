export interface CommunityObjLink {
	uri: string;
	label?: string;
	comment?: string;
}

export interface CommunityObject {
	_id: string;
	_schema?: string;
	_metadata?: Record<string, unknown> | '';
	_provenance?: string;
	acronym: string;
	name: string;
	description: string;
	status: string;
	community_contact_ids?: string[];
	keywords?: string[];
	links?: CommunityObjLink[];
}

export interface CommunityRequestBody {
	_id?: string;
	_schema?: string;
	name?: string;
	acronym?: string;
	status?: string;
	community_contact_ids?: string[];
	description?: string;
	keywords?: { uri: string }[];
	links?: CommunityObjLink[];
}

export interface ContactOption {
	id: string;
	name: string;
}
