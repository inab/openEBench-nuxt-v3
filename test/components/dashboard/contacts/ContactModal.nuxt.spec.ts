import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import ContactModal from "@/components/Dashboard/contacts/ContactModal.vue";

vi.mock("@/stores/user.ts", () => ({
  useUser: () => ({
    fetchCommunities: vi.fn().mockResolvedValue([
      {
        _id: "community1",
        name: "Community One",
      },
    ]),
  }),
}));


describe("Dashboard Contacts Modal", () => {
  let wrapper;
  let fetchContactMock;

  beforeEach(async () => {
    vi.clearAllMocks();

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        _id: "contact1",
        givenName: "John",
        surname: "Doe",
        email: ["john.doe@example.com"],
        notes: "Test note",
        _schema:
          "https://www.elixir-europe.org/excelerate/WP2/json-schemas/1.0/Contact",
        contact_type: "person",
        community_id: "community1",
      }),
      ok: true, // Simular que la respuesta es exitosa
    });

    fetchContactMock = vi.fn().mockResolvedValue({
      _id: "contact1",
      givenName: "John",
      surname: "Doe",
      email: ["john.doe@example.com"],
      notes: "Test note",
      _schema:
        "https://www.elixir-europe.org/excelerate/WP2/json-schemas/1.0/Contact",
      contact_type: "person",
      community_id: "community1",
    });

    wrapper = mount(ContactModal, {
      global: {
        stubs: ["RouterLink", "FontAwesomeIcon"],
      },
      props: {
        isModalOpen: true,
        modalTitle: "Test Modal",
        contactId: "contact1",
        isContactEditable: false,
        token: "token",
      },
    });

    wrapper.vm.fetchContact = fetchContactMock;

    await flushPromises();
  });

  it("should render the component", () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".dashboard-contacts-modal").exists()).toBe(true);
  });

  it("closes modal when close button is clicked", async () => {
    const closeButton = wrapper.find(".modal-close");
    await closeButton.trigger("click");
    expect(wrapper.emitted()["close-modal"]).toBeTruthy();
  });

  it("displays error message if required fields are empty", async () => {
    wrapper.vm.state.givenName = "";
    wrapper.vm.state.surname = "";
    wrapper.vm.state.email = [];

    await wrapper.vm.onSubmitContactUpdate();

    expect(wrapper.vm.errors).toContain("givenName cannot be empty");
    expect(wrapper.vm.errors).toContain("surname cannot be empty");
    expect(wrapper.vm.errors).toContain("email cannot be empty");
  });

  it("calls API to fetch contact when contactId changes", async () => {
    expect(fetchContactMock).not.toHaveBeenCalled();

    await wrapper.vm.fetchContact("contact1");
    expect(fetchContactMock).toHaveBeenCalledTimes(1);
    expect(fetchContactMock).toHaveBeenCalledWith("contact1");
  });

  it("displays success message when oks has value", async () => {
    wrapper.vm.oks = "Contact updated successfully";
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".alert-success").text()).toBe(
      "Contact updated successfully",
    );
  });
});
