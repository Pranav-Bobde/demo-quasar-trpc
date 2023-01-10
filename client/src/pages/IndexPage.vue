<template>
  <q-page class="row items-center justify-evenly">
    LastUser: {{ lastUser.name }} - {{ lastUser.total }}
    <q-btn
      color="primary"
      icon="check"
      label="CreateUser"
      @click="createUser"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useTRPCClient } from "src/api";
import type { ApiRouter } from "app/../server/src/main";

const { client } = useTRPCClient<ApiRouter>({
  url: "http://localhost:3000/trpc",
});
const lastUser = ref({
  name: "",
  total: 0,
});

async function createUser() {
  const createdUser = await client.mutation("createUser", {
    name: "test1",
  });
  console.log("createdUser: ", createdUser);
  lastUser.value = { ...createdUser };
}

onMounted(async () => {
  const user = await client.query("getUser");
  lastUser.value = { ...user };
});
</script>
