import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import CommunityAdd from "@/components/Dashboard/entries/CommunityAdd.vue";

import {
  mockDashboardLinks,
} from "@/test/mocks/dashboardMoks";

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

describe("Entries Page Dashboard", () => {
  it("should render the component correctly", () => {
    const wrapper = mount(CommunityAdd, {
      global: {
        stubs: ["FontAwesomeIcon", "NuxtIcon", "RouterLink"],
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('should add new link to the list when the "Add Link" button is clicked', async () => {
    const wrapper = mount(CommunityAdd, {
      global: {
        stubs: ["FontAwesomeIcon", "NuxtIcon", "RouterLink"],
      },
    });
    const addButton = wrapper.find("button.btn-add-link");
    await addButton.trigger("click");

    expect(wrapper.vm.localLinks).toContain("");
    expect(wrapper.vm.localLinks.length).toBe(1);
  });

  it('should remove the link from the list when the "Remove Link" button is clicked', async () => {
    const wrapper = mount(CommunityAdd, {
      global: {
        stubs: ["FontAwesomeIcon", "NuxtIcon", "RouterLink"],
      },
    });

    expect(wrapper.vm.localLinks).toBeDefined();
    expect(wrapper.vm.localLinks).toBeInstanceOf(Array);

    await wrapper.vm.$nextTick();

    wrapper.vm.localLinks = [...mockDashboardLinks];

    await wrapper.vm.$forceUpdate();
    await new Promise((r) => setTimeout(r, 100));
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.localLinks.length).toBe(mockDashboardLinks.length);

    const removeButtons = wrapper.findAll("button.btn-remove-link");
    await removeButtons[0].trigger("click");
    await wrapper.vm.$nextTick();

    if (wrapper.vm.isDialogOpened) {
      const { index, element } = wrapper.vm.elementToDelete;
      element.splice(index, 1);
      await wrapper.vm.$nextTick();
    }

    expect(wrapper.vm.localLinks.length).toBe(mockDashboardLinks.length - 1);
    expect(wrapper.vm.localLinks).not.toContain(mockDashboardLinks[0]);
  });
});
