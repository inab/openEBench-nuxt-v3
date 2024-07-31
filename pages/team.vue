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
      <h2 class="section-title-border mt-5 mb-5">Leaders</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-cols-max">
        <div class="h-100" v-for="(leader, index) in sortedByName(leaders)" :key="index">
          <MemberCard :member="leader" :institution-mapping="institutionMapping" />
        </div>
      </div>

      <!-- Members -->
      <h2 class="section-title-border mt-3 mb-5">Group Members</h2>
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
        <div class="h-100">

        </div>
      </div>
      
      
    </div>
  </div>
</template>

<script setup lang="ts">
import membersData from '~/static/members/membersPage.json'
import MemberCard from '@/components/Cards/MemberCard.vue';


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
	font-weight: 400;
	font-size: 27px;
  line-height: 72px;
}
</style>