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
                <button class="btn btn-link text-white" type="button" :data-bs-toggle="isMobile ? 'collapse' : ''" :data-bs-target="'#collapse-' + index" aria-expanded="false" :aria-controls="'collapse-' + index">
                  {{ footer.headline }}
                </button>
              </h5>

              <!-- Desktop headline -->
              <h5 class="d-none d-md-block mb-2">{{ footer.headline }}</h5>

              <!-- Collapsible content -->
              <div :id="'collapse-' + index" class="collapse" :class="{ show: !isMobile }">
                <ul class="list-unstyled">
                  <li v-for="(link, m) in footer.links" :key="m">
                    <nuxt-link v-if="link.to" :to="link.to" class="text-white links-header">
                      {{ link.title }}
                    </nuxt-link>
                    <a v-if="link.href" :href="link.href" target="_blank" class="text-white links-header">
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
        <div class="col-md-3 col-12 p-4">
          <div>
            <a href="mailto:openebench-support@bsc.es" aria-label="Mail link for OpenEBench Support" class="btn rounded-circle px-2 btn-f">
              <font-awesome-icon :icon="['far', 'envelope']" size="lg" style="color: #FFFFFF;" />
            </a>
            <a href="https://x.com/openebench" target="_blank" aria-label="Link to X Profile of OpenEBench" class="btn rounded-circle p-2 btn-f">
              <img src="/assets/icons/twitter-x-64.png" alt="X icon" class="img-fluid" style="max-width: 18px; max-height: 18px;" />
            </a>
          </div>

          <div class="row mt-2">
            <div class="col col-9">
              <p class="text-sm-left"><small>OpenEBench receives funding from different EC funding Research & Innovation programmes.<br />
                <a href="/collaboration" target="_blank" class="text-white links-header" aria-label="Learn more about collaboration">
                  Learn more
                  <font-awesome-icon :icon="['fas', 'arrow-up-right-from-square']" size="sm" class="mx-2" />
                </a>
              </small></p>
            </div>
            <div class="col col-3 col-logo">
              <img :src="euFlag" alt="EU logo" class="img-fluid m-2 px-2" style="max-width: 70px;" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import logo from '~/assets/images/opeb_logo_white_minimal.png';
import euFlag from '/images/illustrations/eu.svg';
import footerEntries from '~/components/footerEntries';
import subMenuEntriesObservatory from '~/components/Header/HeaderMenu/subMenuEntriesObservatory.js';
import subMenuEntriesAbout from '~/components/Header/HeaderMenu/subMenuEntriesAbout';

export default {
  data: () => ({
    logo,
    euFlag,
    footers: [
      { headline: 'OpenEBench', links: footerEntries },
      { headline: 'Observatory', links: subMenuEntriesObservatory },
      { headline: 'About', links: subMenuEntriesAbout },
      {
        headline: 'Legal',
        links: [
          { title: 'Legal Notice', to: '/legal-notice' },
          { title: 'Disclaimer', to: '/disclaimer' },
          { title: 'Cookies Policy', to: '/cookies-policy' },
        ],
      },
    ],
    isMobile: false, // Estado inicial
  }),
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },
  mounted() {
    this.checkWindowSize();
    window.addEventListener('resize', this.checkWindowSize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkWindowSize);
  },
  methods: {
    checkWindowSize() {
      this.isMobile = window.innerWidth < 768; // Bootstrap's default mobile breakpoint
    }
  }
};
</script>

<style scoped>
.footer {
  margin-top: 80px !important;
  background-color: #0B579F;
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
</style>
