<template>
  <!-- Header -->
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link class="text-white font-bold uppercase text-2xl mr-4" :to="{ name: 'home' }"
        exact-active-class="no-active">Ongaku</router-link>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <router-link class="px-2 text-white" :to="{ name: 'about' }">
            About
          </router-link>
          <li v-if="!userLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal">
              Login / Register
            </a>
          </li>
          <template v-else>
            <li>
              <router-link class="px-2 text-white" :to="{ name: 'manage' }">Manage</router-link>
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="logOut">
                LogOut
              </a>
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapState, mapWritableState, mapActions } from "pinia";
import useModalStore from "@/stores/modal";
import useUserStore from "@/stores/user";

export default {
  name: "AppHeader",
  computed: {
    ...mapWritableState(useModalStore, ["isOpen"]),
    ...mapState(useUserStore, ["userLoggedIn"]),
  },
  methods: {
    toggleAuthModal() {
      this.isOpen = !this.isOpen;
    },
    ...mapActions(useUserStore, ["signOut"]),
    async logOut() {
      try {
        await this.signOut();

        // console.log({ route: this.$route });
        if (this.$route.meta.requiresAuth) {
          this.$router.push({ name: "home" });
        }
      } catch (error) {
        console.log({ error });
      }
    },
  },
};
</script>
