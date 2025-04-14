import { mount } from "@vue/test-utils";
import Index from "@/pages/benchmarking/index.vue";
import { beforeEach, describe, expect, it, test, vi } from "vitest";
import { createTestingPinia } from "@pinia/testing"; // Usa Pinia para pruebas

// Initials full mocks
const mockCommunitiesStore = {
  getCommunities: [
    {
      _id: "1",
      name: "Community 1",
      acronym: "C1",
      logo: "",
      links: [],
      status: "active",
      benchmarkingEvents: [],
      summary: "",
    },
  ],
  requestCommunitiesData: vi.fn().mockResolvedValue([
    {
      _id: "1",
      name: "Community 1",
      acronym: "C1",
      logo: "",
      links: [],
      status: "active",
      benchmarkingEvents: [],
      summary: "",
    },
  ]),
};

// Initial empty mock
const mockEmptyCommunitiesStore = {
  getCommunities: [],
  requestCommunitiesData: vi.fn().mockResolvedValue([]),
};

// Fake nuxt app to mock $graphql and communities store
vi.mock("#app", () => ({
  useNuxtApp: () => ({
    $graphql: vi.fn(() =>
      Promise.resolve({
        data: {
          getCommunities: [
            {
              _id: "1",
              acronym: "C1",
              name: "Community 1",
              logo: "",
              links: [],
              status: "",
              benchmarkingEvents: [],
              summary: "",
            },
          ],
        },
      }),
    ),
  }),
}));

describe("Benchmarking Page", () => {
  let pinia;

  beforeEach(() => {
    pinia = createTestingPinia({
      initialState: {
        communitiesStore: mockCommunitiesStore,
      },
      createSpy: vi.fn,
    });

    // Store link mocked
    pinia.use(({ store }) => {
      if (store.$id === "communities") {
        Object.assign(store, mockCommunitiesStore);
      }
    });
  });

  test("should have a default value", () => {
    const wrapper = mount(Index, {
      global: {
        plugins: [pinia],
        stubs: ["FontAwesomeIcon", "NuxtIcon", "RouterLink"],
      },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  test("communities should be an empty array", () => {
    expect(mockEmptyCommunitiesStore.getCommunities).toEqual([]);
  });

  test("should fetch data", async () => {
    const data = await mockCommunitiesStore.requestCommunitiesData();
    mockCommunitiesStore.communities = data;
    expect(mockCommunitiesStore.communities).toEqual([
      {
        _id: "1",
        name: "Community 1",
        acronym: "C1",
        logo: "",
        links: [],
        status: "active",
        benchmarkingEvents: [],
        summary: "",
      },
    ]);
  });

  test("should call requestCommunitiesData on mount", async () => {
    const wrapper = mount(Index, {
      global: {
        plugins: [pinia],
        stubs: ["FontAwesomeIcon", "RouterLink", "NuxtIcon"],
      },
    });

    const fetchData = vi.spyOn(wrapper.vm, "fetchCommunitiesData");

    // Declare the fetchCommunitiesData method
    wrapper.vm.fetchCommunitiesData();

    await wrapper.vm.$nextTick();

    expect(fetchData).toHaveBeenCalled();
  });

  it("should render the skeleton loading when statusRef is 'pending'", async () => {
    const wrapper = mount(Index, {
      global: {
        plugins: [pinia],
        stubs: ["NuxtIcon"],
      },
    });

    wrapper.vm.statusRef = "pending";

    // Update the wrapper
    await wrapper.vm.$nextTick();

    expect(wrapper.findAll(".loading-skeleton").length).toBeGreaterThan(0);

    // There shouldn't be community elements yet
    expect(wrapper.findAll(".community-card-item").length).toBe(0);
  });

  //should render the skeleton loading when statusRef is 'success'
  it("should render the cards when statusRef is 'success'", async () => {
    const wrapper = mount(Index, {
      global: {
        plugins: [pinia],
        stubs: ["FontAwesomeIcon", "RouterLink", "NuxtIcon"],
      },
    });

    // Change the statusRef to success
    wrapper.vm.statusRef = "success";

    // Fake the communities data
    mockCommunitiesStore.getCommunities = [
      {
        _id: "1",
        name: "Community 1",
        acronym: "C1",
        logo: "",
        links: [],
        status: "active",
        benchmarkingEvents: [],
        summary: "",
      },
    ];

    // Update the wrapper
    await wrapper.vm.$nextTick();

    expect(wrapper.findAll(".loading-skeleton").length).toBe(0);
    expect(wrapper.findAll(".community-card-item").length).toBeGreaterThan(0);
  });
});
