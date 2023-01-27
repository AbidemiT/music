<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <!-- Modal toggle -->
      <button @click.prevent="deleteSong(song.docId)" type="button" data-modal-target="defaultModal"
        data-modal-toggle="defaultModal" class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right">
        <i class="fa fa-times"></i>
      </button>
      <button @click.prevent="showForm = !showForm"
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right">
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="showForm">
      <div class="text-white text-center font-bold p-4 mb-4" v-if="show_alert" :class="alert_variant">
        {{ alert_message }}
      </div>
      <vee-form :validation-schema="songSchema" @submit="songUpdate" :initial-values="song">
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field type="text" name="modified_name"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title" @input="updateUnsavedFlag(true)" />
          <error-message class="text-red-600 block" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field type="text" name="genre"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre" @input="updateUnsavedFlag(true)" />
          <error-message class="text-red-600 block" name="genre" />
        </div>
        <button type="submit" class="mr-4 py-1.5 px-3 rounded text-white bg-green-600" :disabled="in_submission">
          Submit
        </button>
        <button @click.prevent="showForm = !showForm" type="button" class="py-1.5 px-3 rounded text-white bg-gray-600"
          :disabled="in_submission">
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { updateSong, deleteSong } from "../includes/firebase";

export default {
  name: "CompositionItem",
  props: {
    song: {
      type: Object,
      required: true,
    },
    updateSong: {
      type: Function,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    removeSong: {
      type: Function,
      required: true,
    },
    updateUnsavedFlag: {
      type: Function,
    },
  },
  data() {
    return {
      showForm: false,
      showModal: false,
      songSchema: {
        modified_name: "required",
        genre: "alpha_spaces",
      },
      in_submission: false,
      show_alert: false,
      alert_variant: "bg-blue-500",
      alert_message: "Updating song info...",
    };
  },
  methods: {
    async deleteSong() {
      await deleteSong(this.song.original_name, this.song.docId);

      this.removeSong(this.index);
    },
    async songUpdate(values) {
      this.in_submission = true;
      this.show_alert = true;
      this.alert_variant = "bg-blue-500";
      this.alert_message = "Updating song info...";

      try {
        await updateSong(this.song.docId, values);

        this.updateSong(this.index, values);

        this.in_submission = false;
        this.alert_variant = "bg-green-500";
        this.alert_message = "Song Updated successfully.";
      } catch (error) {
        console.log({ error });

        this.in_submission = false;
        this.alert_variant = "bg-red-500";
        this.alert_message = "Song info update failed!, try again later";

        return;
      }

      this.updateUnsavedFlag(false);

      setTimeout(() => {
        this.show_alert = false;
      }, 5000);
    },
  },
};
</script>
