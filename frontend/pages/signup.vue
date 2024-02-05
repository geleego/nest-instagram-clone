<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4">
        회원가입
      </h2>
      <form
        @submit.prevent="signup"
        class="space-y-4"
      >
        <div>
          <label
            for="signup-email"
            class="block font-semibold"
          >
            아이디(이메일)
          </label>
          <input
            type="email"
            id="signup-email"
            v-model="email"
            class="w-full mt-1 p-2 border border-gray-300 rounded-md"
            required
          >
        </div>
        <div>
          <label
            for="signup-password"
            class="block font-semibold"
          >
            비밀번호
          </label>
          <input
            type="password"
            autocomplete="on"
            id="signup-password"
            v-model="password"
            class="w-full mt-1 p-2 border border-gray-300 rounded-md"
            required
          >
        </div>
        <div>
          <label
            for="signup-password-check"
            class="block font-semibold"
          >
            비밀번호 확인
          </label>
          <input
            type="password"
            autocomplete="on"
            id="signup-password-check"
            v-model="passwordCheck"
            class="w-full mt-1 p-2 border border-gray-300 rounded-md"
            required
          >
        </div>
        <div>
          <label
            for="signup-phonenumber"
            class="block font-semibold"
          >
            핸드폰 번호
          </label>
          <input
            type="tel"
            id="signup-phonenumber"
            v-model="phoneNumber"
            class="w-full mt-1 p-2 border border-gray-300 rounded-md"
            required
            @input="replacePhoneNumber"
            minlength="11"
            maxlength="11"
          >
        </div>
        <div>
          <label
            for="nickname"
            class="block font-semibold"
          >
            닉네임
          </label>
          <input
            type="text"
            id="nickname"
            v-model="nickname"
            class="w-full mt-1 p-2 border border-gray-300 rounded-md"
            required
          >
        </div>
        <div>
          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            가입하기
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      passwordCheck: '',
      phoneNumber: '',
      nickname: ''
    }
  },
  methods: {
    // 숫자 이외의 문자 제거
    replacePhoneNumber() {
      this.phoneNumber = this.phoneNumber.replace(/\D/g, '');
    },

    validatePassword() {
      if (this.password === this.passwordCheck) {
        return true;
      }
      window.alert('비밀번호가 일치하지 않습니다.');
      return false;
    },
    validatePhoneNumber() {
      if (this.phoneNumber.length === 11) {
        return true;
      }
      window.alert('핸드폰 번호 형식이 잘못되었습니다.');
      return false;
    },

    async signup() {
      if (!this.validatePassword() || !this.validatePhoneNumber()) {
        return false;
      }

      try {
        const payload = {
          email: this.email,
          password: this.password,
          passwordCheck: this.passwordCheck,
          phoneNumber: this.phoneNumber,
          nickname: this.nickname
        };
        await this.$axios.post('/users/signup', payload);
        
        window.alert('성공적으로 가입이 완료되었습니다.')
        $nuxt.$router.push({ name: 'login' });
      } catch (error) {
        console.error(error);
      }
    }
  }
}
</script>