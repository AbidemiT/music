import { defineStore } from "pinia";

import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
  updateUserProfile,
  signInAuthUserWithEmailAndPassword,
  signOutUser,
} from "@/includes/firebase";

export default defineStore("user", {
  state: () => ({
    userLoggedIn: false,
  }),
  actions: {
    async register(values) {
      const { user } = await createAuthUserWithEmailAndPassword(
        values.email,
        values.password
      );

      await createUserDocumentFromAuth(user, {
        name: values.name,
        email: values.email,
        age: values.age,
        role: values.role,
        country: values.country,
      });

      await updateUserProfile(values.name);

      this.userLoggedIn = true;
    },
    async login(values) {
      const { user } = await signInAuthUserWithEmailAndPassword(
        values.email,
        values.password
      );

      if (user) {
        this.userLoggedIn = true;
      }
    },
    async signOut() {
      await signOutUser();
      this.userLoggedIn = false;
    },
  },
});
