// TO TS
import type { CommunityPrivileges } from "../types/privileges";
export const privileges: CommunityPrivileges = {
  owner: {
    community: {
      create: false,
      update: true,
      delete: false,
      read: true,
    },
    event: {
      create: true,
      update: true,
      delete: true,
      read: true,
    },
    challenge: {
      create: true,
      update: true,
      delete: true,
      read: true,
    },
  },
  manager: {
    community: {
      create: false,
      update: false,
      delete: false,
      read: true,
    },
    event: {
      create: false,
      update: true,
      delete: false,
      read: true,
    },
    challenge: {
      create: false,
      update: true,
      delete: false,
      read: true,
    },
  },
  guest: {
    community: {
      create: false,
      update: false,
      delete: false,
      read: true,
    },
    event: {
      create: false,
      update: false,
      delete: false,
      read: true,
    },
    challenge: {
      create: false,
      update: false,
      delete: false,
      read: true,
    },
  },
  anyone: {
    community: {
      create: false,
      update: false,
      delete: false,
      read: true,
    },
    event: {
      create: false,
      update: false,
      delete: false,
      read: true,
    },
    challenge: {
      create: false,
      update: false,
      delete: false,
      read: true,
    },
  },
  admin: {
    community: {
      create: true,
      update: true,
      delete: true,
      read: true,
    },
    event: {
      create: true,
      update: true,
      delete: true,
      read: true,
    },
    challenge: {
      create: true,
      update: true,
      delete: true,
      read: true,
    },
  },
};
