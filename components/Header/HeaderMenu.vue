<template>
  <div class="navbar w-full p-0">
    <div class="bg-white w-full h-100">
      <div class="mx-auto">
        <div class="flex items-center nav-wrapper px-4">
          <div class="text-lg font-bold">
            <NuxtLink to="/" class="navbar-brand">
              <img
                src="/assets/images/opeb_logo.gif"
                alt="OpenEBench"
                width="80"
                class="navbar-logo d-inline-block align-top"
              />
            </NuxtLink>
          </div>
          <nav class="flex-grow">
            <div class="nav-mobile">
              <button
                id="navbar-toggle"
                class="navbar-burger flex items-center text-blue-600 p-3"
                :class="[toggleMenu ? 'active' : 'collapsing']"
                @click="handleToggleMenu"
              >
                <span></span>
              </button>
            </div>
            <div :class="{ 'nav-offcanvas': true, show: toggleMenu }">
              <div class="nav-list-items top-full">
                <ul class="nav-list-items-ul w-100">
                  <li>
                    <NuxtLink
                      to="/benchmarking"
                      class="nav-link flex md:inline-flex items-center hover:bg-gray-50"
                      :class="{ active: isActive('/benchmarking') }"
                      @click="closeMenu"
                    >
                      <span>Benchmarking</span>
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink
                      to="/projects"
                      class="nav-link flex md:inline-flex items-center hover:bg-gray-50"
                      :class="{ active: isActive('/projects') }"
                      @click="closeMenu"
                    >
                      <span>Projects</span>
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink
                      to="/tool"
                      class="nav-link flex md:inline-flex items-center hover:bg-gray-50"
                      :class="{ active: isActive('/tool') }"
                      @click="closeMenu"
                    >
                      <span>Tools</span>
                    </NuxtLink>
                  </li>
                  <!-- Dropdown para Observatory -->
                  <li class="nav-item dropdown">
                    <a
                      id="observatoryDropdown"
                      class="nav-link dropdown-toggle flex justify-between md:inline-flex items-center hover:bg-gray-50 space-x-1"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      :class="{ active: isActiveObservatory }"
                    >
                      <span>Observatory</span>
                      <UIcon
                        name="i-heroicons-chevron-right-20-solid"
                        class="transform transition-transform duration-200 text-2xl"
                        :class="{'rotate-90': dropdownStates.observatory}"
                      />
                    </a>
                    <ul
                      class="dropdown-menu submenu-observatory shadow-xl"
                      aria-labelledby="observatoryDropdown"
                    >
                      <li
                        v-for="(item, index) in subMenuEntriesObservatory"
                        :key="index"
                        class="hover:bg-gray-100 text-sm py-2"
                      >
                        <NuxtLink
                          :to="item.to"
                          class="flex items-center w-full h-full"
                          @click="closeMenu"
                        >
                          {{ item.title }}
                        </NuxtLink>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <NuxtLink
                      to="https://openebench.readthedocs.io/en/latest/introduction/1_overview.html"
                      target="blanck"
                      class="nav-link flex md:inline-flex items-center hover:bg-gray-50 space-x-2"
                      @click="closeMenu"
                    >
                      <span>Docs</span>
                      <font-awesome-icon
                        :icon="['fas', 'arrow-up-right-from-square']"
                        size="xs"
                      />
                    </NuxtLink>
                  </li>
                  <!-- Dropdown para About -->
                  <li class="nav-item dropdown">
                    <a
                      id="aboutDropdown"
                      class="nav-link dropdown-toggle flex justify-between md:inline-flex items-center hover:bg-gray-50 space-x-1"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      :class="{ active: isActiveAbout }"
                    >
                      <span>About</span>
                      <UIcon
                        name="i-heroicons-chevron-right-20-solid"
                        class="transform transition-transform duration-200 text-2xl"
                        :class="{'rotate-90': dropdownStates.about}"
                      />
                    </a>
                    <ul
                      class="dropdown-menu submenu-about shadow-xl md:rounded-b"
                      aria-labelledby="aboutDropdown"
                    >
                      <li
                        v-for="(item, index) in subMenuEntriesAbout"
                        :key="index"
                        class="hover:bg-gray-100 text-sm py-2"
                      >
                        <NuxtLink
                          :to="item.to"
                          class="flex items-center w-full h-full"
                          @click="closeMenu"
                        >
                          {{ item.title }}
                        </NuxtLink>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div class="nav-list-items-direct top-full hidden sm:flex">
                <button
                  class="text-primaryOeb-500 border-1 border-primaryOeb-800 hover:bg-primaryOeb-50 font-medium rounded-md text-sm px-3 py-2 me-2"
                >
                  <a
                    :href="runtimeConfig.public.VRE_URI"
                    target="_blank"
                    class="text-primaryOeb-500"
                    style="text-decoration: none"
                    @click="closeMenu"
                  >
                    <font-awesome-icon
                      :icon="['fas', 'arrow-up-right-from-square']"
                      size="sm"
                      class="mr-2"
                    />
                    Benchmark your tool
                  </a>
                </button>
                <button
                  class="ripple text-white bg-primaryOeb-500 hover:bg-primaryOeb-400 font-medium rounded-md text-sm px-3 py-2"
                  @click="handleLogin"
                >
                  <font-awesome-icon
                    :icon="['fas', 'arrow-right-to-bracket']"
                    size="sm"
                    class="mr-2"
                  />
                  Login
                  <span class="ripple-effect"></span>
                </button>
              </div>
            </div>
            <!-- Overlay div -->
            <div
              v-if="toggleMenu"
              class="nav-overlay"
              @click="handleToggleMenu"
            ></div>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import menuEntries from "~/components/Header/HeaderMenu/menuEntries";
