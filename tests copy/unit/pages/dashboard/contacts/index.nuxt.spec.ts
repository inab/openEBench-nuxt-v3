import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Contacts from "@/pages/dashboard/contacts/index.vue";
import ContactsList from "@/components/Dashboard/contacts/ContactsList.vue";
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";

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

describe("Dashboard Contacts", () => {
  let wrapper;

  beforeEach(async () => {
    wrapper = mount(Contacts, {
      global: {
        mocks: {
          contactsList: [
            {
              id: "1",
              name: "Test Name 1",
              email: "",
            },
            {
              id: "2",
              name: "Test Name 2",
              email: "",
            },
            {
              id: "3",
              name: "Test Name ",
              email: "",
            },
          ],
          token: "token",
          isLoadingContacts: false,
        },
        stubs: ["RouterLink", "FontAwesomeIcon"],
      },
      slots: {
        default: "<template #default><Suspense><template #default><slot /></template></Suspense></template>",
      },
    });
  });

  it("renders BreadcrumbsBar and ContactsList components", () => {
    expect(wrapper.findComponent(BreadcrumbsBar).exists()).toBe(true);
    expect(wrapper.findComponent(ContactsList).exists()).toBe(true);
  });

  it("should initialize routeArray correctly", () => {
    expect(wrapper.vm.routeArray).toEqual([
      { label: "", isActualRoute: false },
      { label: "Dashboard", isActualRoute: false, route: "/dashboard" },
      {
        label: "Contacts",
        isActualRoute: true,
      },
    ]);
  });
});
