export interface CommunityStatus {
    status: [
        active?: string,
        archived?: string,
        pending?: string,
        suspended?: string
    ];
}

export interface CommunityPrivilegeActions {
    create: boolean;
    update: boolean;
    delete: boolean;
    read: boolean;
}

export interface CommunityPrivilegeCategories {
    community: CommunityPrivilegeActions;
    event: CommunityPrivilegeActions;
    challenge: CommunityPrivilegeActions;
}

export interface CommunityPrivileges {
    owner?: CommunityPrivilegeCategories;
    member?: CommunityPrivilegeCategories;
}

export interface CommunityColumnsDashboard {
    key: string;
    label?: string;
}

export interface CommunityMetadata {
    project_spaces: boolean
}

export interface Community {
    _id: number;
    acronym: string;
    logo: string;
    links: Array<string>;
    status: CommunityStatus;
    community_contact_ids: Array<string>;
    to: string;
    _metadata: CommunityMetadata,
    privileges?: string;
    actions?: Array<CommunityPrivileges>;
}