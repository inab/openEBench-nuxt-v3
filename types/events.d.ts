import { CommunityPrivileges } from './communities';

export interface EventDates {
    benchmark_start?	: string;
    benchmark_stop?	: string;
    creation?	    : string;
    modification?	: string;
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
    bench_contact?: Array<string>;
    dates?: EventDates;
    to?: string;
    privileges?: string;
    actions?: Array<CommunityPrivileges>;
}