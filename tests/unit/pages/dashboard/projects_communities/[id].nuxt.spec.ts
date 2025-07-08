import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import Edit from "@/pages/dashboard/projects_communities/[id].vue";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";
import CommunityEdit from "@/components/Dashboard/entries/CommunityEdit.vue";
import { useUser } from "@/stores/user.ts";
import { privileges } from "@/constants/privileges";
import { ref } from "vue";
import { mockDashboardLinks } from "@/test/mocks/dashboardMoks";

vi.mock("@/middleware/auth", () => ({
  default: vi.fn((context) => {
    const { auth } = context;
    if (
      !auth ||
      (auth.authenticatedOnly && context.auth.status === "unauthenticated")
    ) {
      context.redirect("/login-required");
    }
  }),
}));

describe("Dashboard Edit entry", () => {
  let wrapper;
  let userStore;
  
  beforeEach(() => {
    wrapper = mount(Edit, {
      global: {
        mocks: {
          communityId: ref("OEBC000"),
          loadingData: ref(false),
          communityData: ref({
            id: "1",
            name: "Community A",
            description: "Description of Community A",
            links: mockDashboardLinks,
            status: "active",
            keywords: ["test", "community"],
            community_contact_ids: ["test.test1", "test.test2"],
          }),
          communityPrivileges: ref({
            community: {
              create: false,
              update: true,
              delete: false,
              read: true,
            },
          }),
          isView: ref(false),
          communityEvents: ref([
            { id: "1", name: "Event A" },
            { id: "2", name: "Event B" },
          ]),
          isLoadingEvents: ref(false),
          privilegesType: ref("community"),
          tabIndex: ref("0"),
          $route: {
            params: { id: "OEBC000" }, // ✅ Simular ID en el test
          },
        },
        plugins: [
          createTestingPinia({
            initialState: {
              user: {
                getUserCommunitiesRoles: [],
              },
            },
            createSpy: vi.fn,
          }),
        ],
        stubs: ["RouterLink", "FontAwesomeIcon"],
      },
    });

    userStore = useUser();
  });

  it("renders BreadcrumbsBar and CommunityEdit components", () => {
    expect(wrapper.findComponent(BreadcrumbsBar).exists()).toBe(true);
    expect(wrapper.findComponent(CommunityEdit).exists()).toBe(true);
  });

  it("should initialize routeArray correctly", () => {
    wrapper.vm.routeName = "Edit";

    const expectedRoutes = [
      { label: "", isActualRoute: false },
      { label: "Dashboard", isActualRoute: false, route: "/dashboard" },
      {
        label: "Projects & Communities",
        isActualRoute: false,
        route: "/dashboard/projects_communities",
      },
      { label: "Edit", isActualRoute: true },
    ];
    expect(wrapper.vm.routeArray).toEqual(expectedRoutes);
  });
});
