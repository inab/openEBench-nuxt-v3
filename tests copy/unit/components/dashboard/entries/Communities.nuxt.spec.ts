import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Communities from "@/components/Dashboard/entries/Communities.vue";
import { createTestingPinia } from "@pinia/testing";
import { setActivePinia, defineStore, createPinia } from "pinia";
import { computed, ref } from "vue";

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

describe("Test Communities Dashboard", () => {
  let wrapper;
  let userStore;

  beforeEach(async () => {
    setActivePinia(createPinia());

    userStore = defineStore("user", {
      state: () => ({
        userCommunities: ref([]),
      }),
      getters: {
        getUserCommunities: (state) => computed(() => state.userCommunities),
      },
    })();

    wrapper = mount(Communities, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              user: {
                userCommunities: [
                  { id: 1, name: "Community A", status: "active" },
                  { id: 2, name: "Community B", status: "inactive" },
                  { id: 3, name: "Community C", status: "active" },
                ],
              },
            },
            createSpy: vi.fn,
          }),
        ],
        mocks: {
          userStore,
        },
        stubs: [
          "Multiselect",
          "FontAwesomeIcon",
          "NuxtLink",
          "UTable",
          "UInput",
        ],
      },
      props: {
        isLoadingData: false,
      },
    });

    userStore = wrapper.vm.$pinia.state.value.user;
  });

  it("should render the component", () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".user-communities").exists()).toBe(true);
  });

  it("should filter communities correctly", async () => {
    userStore.userCommunities.value = [
      { id: 1, name: "Community A", status: "active" },
      { id: 2, name: "Community B", status: "inactive" },
      { id: 3, name: "Community C", status: "active" },
    ];

    await new Promise(setImmediate);
    wrapper.vm.search = "Community A";
    wrapper.vm.selectedStatus = [{ value: "active" }];

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.filteredRows).toEqual([
      { id: 1, name: "Community A", status: "active" },
    ]);
  });

  it("should update pagination values", async () => {
    userStore.userCommunities = [
      { id: 1, name: "Community A", status: "active" },
      { id: 2, name: "Community B", status: "inactive" },
      { id: 3, name: "Community C", status: "active" },
      { id: 4, name: "Community D", status: "active" },
      { id: 5, name: "Community E", status: "active" },
      { id: 6, name: "Community F", status: "active" },
      { id: 7, name: "Community G", status: "active" },
      { id: 8, name: "Community H", status: "active" },
      { id: 9, name: "Community I", status: "active" },
      { id: 10, name: "Community J", status: "active" },
      { id: 11, name: "Community K", status: "active" },
      { id: 12, name: "Community L", status: "active" },
      { id: 13, name: "Community M", status: "active" },
      { id: 14, name: "Community N", status: "active" },
    ];

    await new Promise(setImmediate);
    await wrapper.vm.$nextTick();

    wrapper.vm.page = 2;
    wrapper.vm.pageCount = 10;
    wrapper.vm._total = 14;

    expect(wrapper.vm.pageFrom).toBe(11);
    expect(wrapper.vm.pageTo).toBe(14);
  });

  it("should filter communities based on search query", async () => {
    wrapper.vm.search = "Community A";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.filteredRows.length).toBe(1);
    expect(wrapper.vm.filteredRows[0].name).toBe("Community A");

    wrapper.vm.search = "Non-existent";
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.filteredRows.length).toBe(0);
  });

  it("should filter communities based on selected status", async () => {
    wrapper.vm.selectedStatus = [{ value: "active", label: "Active" }];
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.filteredRows.length).toBe(2);
    expect(wrapper.vm.filteredRows[0].status).toBe("active");
  });

  it("should generate correct community edit links", () => {
    const community = { _id: "123" };

    expect(wrapper.vm.getCommunityEditLink(community)).toBe(
      "/dashboard/projects_communities/123",
    );

    expect(wrapper.vm.getCommunityEditLink(community, true)).toBe(
      "/dashboard/projects_communities/123?events=true",
    );
  });
});
