import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";

describe.skip("Dashboard Page", () => {
  it("should not render user name when there is a 404 error", async () => {
    const wrapper = mount(Index, {
      global: {
        stubs: {
          NuxtLink: true, 
        },
      },
    });

    const { useAuth } = await import("../../mocks/auth");
    useAuth.mockReturnValue({
      data: {
        value: {
          name: "John Doe",
          statusCode: 200,
          oeb_roles: ["role1", "role2"],
        },
      },
      status: { value: "authenticated" },
    });

    await wrapper.vm.$nextTick();

    //const userNameElement = wrapper.find('[data-testid="name"]');

    console.log(useAuth().data.value)
    console.log(wrapper)

    //expect(userNameElement.text()).not.toContain(useAuth().data.value.name);
  });
});