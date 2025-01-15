import { resolve } from "path";

export const customRoutes = [
  {
    name: "scientific-community",
    path: "/scientific/:community",
    file: resolve(__dirname, "pages/benchmarking/community"),
  },
  {
    name: "benchmarking-community",
    path: "/benchmarking/:community",
    file: resolve(__dirname, "pages/benchmarking/community"),
  },
  {
    name: "benchmarking-community-event",
    path: "/benchmarking/:community/events",
    file: resolve(__dirname, "pages/benchmarking/community/events"),
  },
  {
    name: "scientific-community-challenge",
    path: "/benchmarking/:community/:challenge",
    file: resolve(__dirname, "pages/benchmarking/community/challenge"),
  },
  {
    name: "scientific-community-challenge-participants",
    path: "/benchmarking/:community/:id/participants",
    file: resolve(
      __dirname,
      "pages/benchmarking/community/challenge/participants",
    ),
  },
  {
    name: "dashboard-community-edit",
    path: "/dashboard/projects_communities/:id/edit",
    file: resolve(__dirname, "pages/dashboard/projects_communities/[id].vue"),
  },
  {
    name: "dashboard-community-add",
    path: "/dashboard/projects_communities/add",
    file: resolve(__dirname, "pages/dashboard/projects_communities/add.vue"),
  },
  {
    name: "dashboard-community-events",
    path: "/dashboard/projects_communities/:community_id/events/:id",
    file: resolve(
      __dirname,
      "pages/dashboard/projects_communities/events/[id].vue",
    ),
  },
  {
    name: "dashboard-community-event-add",
    path: "/dashboard/projects_communities/:community_id/events/add",
    file: resolve(
      __dirname,
      "pages/dashboard/projects_communities/events/add.vue",
    ),
  },
  {
    name: "dashboard-community-event-community-add",
    path: "/dashboard/projects_communities/:community_id/events/:event_id/add",
    file: resolve(
      __dirname,
      "pages/dashboard/projects_communities/events/challenges/add.vue",
    ),
  },
  {
    name: "dashboard-community-event-community",
    path: "/dashboard/projects_communities/:community_id/events/:event_id/challenges/:id",
    file: resolve(
      __dirname,
      "pages/dashboard/projects_communities/events/challenges/[id].vue",
    ),
  },
  {
    name: "dashboard-community-event-community-metric",
    path: "/dashboard/projects_communities/:community_id/events/:event_id/challenges/:id/metrics/add",
    file: resolve(
      __dirname,
      "pages/dashboard/projects_communities/events/challenges/metrics/add.vue",
    ),
  },
  {
    name: "dashboard-contacts",
    path: "/dashboard/contacts",
    file: resolve(__dirname, "pages/dashboard/contacts"),
  },
  {
    name: "dashboard-contacts-add",
    path: "/dashboard/contacts/add",
    file: resolve(__dirname, "pages/dashboard/contacts/add.vue"),
  },
  {
    name: "dashboard-metrics",
    path: "/dashboard/metrics",
    file: resolve(__dirname, "pages/dashboard/metrics/index.vue"),
  },
  {
    name: "dashboard-metrics-id",
    path: "/dashboard/metrics/:id",
    file: resolve(__dirname, "pages/dashboard/metrics/[id].vue"),
  },
  {
    name: "dashboard-metrics-playground",
    path: "/dashboard/metrics-playground",
    file: resolve(__dirname, "pages/dashboard/metrics_playground/index.vue"),
  },
];
