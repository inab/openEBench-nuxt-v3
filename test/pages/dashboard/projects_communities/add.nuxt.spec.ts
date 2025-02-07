import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import Add from "@/pages/dashboard/projects_communities/add.vue";;
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";
import CommunityAdd from "@/components/Dashboard/entries/CommunityAdd.vue";
import { useUser } from "@/stores/user.ts";

const mockUseRouter = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => mockUseRouter,
}));

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

describe("Dashboard Add entry", () => {
  let wrapper;
  let userStore;

  beforeEach(() => {
    wrapper = mount(Add, {
      global: {
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

  it("renders BreadcrumbsBar and CommunityAdd components", () => {
    expect(wrapper.findComponent(BreadcrumbsBar).exists()).toBe(true);
    expect(wrapper.findComponent(CommunityAdd).exists()).toBe(true);
  });

  it("should initialize routeArray correctly", () => {
    const expectedRoutes = [
      { label: "", isActualRoute: false },
      { label: "Dashboard", isActualRoute: false, route: "/dashboard" },
      {
        label: "Projects & communities",
        isActualRoute: false,
        route: "/dashboard/projects_communities",
      },
      { label: "Entry Add", isActualRoute: true },
    ];

    expect(wrapper.vm.routeArray).toEqual(expectedRoutes);
  });

  it.skip("calls setUserCommunitiesRoles if userPrivileges is empty", async () => {
    const { data } = useAuth();
    data.value.oeb_roles = [{ role: "manager", community: "OEBC000" }];
    expect(userStore.setUserCommunitiesRoles).toHaveBeenCalledWith([
      { role: "manager", community: "OEBC000" },
    ]);
  });
});