import subMenuEntriesObservatory from "./HeaderMenu/subMenuEntriesObservatory";
import subMenuEntriesAbout from "./HeaderMenu/subMenuEntriesAbout";

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});

const { signIn, getProviders, status, data } = useAuth();
const providers = await getProviders();
const runtimeConfig = useRuntimeConfig();
const { $viewport } = useNuxtApp();
const toggleMenu = ref(false);
const isMobile = ref(false);
const route = useRoute();
const dropdownStates = ref({
  about: false,
  observatory: false,
});

// Breakpoints
watch(
  $viewport.breakpoint as string,
  (newBreakpoint: string, oldBreakpoint: string) => {
    if (newBreakpoint == "tablet" || newBreakpoint == "mobileWide") {
      isMobile.value = true;
    } else {
      isMobile.value = false;
    }
  },
);

onMounted(() => {
  // Configura eventos para cada dropdown
  setupDropdown('aboutDropdown', 'about');
  setupDropdown('observatoryDropdown', 'observatory');
});

function setupDropdown(dropdownId, stateKey) {
  const dropdownElement = document.getElementById(dropdownId);

  dropdownElement.addEventListener('show.bs.dropdown', () => {
    dropdownStates.value[stateKey] = true;
  });

  dropdownElement.addEventListener('hide.bs.dropdown', () => {
    dropdownStates.value[stateKey] = false;
  });
}

// Functions
const handleToggleMenu = () => {
  toggleMenu.value = !toggleMenu.value;
};

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path);
};

const isActiveObservatory = computed(() => {
  return route.path.startsWith("/observatory");
});

const isActiveAbout = computed(() => {
  const aboutPaths = ["/publications", "/collaboration", "/team"];
  return aboutPaths.includes(route.path);
});

function handleLogin() {
  signIn("keycloak", { callbackUrl: "http://localhost:3000/bar" });
}

function closeMenu() {
  toggleMenu.value = false;
}
</script>

