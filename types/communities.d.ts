export interface CommunityStatus {
  status: [active?: string, archived?: string, pending?: string, suspended?: string];
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
  project_spaces: boolean;
  project_summary?: string;
}

export interface Community {
  _id: string;
  name: string;
  acronym?: string;
  logo?: string;
  links?: Array<string>;
  keywords?: Array<string>;
  description?: string;
  status: CommunityStatus;
  community_contact_ids?: Array<string>;
  to?: string;
  _metadata: CommunityMetadata;
  privileges?: string;
  actions?: Array<CommunityPrivileges>;
}

export interface CommunityPrivileges {
  _id: string;
  roles: string[];
}

export interface UserCommunityRoles {
  label: string;
  value: string;
}

export interface UserCommunityPrivilege {
  community: string;
  role: UserCommunityRoles;
}
