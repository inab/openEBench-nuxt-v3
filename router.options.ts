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
    path: "/dashboard/communities/:id/edit",
    file: resolve(__dirname, "pages/dashboard/communities/[id].vue"),
  },
  {
    name: "dashboard-community",
    path: "/dashboard/communities/add",
    file: resolve(__dirname, "pages/dashboard/communities/add.vue"),
  },
  {
    name: "dashboard-community-events",
    path: "/dashboard/communities/:community_id/events/:id",
    file: resolve(__dirname, "pages/dashboard/communities/events/[id].vue"),
  },
  {
    name: "dashboard-community-event-add",
    path: "/dashboard/communities/:community_id/events/add",
    file: resolve(__dirname, "pages/dashboard/communities/events/add.vue"),
  },
  {
    name: "dashboard-community-event-community",
    path: "/dashboard/communities/:community_id/events/:event_id/challenges/:id",
    file: resolve(__dirname, "pages/dashboard/communities/events/challenges/[id].vue"),
  },
];