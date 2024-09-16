<!-- pages/dashboard.vue -->
<template>
    <div class="dashboard">
      <div class="w-100 container">
        <div>
          <div v-if="userInfo">
            <div class="dashboard__title">
              <h2 class="text-primaryOeb-500">Profile</h2>
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
                <UInput v-model="state.username"
                  disabled
                  color="gray" variant="outline"
                  class="custom-input"
                  placeholder="User Name" />
              </UFormGroup>
  
              <UFormGroup label="Name" name="name" class="col-4 mt-0">
                <UInput v-model="state.name"
                  class="custom-input"
                  placeholder="Name" />
              </UFormGroup>
  
              <UFormGroup label="Surname" name="surname" class="col-4 mt-0">
                <UInput v-model="state.surname"
                  class="custom-input"
                  placeholder="Surname" />
              </UFormGroup>
  
              <UFormGroup label="Email" name="email" class="col-4">
                <UInput v-model="state.email" disabled
                  class="custom-input"
                  color="gray" variant="outline"
                  placeholder="Email" />
              </UFormGroup>

              <div class="pt-4">
                <CustomSubtitle
                  text="Roles"
                  />
              </div>
              <UFormGroup label="Roles" name="roles" class="col-12" v-if="state.roles">
                <USelectMenu
                  v-model="state.roles"
                  :options="state.roles"
                  multiple
                  placeholder="Status"
                  class="">
                  <template v-if="state.roles.length">
                    <div v-for="rol, index in state.roles" 
                        :key="index"
                        class="custom-badget filter-badget">
                        {{ rol }}
                    </div>
                  </template>
                </USelectMenu>
              </UFormGroup>
              
              <div class="">
                <UButton type="submit" disabled> Submit </UButton>
              </div>

            </UForm>
          </div>
          <div v-else>
            <p>Loading user info ...</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from "vue";
  import CustomSubtitle from "@/components/Common/CustomSubtitle.vue";
  import * as v from "valibot";
  import type { FormSubmitEvent } from "#ui/types";
  
  const { status, data } = useAuth();
  const userInfo = ref(null);
  const runtimeConfig = useRuntimeConfig();
  
  const state = reactive({
    username: undefined,
    name: undefined,
    supername: undefined,
    email: undefined,
    roles: undefined,
  });
  
  const schema = v.object({
    username: v.pipe(v.string()),
    name: v.pipe(v.string()),
    surname: v.pipe(v.string()),
    email: v.pipe(v.string(), v.email()),
  });

  const selectedRoles = ref([])
  
  type Schema = v.InferOutput<typeof schema>;
  
  const fetchUserInfo = async () => {
    if (status.value === "authenticated") {
      try {
        const token = data?.value.accessToken;
        
        const response = await fetch(
          `${runtimeConfig.public.KEYCLOAK_HOST}/auth/realms/${runtimeConfig.public.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
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
          state.roles = userInfo.value.resource_access?.account?.roles;
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
    /* TODO */
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
    .custom-badget {
      padding: 0.45rem 0.8rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      line-height: 1;
      &.filter-badget {
        margin-right: 0.5rem;
        background-color: #e9ecef;
      }
    }
  }
  </style>
  