import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CommunityAdd from "@/components/Dashboard/entries/CommunityAdd.vue";
import { createTestingPinia } from "@pinia/testing";
import { ref, nextTick } from "vue";
import {
  mockDashboardContacts,
  mockDashboardKeywords,
  mockDashboardLinks,
} from "@/test/mocks/dashboardMoks";

const mockUseAuth = vi.fn();
vi.mock("@/test/mocks/auth", () => ({
  useAuth: mockUseAuth,
}));

const mockUseRouter = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => mockUseRouter,
}));

describe("Entries Page Dashboard", () => {
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    mockUseRouter.mockReset();
    mockUseAuth.mockReset();

    wrapper = mount(CommunityAdd, {
      global: {
        plugins: [createTestingPinia()], // Usa Pinia para manejar el estado
        stubs: ["FontAwesomeIcon", "NuxtIcon", "RouterLink"], // Mockea componentes si es necesario
      },
    });
  });

  it("should render the component correctly", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should add new link to the list when the "Add Link" button is clicked', async () => {
    wrapper.vm.localLinks = ref(mockDashboardLinks);

    const addButton = wrapper.find("button.btn-add-link");
    await addButton.trigger("click");

    await wrapper.vm.$nextTick();

    // Empty link should be added
    expect(wrapper.vm.localLinks).toContain("");

    // Has to be the same because its a ref
    expect(wrapper.vm.localLinks.length).toBe(mockDashboardLinks.length);
  });
});
