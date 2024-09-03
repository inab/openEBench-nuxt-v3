<template>
  <div>Processing authentication...</div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  // Esto se ejecuta cuando la página se carga
  const hash = window.location.hash.substring(1); // Eliminar el '#'
  const params = new URLSearchParams(hash);

  const accessToken = params.get("access_token");
  const idToken = params.get("id_token");
  const expiresIn = params.get("expires_in");

  // Envía los tokens al servidor o almacénalos en el cliente
  if (accessToken && idToken) {
    // Ejemplo: Envía los tokens al servidor para iniciar una sesión
    fetch("/api/auth/callback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessToken, idToken, expiresIn }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Authentication successful:", data);
        // Redirige a la página principal o un dashboard
        router.push("/dashboard");
      })
      .catch((error) => {
        console.error("Error during authentication:", error);
        // Maneja el error, tal vez redirige a una página de error
        router.push("/login-error");
      });
  } else {
    console.error("No access token found in the hash");
    router.push("/login-error");
  }
});
</script>