<style scoped lang="scss">
.navbar {
  height: 65px;
  font-size: 18px;
  border-bottom: 1px solid rgb(229, 231, 235);
  position: fixed;
  top: 0;
  z-index: 2;
  width: 100%;
  background-color: white;
  transition:
    transform 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out;
  box-shadow:
    0 2px 4px -1px rgba(0, 0, 0, 0.2),
    0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12);

  .navbar-brand {
    height: 65px;
    img {
      width: 85px;
    }
  }

  .nav-link {
    font-size: 18px;
    font-weight: 500;
    padding: 22px 16px 15px 16px;
    display: flex;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    &:hover {
      color: #0b579f;
    }
    &.active {
      color: #0b579f;
    }
  }

  .nav-mobile {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    background: transparent;
    height: 55px;
    width: 70px;
  }

  nav {
    flex-grow: 1;
    display: flex;
    justify-content: start;
    align-items: center;
    margin-left: 30px;
  }

  .nav-list {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-list-items {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
  }

  .nav-list-items-ul {
    display: flex;
    flex-direction: column;
    justify-content: center;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .nav-list-items-direct {
    display: flex !important;
    align-items: center;
    justify-content: end !important;
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);

    @media only screen and (max-width: 950px) {
      position: static;
      justify-content: start !important;
      align-items: start;
      margin-top: 50px;
      width: 100%;
      padding: 10px;
      flex-direction: column;
      gap: 10px;
    }
  }

  .nav-offcanvas {
    position: fixed;
    top: 0;
    left: -300px;
    width: 300px;
    height: 100%;
    background-color: white;
    transition: left 0.3s ease-in-out;
    z-index: 2;
  }

  .nav-offcanvas.show {
    left: 0;
  }

  .nav-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1;
    transition:
      width 0.3s ease-in-out,
      opacity 0.3s ease-in-out;
    opacity: 0;
  }

  .nav-offcanvas.show + .nav-overlay {
    transition:
      width 0.3s ease-in-out,
      opacity 0.3s ease-in-out;
    width: 100%;
    opacity: 1;
    display: block;
  }

  // Options
  .dropdown-menu {
    border: none;
    margin-top: 0;
    border-radius: 0px 0px 5px 5px;
  }

  .submenu-observatory {
    min-width: 165px;
  }

  .submenu-about {
    min-width: 112px;
  }

  .dropdown-toggle::after {
    display: none;
  }

  nav ul li ul li a {
    padding-left: 10px;
    text-decoration: none !important;
    color: rgba(0, 0, 0, 0.87);
  }

  // ipad
  @media only screen and (min-width: 950px) {
    .nav-list {
      display: flex;
    }

    .nav-mobile {
      display: none;
    }

    .nav-offcanvas {
      position: static;
      width: auto;
      height: auto;
      display: flex;
      flex-direction: row;
      background-color: transparent;
      transform: none;
      transition: none;
    }

    .nav-list-items {
      flex-direction: row;
    }

    .nav-list-items-ul {
      flex-direction: row;
    }
  }

  // Movil
  @media only screen and (max-width: 950px) {
    .nav-wrapper {
      background-color: white;
    }

    .nav-list {
      display: block;
      background-color: white;
    }

    .navbar-brand {
      position: absolute;
      top: 0;
      background: transparent;
      height: 55px;
      width: 70px;
    }

    .nav-mobile {
      display: block;
    }

    // Options
    .dropdown-menu {
      position: relative;
      border-radius: 0;
      box-shadow: none;
      background-color: #f9fafb;
    }

    nav ul li a {
      line-height: 20px;
    }

    nav ul li ul li a {
      padding-left: 50px;
      text-decoration: none !important;
    }

    // Button navbar-dropdown
    #navbar-toggle {
      position: absolute;
      left: 0px;
      top: 15px;
      cursor: pointer;
      padding: 10px 35px 16px 0px;
      width: 45px;
    }

    #navbar-toggle span,
    #navbar-toggle span:before,
    #navbar-toggle span:after {
      cursor: pointer;
      border-radius: 1px;
      height: 3px;
      width: 30px;
      background: #0b579f;
      position: absolute;
      display: block;
      content: "";
      transition: all 300ms ease-in-out;
    }

    #navbar-toggle span:before {
      top: -10px;
    }

    #navbar-toggle span:after {
      bottom: -10px;
    }

    #navbar-toggle.active span {
      background-color: transparent;
    }

    #navbar-toggle.active span:before,
    #navbar-toggle.active span:after {
      top: 0;
    }

    #navbar-toggle.active span:before {
      transform: rotate(45deg);
      width: 30px;
    }

    #navbar-toggle.active span:after {
      transform: rotate(-45deg);
      width: 30px;
    }
  }
}
</style>
