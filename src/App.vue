<template>
  <app-header />

  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component"></component>
    </transition>
  </router-view>

  <app-player />

  <app-auth v-if="!userLoggedIn" />
</template>

<script>
import { mapWritableState } from "pinia";
import useUserStore from "@/stores/user";
import { checkCurrentUser } from "./includes/firebase";

import AppHeader from "@/components/AppHeader.vue";
import AppAuth from "@/components/AppAuth.vue";
import AppPlayer from "@/components/AppPlayer.vue";

export default {
  components: {
    AppHeader,
    AppAuth,
    AppPlayer,
  },
  computed: {
    ...mapWritableState(useUserStore, ["userLoggedIn"]),
    // ...mapState(useUserStore, ["userLoggedIn"]),
  },
  created() {
    const user = checkCurrentUser();

    if (user) {
      this.userLoggedIn = true;
    }
  },
};
</script>

<style>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.5s linear;
}

.fade-leave-to {
  transition: all 0.5s linear;
  opacity: 0;
}
</style>
