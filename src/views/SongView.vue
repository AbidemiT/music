<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button @click.prevent="newSong(song)" type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none">
          <i class="fas" :class="{ 'fa-pause': playing, 'fa-play': !playing }"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modified_name }}</div>
          <div>{{ song.genre }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">Comments ({{ song.comment_count }})</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div class="text-white text-center font-bold p-4 mb-4" v-if="comment_show_alert"
            :class="comment_alert_variant">
            {{ comment_alert_message }}
          </div>
          <vee-form :validation-schema="schema" @submit="addComment" v-if="userLoggedIn">
            <vee-field as="textarea" name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."></vee-field>
            <error-message class="text-red-500" name="comment" />
            <button :disabled="comment_in_submission" type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block">
              Submit
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <select v-model="sort"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded">
            <option value="asc">Latest</option>
            <option value="desc">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <li class="p-6 bg-gray-50 border border-gray-200" v-for="(comment, index) in sortedComments" :key="comment.docId">
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ comment.datePosted }}</time>
        </div>

        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script>
import { mapState, mapActions } from "pinia";
import useUserStore from "../stores/user";
import usePlayerStore from "../stores/player";

import {
  fetchSong,
  checkCurrentUser,
  createCommentDocument,
  customSnapshot,
  fetchComments,
  updateSong,
} from "../includes/firebase";
export default {
  name: "songView",
  data() {
    return {
      song: {},
      schema: {
        comment: "required|min:3",
      },
      sort: "asc",
      comments: [],
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: "bg-blue-500",
      comment_alert_message: "Please wait !!! your comment is being submitted",
    };
  },
  computed: {
    ...mapState(useUserStore, ["userLoggedIn", "playing"]),
    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        if (this.sort === "asc") {
          return new Date(b.datePosted) - new Date(a.datePosted);
        }

        return new Date(a.datePosted) - new Date(b.datePosted);
      });
    },
  },
  async created() {
    const { sort } = this.$route.query;
    this.sort = sort === "asc" || sort === "desc" ? sort : "asc";

    const docSnap = await fetchSong(this.$route.params.id);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      this.song = docSnap.data();
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      this.$router.push({ name: "home" });
      return;
    }

    this.getComments();
  },
  methods: {
    ...mapActions(usePlayerStore, ["newSong"]),
    async addComment(values, { resetForm }) {
      this.comment_show_alert = true;
      this.comment_in_submission = true;
      this.comment_alert_variant = "bg-blue-500";
      this.comment_alert_message =
        "Please wait !!! your comment is being submitted";

      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        sid: this.$route.params.id,
        name: checkCurrentUser().displayName,
        uid: checkCurrentUser().uid,
      };

      const commentRef = await createCommentDocument(comment);
      await customSnapshot(commentRef);

      this.song.comment_count += 1;
      await updateSong(this.$route.params.id, {
        comment_count: Number(this.song.comment_count),
      });

      this.getComments();

      this.comment_in_submission = false;
      this.comment_alert_variant = "bg-green-500";
      this.comment_alert_message = "Comment added successfully";

      resetForm();
    },
    async getComments() {
      const snapShots = await fetchComments(this.$route.params.id);

      this.comments = [];

      snapShots.docs.forEach((doc) => {
        const comment = {
          ...doc.data(),
          docId: doc.id,
        };
        this.comments.push(comment);
      });
    },
  },
  watch: {
    sort(newValue) {
      if (newValue === this.$route.query.sort) return;

      this.$router.push({
        query: {
          sort: newValue,
        },
      });
    },
  },
};
</script>
