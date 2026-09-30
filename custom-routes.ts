import { resolve } from 'path';

export const customRoutes = [
	{
		name: 'scientific-community',
		path: '/scientific/:community',
		file: resolve(__dirname, 'app/pages/benchmarking/community/index.vue'),
	},
	{
		name: 'benchmarking-community',
		path: '/benchmarking/:community',
		file: resolve(__dirname, 'app/pages/benchmarking/community/index.vue'),
	},
	{
		name: 'benchmarking-community-event',
		path: '/benchmarking/:community/events',
		file: resolve(__dirname, 'app/pages/benchmarking/community/events.vue'),
	},

	{
		name: 'scientific-community-challenge',
		path: '/scientific/:community/:challenge',
		file: resolve(__dirname, 'app/pages/benchmarking/community/challenge/index.vue'),
	},
	{
		name: 'benchmarking-community-challenge',
		path: '/benchmarking/:community/:challenge',
		file: resolve(__dirname, 'app/pages/benchmarking/community/challenge/index.vue'),
	},
	{
		name: 'scientific-community-challenge-participants',
		path: '/scientific/:community/:id/participants',
		file: resolve(__dirname, 'app/pages/benchmarking/community/challenge/participants.vue'),
	},
	{
		name: 'benchmarking-community-challenge-participants',
		path: '/benchmarking/:community/:id/participants',
		file: resolve(__dirname, 'app/pages/benchmarking/community/challenge/participants.vue'),
	},
	{
		name: 'dashboard-community-edit',
		path: '/dashboard/projects_communities/:id/edit',
		file: resolve(__dirname, 'app/pages/dashboard/projects_communities/[id].vue'),
	},
	{
		name: 'dashboard-community-add',
		path: '/dashboard/projects_communities/add',
		file: resolve(__dirname, 'app/pages/dashboard/projects_communities/add.vue'),
	},
	{
		name: 'dashboard-community-events',
		path: '/dashboard/projects_communities/:community_id/events/:id',
		file: resolve(__dirname, 'app/pages/dashboard/projects_communities/events/[id].vue'),
	},
	{
		name: 'dashboard-community-event-add',
		path: '/dashboard/projects_communities/:community_id/events/add',
		file: resolve(__dirname, 'app/pages/dashboard/projects_communities/events/add.vue'),
	},
	{
		name: 'dashboard-community-event-community-add',
		path: '/dashboard/projects_communities/:community_id/events/:event_id/add',
		file: resolve(
			__dirname,
			'app/pages/dashboard/projects_communities/events/challenges/add.vue'
		),
	},
	{
		name: 'dashboard-community-event-community',
		path: '/dashboard/projects_communities/:community_id/events/:event_id/challenges/:id',
		file: resolve(
			__dirname,
			'app/pages/dashboard/projects_communities/events/challenges/[id].vue'
		),
	},
	{
		name: 'dashboard-community-event-community-metric',
		path: '/dashboard/projects_communities/:community_id/events/:event_id/challenges/:id/metrics/add',
		file: resolve(
			__dirname,
			'app/pages/dashboard/projects_communities/events/challenges/metrics/add.vue'
		),
	},
	{
		name: 'dashboard-contacts',
		path: '/dashboard/contacts',
		file: resolve(__dirname, 'app/pages/dashboard/contacts/index.vue'),
	},
	{
		name: 'dashboard-contacts-add',
		path: '/dashboard/contacts/add',
		file: resolve(__dirname, 'app/pages/dashboard/contacts/add.vue'),
	},
	{
		name: 'dashboard-metrics',
		path: '/dashboard/metrics',
		file: resolve(__dirname, 'app/pages/dashboard/metrics/index.vue'),
	},
	{
		name: 'dashboard-metrics-id',
		path: '/dashboard/metrics/:id',
		file: resolve(__dirname, 'app/pages/dashboard/metrics/[id].vue'),
	},
	{
		name: 'dashboard-metrics-playground',
		path: '/dashboard/metrics-playground',
		file: resolve(__dirname, 'app/pages/dashboard/metrics_playground/index.vue'),
	},
	{
		name: 'dashboard-challenge-participate',
		path: '/dashboard/projects_communities/:community_id/events/:event_id/challenges/:challenge_id/participant',
		file: resolve(
			__dirname,
			'app/pages/dashboard/projects_communities/events/challenges/participant/index.vue'
		),
	},
	{
		name: 'dashboard-community-contribute',
		path: '/dashboard/contribute/:community_id',
		file: resolve(__dirname, 'app/pages/dashboard/contribute/[id].vue'),
	},
	{
		name: 'dashboard-users',
		path: '/dashboard/users',
		file: resolve(__dirname, 'app/pages/dashboard/users/index.vue'),
	},
	{
		name: 'dashboard-communications',
		path: '/dashboard/communications',
		file: resolve(__dirname, 'app/pages/dashboard/communications/index.vue'),
	},
	{
		name: 'dashboard-submission',
		path: '/dashboard/submission',
		file: resolve(__dirname, 'app/pages/dashboard/submission/index.vue'),
	},
	{
		name: 'dashboard-submission-list',
		path: '/dashboard/submission-list',
		file: resolve(__dirname, 'app/pages/dashboard/submission-list/index.vue'),
	},
];