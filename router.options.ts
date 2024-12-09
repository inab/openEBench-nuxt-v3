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
    name: "dashboard-community",
    path: "/dashboard/entries/:id/edit",
    file: resolve(__dirname, "pages/dashboard/entries/[id].vue"),
  },
  {
    name: "dashboard-community",
    path: "/dashboard/entries/add",
    file: resolve(__dirname, "pages/dashboard/entries/add.vue"),
  },
  {
    name: "dashboard-community-events",
    path: "/dashboard/entries/:community_id/events/:id",
    file: resolve(__dirname, "pages/dashboard/entries/events/[id].vue"),
  },
  {
    name: "dashboard-community-event-add",
    path: "/dashboard/entries/:community_id/events/add",
    file: resolve(__dirname, "pages/dashboard/entries/events/add.vue"),
  },
  {
    name: "dashboard-community-event-community-add",
    path: "/dashboard/entries/:community_id/events/:event_id/add",
    file: resolve(
      __dirname,
      "pages/dashboard/entries/events/challenges/add.vue",
    ),
  },
  {
    name: "dashboard-community-event-community",
    path: "/dashboard/entries/:community_id/events/:event_id/challenges/:id",
    file: resolve(
      __dirname,
      "pages/dashboard/entries/events/challenges/[id].vue",
    ),
  },
  {
    name: "dashboard-community-event-community-metric",
    path: "/dashboard/entries/:community_id/events/:event_id/challenges/:id/metrics/add",
    file: resolve(
      __dirname,
      "pages/dashboard/entries/events/challenges/metrics/add.vue",
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
];
