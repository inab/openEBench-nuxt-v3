<template>
  <div class="container">
    <div class="w-100">
      <h2 class="text-primaryOeb-500 mb-4">The Team of OpenEBench</h2>

      <p class="text-sm leading-6 mt-3">
          Here, you can get to know the current and
          <a href="#alumni">past members</a> of the team behind the design,
          development and operation of OpenEBench. OpenEBench is the ELIXIR Open
          Data platform supporting community-driven scientific benchmarking
          activities and the technical monitoring of research software in Life
          Sciences.
      </p>

      <p class="text-sm leading-6 mt-3">
          The OpenEBench team is a committed group of professionals with different
          roles and complementary expertise who work together to maintain OpenEBench
          and add new functionality for a better user experience. The team is mainly
          affiliated with the
          <a href="https://bsc.es/" target="_blank"
              >Barcelona Supercomputing Center (BSC).<font-awesome-icon :icon="['fas', 'arrow-up-right-from-square']" size="xs" class="mx-2" />
              
          </a>
          However, we are open to collaborations worldwide as OpenEBench follows the
          Open Science principles since its inception to facilitate working
          together.
      </p>

      <p class="text-sm leading-6 mt-3">
          The overall objective is to automatise the interactions within the
          platform as much as possible so users can become an integral part of its
          operations by curating and updating existing information within it.
      </p>

      <!-- Leaders -->
      <h2 class="section-title-border text-2xl font-normal mt-5 mb-5">Leaders</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-cols-max">
        <div class="h-100" v-for="(leader, index) in sortedByName(leaders)" :key="index">
          <MemberCard :member="leader" :institution-mapping="institutionMapping" />
        </div>
      </div>

      <!-- Members -->
      <h2 class="section-title-border text-2xl font-normal mt-3 mb-5">Group Members</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-cols-max">
        <div class="h-100" v-for="(teammate, index) in sortedByName(teammates)" :key="index">
          <MemberCard :member="teammate" :institution-mapping="institutionMapping" />
        </div>
      </div>
      <br />
      <br id="alumni" />
      <br />
      <hr>
      <h3 class="mt-3">The OpenEBench Alumni network</h3>
      <p class="text-sm leading-6 mt-3">
        Different professionals have contributed to the development of OpenEBench
        since its inception in 2017. In this section, you can find past members
        and their main roles within the team. We are grateful for their
        contributions to the platform and interactions with different communities.
      </p>
      <br />

      <!-- Alumni -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-cols-max">
        <div class="h-100" v-for="(alumni, index) in sortedByName(alumnis)" :key="index">
          <AlumniCard :alumni="alumni"/>

        </div>
      </div>
      <br>
      <hr class="mt-5">

      <!-- Roles Legend Expansion Panel -->
      <div class="accordion roles-legend" id="accordionExample">
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingTwo">
            <button class="accordion-button custom-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
              Roles Legend
            </button>
          </h2>
          <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
            <div class="accordion-body">
              <table class="table custom-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody class="text-sm">
                  <tr v-for="(role, index) in rolesLegend" :key="index">
                    <td><strong>{{ role.name }}</strong></td>
                    <td>{{ role.description }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import membersData from '~/static/members/membersPage.json'
import MemberCard from '@/components/Cards/MemberCard.vue';
import AlumniCard from '@/components/Cards/AlumniCard.vue';

const members = ref([]);
const institutionMapping = ref({});
const alumnis = ref([]);
const show = ref(false);
const rolesLegend = ref([]);

// Computed properties
const leaders = computed(() => {
  return members.value.filter((member) =>
    member.roles.includes('Leadership')
  );
});

const teammates = computed(() => {
  return members.value.filter(
    (member) => !member.roles.includes('Leadership')
  );
});

// Methods
function sortedByName(persons) {
  return [...persons].sort((a, b) => a.name.localeCompare(b.name));
}

// Lifecycle hook
onMounted(() => {
  // Initialize members data and store original institution names
  members.value = membersData.Members;
  alumnis.value = membersData.Alumni;
  rolesLegend.value = membersData.Roles;
  institutionMapping.value = membersData.Institutions;

  // Sort roles legend alphabetically
  rolesLegend.value.sort((a, b) => a.name.localeCompare(b.name));
});

</script>

<style scoped>
.section-title-border {
	border-bottom: 2px solid black;
	margin-bottom: 40px;
	padding-bottom: 15px;
	color: #0b579f;
}
.roles-legend{
  border: none;
  border-radius: 5px;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2),
  0 2px 2px 0 rgba(0, 0, 0, .14),
  0 1px 5px 0 rgba(0, 0, 0, .12);
}

.custom-table th {
  color: gray !important;
  font-size: small;
  line-height: 21px;
  padding-left: 20px !important;

}

.custom-table td {
  padding: 2px;
  padding-left: 20px !important;
  line-height: 21px;
}

.collapse.show {
  visibility: visible;
}

.custom-button {
  background-color: transparent;
  border: none;
  outline: none;
  box-shadow: none;
  color: inherit;
}

.custom-button:not(.collapsed) {
  background-color: transparent;
  border: none;
  color: inherit;
  box-shadow: none;
}

.custom-button:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s ease-in-out;
}

.accordion-button:focus {
  box-shadow: none;
}

.accordion-button::after {
  background-image: none;
}

.accordion-button {
  background-color: transparent;
  border: none;
  box-shadow: none;
  color: inherit;
}

.accordion-button.collapsed {
  color: inherit;
}

.accordion-button:not(.collapsed) {
  color: inherit;
  background-color: #F0F0F0;
  box-shadow: none;
}

.accordion-item {
  border: none;
}
</style>