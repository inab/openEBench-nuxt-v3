<template>
  <footer class="footer pt-5 pb-4">
    <div class="container-fluid">
      <div class="row">
        <!-- Col 1 -->
        <div class="col-md-3 col-12 col-logo p-4">
          <img :src="logo" alt="logo" class="img-fluid mb-2 logo" />
          <p>&copy; BSC-CNS {{ currentYear }}</p>
        </div>

        <!-- Col 2 -->
        <div class="col-md-6 col-12 p-4">
          <div class="row">
            <div v-for="(footer, index) in footers" :key="index" class="col-md-3 col-12 mb-2">
              <!-- Button for mobile to toggle collapse -->
              <h5 class="d-md-none">
                <button class="btn btn-link text-white d-flex align-items-center" type="button"
                  :data-bs-toggle="'collapse'" :data-bs-target="'#collapse-' + index"
                  aria-expanded="openIndex === index" :aria-controls="'collapse-' + index"
                  @click="toggleCollapse(index)">
                  {{ footer.headline
                  }}
                  <UIcon name="i-heroicons-chevron-right-20-solid"
                    class="transform transition-transform duration-200 ms-1"
                    :class="[openIndex === index && 'rotate-90']" />
                </button>
              </h5>

              <!-- Desktop headline -->
              <h5 class="d-none d-md-block mb-2">{{ footer.headline }}</h5>

              <!-- Collapsible content -->
              <div :id="'collapse-' + index" class="collapse" :class="{ show: !isMobile }">
                <ul :class="{ 'list-unstyled': !isMobile }">
                  <li v-for="(link, idx) in footer.links" :key="idx">
                    <a v-if="footer.headline === 'Observatory'" href="#" class="text-white links-header"
                      @click.prevent="goToObservatory(idx)">
                      {{ link.label }}
                    </a>
                    <nuxt-link v-else-if="link.to" :to="link.to" class="text-white links-header">
                      {{ link.title }}
                    </nuxt-link>
                    <a v-else-if="link.href" :href="link.href" target="_blank" class="text-white links-header">
                      {{ link.title }}
                      <font-awesome-icon :icon="['fas', 'arrow-up-right-from-square']" size="xs" class="mx-2" />
                    </a>
                  </li>
                </ul>

              </div>
            </div>
          </div>
        </div>

        <!-- Col 3 -->
        <div class="col-md-3 col-12 p-4 col-funding">
          <div>
            <a href="mailto:openebench-support@bsc.es" aria-label="Mail link for OpenEBench Support"
              class="btn rounded-circle px-2 btn-f">
              <font-awesome-icon :icon="['far', 'envelope']" size="lg" style="color: #ffffff" />
            </a>
            <a href="https://x.com/openebench" target="_blank" aria-label="Link to X Profile of OpenEBench"
              class="btn rounded-circle p-2 btn-f">
              <img src="/assets/icons/twitter-x-64.png" alt="X icon" class="img-fluid"
                style="max-width: 18px; max-height: 18px" />
            </a>
          </div>

          <div class="row mt-2">
            <div class="col col-9">
              <p class="text-sm-left">
                <small>OpenEBench receives funding from different EC funding
                  Research & Innovation programmes.<br />
                  <a href="/collaboration" target="_blank" class="text-white links-header"
                    aria-label="Learn more about collaboration">
                    Learn more
                    <font-awesome-icon :icon="['fas', 'arrow-up-right-from-square']" size="sm" class="mx-2" />
                  </a>
                </small>
              </p>
            </div>
            <div class="col col-3">
              <div id="svg-container"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import logo from "~/assets/images/opeb_logo_white_minimal.png";
import footerEntries from "~/components/footerEntries";
import subMenuEntriesObservatory from "~/components/Header/HeaderMenu/subMenuEntriesObservatory.js";
import subMenuEntriesAbout from "~/components/Header/HeaderMenu/subMenuEntriesAbout";
import { activeTabIndex } from "@/components/Common/state.js";

export default {
  data: () => ({
    logo,
    footers: [
      { headline: "OpenEBench", links: footerEntries },
      { headline: "Observatory", links: subMenuEntriesObservatory },
      { headline: "About", links: subMenuEntriesAbout },
      {
        headline: "Legal",
        links: [
          { title: "Legal Notice", to: "/legal-notice" },
          { title: "Disclaimer", to: "/disclaimer" },
          { title: "Cookies Policy", to: "/cookies-policy" },
        ],
      },
    ],
    isMobile: false,
    openIndex: null,
  }),

  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },

  mounted() {
    this.checkWindowSize();
    window.addEventListener("resize", this.checkWindowSize);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.checkWindowSize);
  },

  methods: {
    checkWindowSize() {
      this.isMobile = window.innerWidth < 768;
    },

    toggleCollapse(index) {
      this.openIndex = this.openIndex === index ? null : index;
    },

    goToObservatory(index) {
      activeTabIndex.value = index; // Update the global state for the active tab
      this.$router.push("/observatory"); // Use `this.$router` to navigate
    },
  },
};
</script>


<style scoped>
.footer {
  margin-top: 80px !important;
  background-color: #0b579f;
  color: white;
}

.col-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  max-width: 150px;
}

.eu-logo {
  max-width: 100%;
}

.btn-f:hover {
  background-color: rgba(197, 197, 197, 0.235);
}

.links-header {
  text-decoration: none;
}

.links-header:hover {
  text-decoration: underline;
}

/* Ensure collapse works properly */
.collapse {
  visibility: hidden;
}

.collapse.show {
  visibility: visible;
}

/* Estilos para tablets */
@media (min-width: 768px) and (max-width: 1024px) {

  /* Columna del listado */
  .col-md-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .col-funding,
  .col-logo {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .eu-logo {
    max-width: 60%;
  }

  .footer .container-fluid {
    padding-left: 20px;
    padding-right: 20px;
  }
}

/* Para pantallas más pequeñas */
@media (max-width: 768px) {

  .col-md-6,
  .col-md-3 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}

#svg-container {
  width: 100%;
  height: 50px;
  background-image: url('~/assets/images/eu.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
