<template>
  <div class="flex justify-center items-center h-screen bg-gray-50">
    <div class="max-w-sm p-8 bg-white rounded-lg shadow-md">
      <h1 class="text-3xl font-semibold mb-6 text-center">
        <img
          src="https://fontmeme.com/images/instagram-new-logo.png"
          alt="Instagram Logo"
          class="h-10 w-auto inline-block"
        >
      </h1>
      <form
        @submit.prevent="login"
        class="space-y-4"
      >
        <div>
          <input
            v-model="email"
            type="text"
            placeholder="아이디(이메일)"
            class="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          >
        </div>
        <div>
          <input
            v-model="password"
            type="password"
            autocomplete="on"
            placeholder="비밀번호"
            class="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          >
        </div>
        <div>
          <input
            type="checkbox"
            v-model="isRememberId"
          >
          <label for="remember">
            아이디 저장
          </label>
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
        >
          로그인
        </button>
      </form>
      <div class="mt-4 text-center">
        <NuxtLink to="/signup">
          <button class="text-blue-500">
            회원가입
          </button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      isRememberId: false
    }
  },
  mounted() {
    this.rememberId()
  },
  methods: {
    rememberId() {
      const savedEmail = localStorage.getItem('savedEmail');
      if (savedEmail) {
        this.email = savedEmail;
        this.isRememberId = true;
      }
    },
    async login() {
      try {
        if (this.isRememberId) {
          localStorage.setItem('savedEmail', this.email);
        } else {
          localStorage.removeItem('savedEmail');
        }

        const payload = {
          email: this.email,
          password: this.password
        };
        await this.$axios.post('/users/signin', payload);

        $nuxt.$router.push({ name: 'home' });
      } catch (error) {
        console.error(error);
      }
    }
  }
}
</script>