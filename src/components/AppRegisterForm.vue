<template>
  <!-- Registration Form -->
  <div class="text-white text-center font-bold p-4 rounded" v-if="reg.reg_show_alert" :class="reg.reg_alert_variant">
    {{ reg.reg_alert_msg }}
  </div>
  <vee-form :validation-schema="regSchema" @submit="register" :initial-values="userData">
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <vee-field type="text" name="name"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Name" />
      <error-message class="text-red-600" name="name" />
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field type="email" name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email" />
      <error-message class="text-red-600" name="email" />
    </div>
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <vee-field type="number" name="age"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded" />
      <error-message class="text-red-600" name="age" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field name="password" :bails="false" v-slot="{ field, errors }">
        <input
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Password" type="password" v-bind="field" />
        <div class="text-red-600" v-for="error in errors" :key="error">
          {{ error }}
        </div>
      </vee-field>
      <error-message class="text-red-600" name="password" />
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <vee-field type="password" name="confirm_password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Confirm Password" />
      <error-message class="text-red-600" name="confirm_password" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <vee-field as="select" name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded">
        <option value="USA">USA</option>
        <option value="Mexico">Mexico</option>
        <option value="Germany">Germany</option>
        <option value="Antartica">Antartica</option>
      </vee-field>
      <error-message class="text-red-600" name="country" />
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <vee-field type="checkbox" name="tos" value="1" class="w-4 h-4 float-left -ml-6 mt-1 rounded" />
      <error-message class="text-red-600 block" name="tos" />
      <label class="inline-block">Accept terms of service</label>
    </div>
    <button type="submit" :disabled="reg.reg_in_submission"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700">
      Submit
    </button>
  </vee-form>
</template>

<script>
export default {
  name: "AppRegisterForm",
  data() {
    return {
      userData: {
        country: "USA",
      },
      regSchema: {
        name: "required|min:3|max:100|alpha_spaces",
        email: "required|min:3|max:100|email",
        age: "required|min_value:18|max_value:100",
        password: "required|min:9|max:100|excluded:password",
        confirm_password: "passwords_mismatch:@password",
        country: "required|country_excluded:Antartica",
        tos: "tos",
      },
      reg: {
        reg_in_submission: false,
        reg_show_alert: false,
        reg_alert_variant: "bg-blue-500",
        reg_alert_msg: "Please wait! Your account is being created.",
      },
    };
  },
  methods: {
    register(values) {
      this.reg.reg_show_alert = true;
      this.reg.reg_in_submission = true;
      this.reg.reg_alert_variant = "bg-blue-500";
      this.reg.reg_alert_msg = "Please wait! Your account is being created.";

      setTimeout(() => {
        this.reg.reg_alert_variant = "bg-green-500";
        this.reg.reg_alert_msg =
          "Success your account has been created successfully";
      }, 3000);

      console.log({ values });
    },
  },
};
</script>
