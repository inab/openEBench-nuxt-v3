<template>
  <div>Processing authentication...</div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);

  const accessToken = params.get("access_token");
  const idToken = params.get("id_token");
  const expiresIn = params.get("expires_in");

  console.log("Access token:", accessToken);

  if (accessToken && idToken) {
    fetch("/api/auth/callback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessToken, idToken, expiresIn }),
    })
      .then((response) => response.json())
      .then((data) => {
        router.push("/dashboard");
      })
      .catch((error) => {
        console.error("Error during authentication:", error);
        router.push("/login-error");
      });
  } else {
    console.error("No access token found in the hash");
    router.push("/login-error");
  }
});
</script>
