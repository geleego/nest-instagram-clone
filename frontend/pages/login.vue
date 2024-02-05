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
        <button
          type="submit"
          class="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
        >
          로그인
        </button>
      </form>
      <div class="mt-4 text-center">
        <NuxtLink to="/signup">
          <button class="text-blue-500">회원가입</button>
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
      password: ''
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    async getInfo() {
      try {
        const response = await this.$axios.get(`/users`);
        console.log(response.data);
      } catch (error) {
        console.error('데이터를 가져오는 동안 에러가 발생했습니다:', error);
      }
    },
    async login() {
      try {
        const payload = {
          email: this.email,
          password: this.password
        }
        const response = await this.$axios.post('/users/signin', payload);

        // 로그인 성공 시 처리
        console.log(response.data);
      } catch (error) {
        // 로그인 실패 시 처리
        console.error(error);
      }
    }
  }
}
</script>