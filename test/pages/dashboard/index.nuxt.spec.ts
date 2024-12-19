import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import Index from "@/pages/dashboard/index.vue";
import { nuxtTestUtilSetup } from "../../utils";

await nuxtTestUtilSetup();

// Mock de useAuth
vi.mock("../../mocks/auth", () => ({
  useAuth: vi.fn(),
}));

// Mock de useUser
vi.mock("@/stores/user", () => ({
  useUser: () => ({
    getUserCommunitiesRoles: [],
    setUserCommunitiesRoles: vi.fn(),
  }),
}));

describe.skip("Dashboard Page", () => {
  it("should not render user name when there is a 404 error", async () => {
    // Montar el componente con el contexto mockeado
    const wrapper = mount(Index, {
      global: {
        stubs: {
          NuxtLink: true, // Stubs de NuxtLink si son necesarios
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

    // Esperar a que Vue procese el DOM
    await wrapper.vm.$nextTick();

    // Verificar que el nombre del usuario no se renderiza
    const userNameElement = wrapper.find('[data-testid="name"]');
    expect(userNameElement.text()).not.toContain(useAuth().data.value.name);
  });
});
