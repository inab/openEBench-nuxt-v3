import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Index from "@/pages/dashboard/index.vue";
import { nuxtTestUtilSetup } from "../../utils";
import authMiddleware from "../../../../middleware/auth";

await nuxtTestUtilSetup();
let metricsByType;

vi.mock("@/stores/user", () => ({
  useUser: () => ({
    getUserCommunitiesRoles: [],
    setUserCommunitiesRoles: vi.fn(),
  }),
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

vi.mock("#app", () => ({
  useRuntimeConfig: () => ({
    public: {
      SCIENTIFIC_SERVICE_URL_API:
        "https://dev-openebench.bsc.es/api/scientific/staged/Metrics/",
    },
  }),
  $fetch: vi.fn(() => Promise.resolve()),
}));

global.$fetch = vi.fn(() => Promise.resolve([])); 

const runtimeConfig = {
  public: {
    SCIENTIFIC_SERVICE_URL_API:
      "https://dev-openebench.bsc.es/api/scientific/staged/Metrics/",
  },
};

vi.mock("#app", () => ({
  useRuntimeConfig: () => runtimeConfig,
  $fetch: vi.fn(),
}));

describe("Dashboard Index", () => {
  beforeEach(() => {
    metricsByType = {
      value: [
        { name: "Bar Plot", total: 0 },
        { name: "Scatter Plot", total: 0 },
        { name: "Box Plot", total: 0 },
        { name: "Line Plot", total: 0 },
      ],
    };
  });

  it("allows authenticated users", () => {
    const context = {
      redirect: vi.fn(),
      auth: { authenticatedOnly: true, status: "authenticated" },
    };

    authMiddleware(context);
    expect(context.redirect).not.toHaveBeenCalled();
  });

  it("does not render user-specific content for unauthenticated user", async () => {
    const context = {
      redirect: vi.fn(),
      auth: { authenticatedOnly: true, status: "unauthenticated" },
    };

    authMiddleware(context);
    expect(context.redirect).toHaveBeenCalledWith("/login-required");
  });

  it("renders the dashboard header with authenticated user", () => {
    const wrapper = mount(Index, {
      global: {
        stubs: ["NuxtLink"],
      },
    });

    const header = wrapper.find(".dashboard__header__title");
    expect(header.exists()).toBe(true);
    expect(header.text()).toBe("Dashboard");
  });

  it("updates totalMetrics with the length of fetched data", async () => {
    const mockResponse = [
      { id: 1, name: "Metric 1" },
      { id: 2, name: "Metric 2" },
    ];

    const metricsByType = {
      value: [
        { name: "Bar Plot", total: 0 },
        { name: "Scatter Plot", total: 0 },
        { name: "Box Plot", total: 0 },
        { name: "Line Plot", total: 0 },
      ],
    };

    const metrics = [
      { representation_hints: { visualization: true } },
      { representation_hints: { optimization: true } },
      { representation_hints: { visualization: true } },
      { representation_hints: { visualization: true } },
    ];

    vi.mocked($fetch).mockResolvedValue(mockResponse);

    const wrapper = mount(Index, {
      global: {
        stubs: ["NuxtLink"],
      },
    });

    const { countTotalMetrics } = wrapper.vm;
    await countTotalMetrics();
    const totalMetrics = wrapper.vm.totalMetrics; 

    expect(totalMetrics).toEqual(mockResponse.length);
  });

  it("update totalTools with the length of fetched data", async () => {
    const mockResponse = [
      { id: 1, name: "Tool 1" },
      { id: 2, name: "Tool 2" },
      { id: 3, name: "Tool 3" },
    ];
    vi.mocked($fetch).mockResolvedValue(mockResponse);

    const wrapper = mount(Index, {
      global: {
        stubs: ["NuxtLink"],
      },
    });

    const { countTotalTools } = wrapper.vm;
    await countTotalTools();
    const totalTools = wrapper.vm.totalTools; 

    expect(totalTools).toEqual(mockResponse.length);
  });

  it("update totalCommunities with the length of fetched data", async () => {
    const mockResponse = [
      { id: 1, name: "Community 1" },
      { id: 2, name: "Community 2" },
      { id: 3, name: "Community 3" },
    ];
    vi.mocked($fetch).mockResolvedValue(mockResponse);

    const wrapper = mount(Index, {
      global: {
        stubs: ["NuxtLink"],
      },
    });

    const { countTotalCommunities } = wrapper.vm;
    await countTotalCommunities();
    const totalCommunities = wrapper.vm.totalCommunities; 

    expect(totalCommunities).toEqual(mockResponse.length);
  });

  it("update totalContacts with the length of fetched data", async () => {
    const mockResponse = [
      { id: 1, name: "Contact 1" },
      { id: 2, name: "Contact 2" },
      { id: 3, name: "Contact 3" },
    ];
    vi.mocked($fetch).mockResolvedValue(mockResponse);

    const wrapper = mount(Index, {
      global: {
        stubs: ["NuxtLink"],
      },
    });

    const { countTotalContacts } = wrapper.vm;
    await countTotalContacts();
    const totalContacts = wrapper.vm.totalContacts; 

    expect(totalContacts).toEqual(mockResponse.length);
  });
});
