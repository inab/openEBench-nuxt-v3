<!-- pages/dashboard.vue -->
<template>
  <div class="dashboard">
    <div class="w-100 container">
      <div>
        <div v-if="userInfo">
          <div class="dashboard__title">
            <h2 class="text-primaryOeb-500">User Info</h2>
          </div>
          <div class="col-4">
            <img
              v-if="userInfo.picture"
              :src="userInfo.picture"
              alt="User profile picture"
              class="rounded-full w-24 h-24"
            />
          </div>
          <UForm
            :schema="v.safeParser(schema)"
            :state="state"
            class="space-y-4 row"
            @submit="onSubmit"
          >
            <UFormGroup label="User name" name="username" class="col-4 mt-0">
              <UInput v-model="state.username" />
            </UFormGroup>

            <UFormGroup label="Name" name="name" class="col-4 mt-0">
              <UInput v-model="state.name" />
            </UFormGroup>

            <UFormGroup label="Surname" name="surname" class="col-4 mt-0">
              <UInput v-model="state.surname" />
            </UFormGroup>

            <UFormGroup label="Email" name="email" class="col-4">
              <UInput v-model="state.email" />
            </UFormGroup>

            <div class="">
              <UButton type="submit"> Submit </UButton>
            </div>
          </UForm>
        </div>
        <div v-else>
          <p>Cargando información del usuario...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as v from "valibot";
import type { FormSubmitEvent } from "#ui/types";

const { status, data } = useAuth();
const userInfo = ref(null);

const state = reactive({
  username: undefined,
  name: undefined,
  supername: undefined,
  email: undefined,
});

const schema = v.object({
  username: v.pipe(v.string()),
  name: v.pipe(v.string()),
  surname: v.pipe(v.string()),
  email: v.pipe(v.string(), v.email("Invalid email")),
});

type Schema = v.InferOutput<typeof schema>;

const fetchUserInfo = async () => {
  if (status.value === "authenticated") {
    try {
      const token = data?.value.accessToken;

      const response = await fetch(
        "https://inb.bsc.es/auth/realms/openebench/protocol/openid-connect/userinfo",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "GET",
        },
      );

      if (response.ok) {
        userInfo.value = await response.json();
        state.name = userInfo.value.given_name;
        state.surname = userInfo.value.family_name;
        state.email = userInfo.value.email;
        state.username = userInfo.value.preferred_username;
      } else {
        console.error(
          "Error al obtener la información del usuario:",
          response.status,
          await response.text(),
        );
      }
    } catch (error) {
      console.error("Error en la solicitud de información de usuario:", error);
    }
  }
};

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  console.log(event.data);
}

// Llama a la función para obtener la información del usuario cuando el componente se monta
onMounted(fetchUserInfo);
</script>

<style lang="scss" scoped>
.dashboard {
  .container {
    padding: 1rem;
  }
  &__title {
    padding-bottom: 50px;
    padding-top: 20px;
    h2 {
      border-color: rgb(226, 232, 240, 1);
      border-bottom-width: 1px;
    }
  }
}
</style>
