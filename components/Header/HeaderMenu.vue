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
          <nav>
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
            <div
              v-if="(toggleMenu && isMobile) || !isMobile"
              class="nav-list w-100"
            >
              <div class="nav-list-items top-full">
                <ul class="nav-list-items-ul w-100">
                  <li>
                    <NuxtLink
                      to="/benchmarking"
                      class="nav-link flex md:inline-flex items-center hover:bg-gray-50"
                      @click="closeMenu"
                    >
                      <span>Benchmarking</span>
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink
                      to="/projects"
                      class="nav-link flex md:inline-flex items-center hover:bg-gray-50"
                      @click="closeMenu"
                    >
                      <span>Projects</span>
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink
                      to="/tool"
                      class="nav-link flex md:inline-flex items-center hover:bg-gray-50"
                      @click="closeMenu"
                    >
                      <span>Tools</span>
                    </NuxtLink>
                  </li>
                  <li class="relative parent">
                    <div
                      class="nav-link flex justify-between md:inline-flex items-center hover:bg-gray-50 space-x-2"
                    >
                      <span>Observatory</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4 fill-current pt-1"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z"
                        />
                      </svg>
                    </div>
                    <ul
                      class="child transition duration-300 md:absolute top-full left-0 md:w-48 bg-white md:shadow-lg md:rounded-b"
                    >
                      <li>
                        <ul>
                          <li
                            v-for="(item, index) in subMenuEntriesObservatory"
                            :key="index"
                          >
                            <NuxtLink :to="item.to">
                              {{ item.title }}
                            </NuxtLink>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li class="relative parent">
                    <div
                      href="#"
                      class="nav-link flex justify-between md:inline-flex items-center hover:bg-gray-50 space-x-2"
                    >
                      <span>About</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4 fill-current pt-1"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z"
                        />
                      </svg>
                    </div>
                    <ul
                      class="child transition duration-300 md:absolute top-full left-0 md:w-48 bg-white md:shadow-lg md:rounded-b"
                    >
                      <li>
                        <ul>
                          <li
                            v-for="(item, index) in subMenuEntriesAbout"
                            :key="index"
                          >
                            <NuxtLink :to="item.to">
                              {{ item.title }}
                            </NuxtLink>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div class="nav-list-items-direct top-full hidden sm:flex">
                <button
                  class="text-gray-800 text-sm font-semibold hover:text-purple-600 mr-4"
                  @click="handleLogin"
                >
                  Login
                </button>
                <a
                  :href="runtimeConfig.public.VRE_URI"
                  target="_blank"
                  class="text-gray-800 text-sm font-semibold border px-4 py-2 rounded-lg hover:text-purple-600 hover:border-purple-600"
                  @click="closeMenu"
                >
                  Benchmark your tool
                </a>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
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

const handleToggleMenu = () => {
  toggleMenu.value = !toggleMenu.value;
};

function handleLogin() {
  console.log(status);
  console.log(data);
  console.log(providers);
  signIn("keycloak", { callbackUrl: "http://localhost:3000/bar" });
}

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
  .navbar-brand {
    height: 65px;
    img {
      width: 85px;
    }
  }
  .nav-link {
    font-size: 18px;
    font-weight: 500;
    padding: 22px 10px 15px;
    display: flex;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    &:hover {
      color: #0b579f;
    }
  }
  #navbarSupportedContent {
    height: 100%;
  }
  .form-inline {
    display: flex;
    gap: 30px;
    align-items: center;
    a {
      color: #0b579f;
      &.btn:hover {
        color: #0b579f;
      }
      &.btn-link:hover {
        color: white;
        background-color: #0b579f;
      }
    }
  }
  a {
    text-decoration: none;
    color: rgba(0, 0, 0, 0.65);
    font-size: 1rem;
    font-weight: 500;
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

.header-menu-right {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  gap: 10px;
}

.header-links li span {
  position: relative;
  z-index: 0;
}

.header-links li span::before {
  content: "";
  position: absolute;
  z-index: -1;
  bottom: 2px;
  left: -4px;
  right: -4px;
  display: block;
  height: 6px;
}

.header-links li.active span::before {
  background-color: #fcae04;
}

.header-links li:not(.active):hover span::before {
  background-color: #ccc;
}

.child {
  opacity: 0;
  height: 0;
  overflow: hidden;
  transform: translateY(-10%);
  padding-left: 0px;
  ul {
    padding-left: 15px;
    li {
      padding-bottom: 15px;
      &:hover {
        color: theme("colors.primary.500");
        a {
          color: theme("colors.primary.500");
        }
      }
    }
  }
}

.parent:hover .child {
  opacity: 1;
  height: auto;
  overflow: auto;
  transform: translateY(0);
}

#navbar-toggle {
  position: absolute;
  left: 18px;
  top: 15px;
  cursor: pointer;
  padding: 10px 35px 16px 0px;
}
#navbar-toggle span,
#navbar-toggle span:before,
#navbar-toggle span:after {
  cursor: pointer;
  border-radius: 1px;
  height: 3px;
  width: 30px;
  background: theme("colors.primary.500");
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
}
#navbar-toggle.active span:after {
  transform: rotate(-45deg);
}
nav {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.nav-list {
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-list-items {
  display: flex;
  flex-grow: 1;
}
.nav-list-items-ul {
  display: flex;
  justify-content: center;
  list-style: none;
  padding: 0;
  margin: 0;
}
.nav-list-items-direct {
  display: flex;
  align-items: center;
  justify-content: end;
}

@media only screen and (min-width: 950px) {
  .nav-list {
    display: flex;
  }
}

@media only screen and (max-width: 1000px) {
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
  .nav-list-items {
    display: block;
  }
  .nav-list-items-ul {
    display: block;
  }
  nav {
    width: 100%;
    padding: 55px 0 15px;
    flex-grow: 1;
  }
  nav ul {
    display: none;
  }
  nav ul li {
    float: none;
  }
  nav ul li a {
    padding: 15px;
    line-height: 20px;
  }
  nav ul li ul li a {
    padding-left: 30px;
  }
  .navbar-dropdown {
    position: static;
  }
  #navbar-toggle.active span::before {
    transform: rotate(45deg);
  }
  #navbar-toggle.active span::after {
    transform: rotate(-45deg);
  }
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
    width: 90px;
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
</style>
