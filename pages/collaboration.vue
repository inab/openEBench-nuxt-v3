<template>
    <div class="container">
        <h2 class="text-primaryOeb-500 mb-4">OpenEBench Collaborations</h2>

        <p class="text-sm leading-6 mt-3">
            Collaborations are at the heart of OpenEBench. OpenEBench has been
			designed as a space to foster collaborations within and across
			communities, taking ELIXIR as the overall framework. ELIXIR is the
			pan-European Research Infrastructure for managing research data and other
			digital assets in the Life Sciences domain.
        </p>

        <p class="text-sm leading-6 mt-3">
            Collaborations are essential to ensure that OpenEBench is fit for its
			purpose and responds to users' current needs. It is also a mechanism to
			contribute towards the platform's sustainability. Participation in EU and
			nationally funded projects is one of the existing collaboration
			mechanisms. Participating in funded projects allows us to prioritise
			specific developments to strengthen, extend and add new features to the
			platform that a specific project will utilise. Notably, these developments
			are made available to everyone across OpenEBench, fostering a continuous
			innovation cycle.
        </p>

        <p class="text-sm leading-6 mt-3">
            Beyond funded projects, OpenEBench also works with scientific communities
			willing to sustain their benchmarking efforts in the long run, as well as
			individuals interested in contributing to specific platform components.
        </p>

  
		<!-- Funding Section -->
		<h3 class="section-title-border text-2xl font-normal mt-5 mb-2">Fundings</h3>
        <div class="row mt-5">
            <div class="col-12 col-sm-6 col-md-4 d-flex justify-content-center" v-for="(collaborator, index) in fundingCollaborators"
            :key="index">
                <CollaboratorsCard :title="collaborator.title"
					:href="collaborator.href"
					:src="collaborator.src">
                </CollaboratorsCard>

            </div>
        </div>

		<!-- Collaborators Section -->
		<h3 class="section-title-border text-2xl font-normal mt-5 mb-2">Collaborators</h3>
        <div class="row mt-5">
            <div class="col-12 col-sm-6 col-md-4" v-for="(collaborator, index) in otherCollaborators"
            :key="index">
                <CollaboratorsCard :title="collaborator.title"
					:href="collaborator.href"
					:src="collaborator.src">
                </CollaboratorsCard>

            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue';
import CollaboratorsCard from '@/components/Cards/CollaboratorsCard.vue';
import Img1 from '~/assets/collaboration/eucaim.png';
import Img2 from '~/assets/collaboration/EUCANImage.png';
import Img3 from '~/assets/collaboration/decider.jpg';
import Img4 from '~/assets/collaboration/AMetaPred.png';
import Img5 from '~/assets/collaboration/baiha.png';
  
  const collaborators = ref([
    {
      title: 'EUCAIM',
      href: 'https://cancerimage.eu/',
      src: Img1,
      type: 'funding',
    },
    {
      title: 'EuCanImage',
      href: 'https://eucanimage.eu/',
      src: Img2,
      type: 'funding',
    },
    {
      title: 'DataTools4Heart',
      href: 'https://www.datatools4heart.eu/',
      src: 'https://www.datatools4heart.eu/wp-content/themes/datatools/img/og-dt4h.png',
      type: 'funding',
    },
    {
      title: 'DECIDER',
      href: 'https://www.deciderproject.eu/',
      src: Img3,
      type: 'funding',
    },
    {
      title: 'PerMedCoE',
      href: 'https://permedcoe.eu/',
      src: 'https://permedcoe.eu/wp-content/uploads/2020/11/logo_1.png',
      type: 'funding',
    },
    {
      title: 'EOSC-EVERSE',
      href: 'https://everse.software/',
      src: 'https://everse.software/images/logos/EOSCEverse_PosColour.svg',
      type: 'funding',
    },
    {
      title: 'ELIXIR STEERS',
      href: 'https://elixir-europe.org/about-us/how-funded/eu-projects/steers',
      src: 'https://elixir-europe.org/sites/default/files/styles/left-large/public/images/elixir-steers-logo.png',
      type: 'funding',
    },
    {
      title: 'Fujitsu AMetaPred',
      href: 'https://dev-openebench.bsc.es/benchmarking/OEBC900?event=OEBE9000000000',
      src: Img4,
      type: 'collaborator',
    },
    {
      title: 'BAIHA',
      href: 'https://bioinfo4women.bsc.es/research/',
      src: Img5,
      type: 'collaborator',
    },
  ]);
  
  const sortedCollaborators = computed(() => {
    return collaborators.value.slice().sort((a, b) => a.title.localeCompare(b.title));
  });
  
  const fundingCollaborators = computed(() => {
    return sortedCollaborators.value.filter((collaborator) => collaborator.type === 'funding');
  });
  
  const otherCollaborators = computed(() => {
    return sortedCollaborators.value.filter((collaborator) => collaborator.type === 'collaborator');
  });
  
</script>


<style scoped>
.section-title-border {
	border-bottom: 2px solid black;
	margin-bottom: 30px;
	padding-bottom: 15px;
	color: #0b579f;
}
</style>