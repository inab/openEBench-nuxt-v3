<template>
  <div class="event-card">
    <template v-if="event && event._id">
      <NuxtLink :to="'/benchmarking/' + communityId + '?event=' + event._id">
        <!-- un div con un onclick y setear el currentevent,  -->
        <div class="event-card__box">
          <div class="event-card__box__header text-primaryOeb-500 font-medium">
            {{ event.name }}
          </div>
          <div class="event-card__box__content text-zinc-400">
            <UIcon name="i-heroicons-flag-solid" class=""></UIcon>
            {{ event.challenges.length }}
            {{ pluralize("Events", event.challenges.length) }}
          </div>
        </div>
      </NuxtLink>
    </template>
    <template v-else>
      <p>Not event</p>
    </template>
  </div>
</template>
<script setup lang="ts">
import pluralize from "pluralize";

interface Challenge {
  _id: string;
  name: string;
  acronym: string;
  url: string;
  __typename: string;
}

interface Event {
  _id: string;
  name: string;
  challenges: Challenge[];
}

const props = defineProps<{
  event?: Event;
  communityId: string;
}>();


</script>

<style scoped lang="scss">
.event-card {
  padding-bottom: 25px;

  &__box {
    transition: transform 0.2s;
    padding: 15px 10px;
    display: flex;
    flex-direction: column;
    justify-content: start;
    height: 100%;
    text-decoration: none;
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;

    &:hover {
      transform: scale(1.05);
    }

    &__content {
      font-size: 14px;
      padding-top: 25px;
    }
  }

  a {
    text-decoration: none;
  }
}
</style>
