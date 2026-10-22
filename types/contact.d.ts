export interface Contact {
	_id: string;
	givenName: string;
	surname: string;
	fullName?: string;
	email: Array<string>;
	notes?: string | null;
	contactType?: string;
	contact_type?: string;
	community_ids?: Array<string>;
	initial_community_id?: string;
}
