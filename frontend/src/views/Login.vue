<template>
  <div class="login-page">
    <!-- Formas coloridas de fundo -->
    <div class="shape shape-blue"></div>
    <div class="shape shape-yellow"></div>

    <div class="login-card">
      <img
        class="logo"
        src="../assets/logo.jpeg"
        alt="Logo Conecta Vôlei"
      />

      <h1>Conecta Vôlei</h1>
      <p class="subtitle">Acesse sua conta</p>

      <form @submit.prevent="entrar">
        <label for="email">E-mail</label>

        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="Digite seu E-mail"
          required
        />

        <label for="senha">Senha</label>

        <input
          id="senha"
          v-model="senha"
          type="password"
          placeholder="Digite sua Senha"
          required
        />

        <p v-if="erro" class="erro">
          {{ erro }}
        </p>

        <button type="submit" :disabled="carregando">
          {{ carregando ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <!-- Cadastro -->
      <div class="cadastro-area">
        <span>Não possui uma conta?</span>

        <button
          type="button"
          class="btn-cadastro"
          @click="router.push('/cadastro')"
        >
          Criar cadastro
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const email = ref('');
const senha = ref('');
const erro = ref('');
const carregando = ref(false);

const router = useRouter();

async function entrar() {
  erro.value = '';
  carregando.value = true;

  try {
    const resposta = await api.post('/auth/login', {
      email: email.value,
      senha: senha.value,
    });

    localStorage.setItem(
      'voleitcc_token',
      resposta.data.token
    );

    router.push('/inicio');
  } catch (e) {
    erro.value =
      e.response?.data?.mensagem ||
      'Não foi possível entrar.';
  } finally {
    carregando.value = false;
  }
}
</script>

<style scoped>
.login-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(
    160deg,
    #0f2a63 0%,
    #163b7c 55%,
    #1e4fa3 100%
  );

  overflow: hidden;
}

.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.95;
}

.shape-blue {
  width: 420px;
  height: 420px;
  background-color: #0a1f4d;
  top: -140px;
  left: -140px;
}

.shape-yellow {
  width: 340px;
  height: 340px;
  background-color: #f5c518;
  bottom: -110px;
  right: -110px;
}

.login-card {
  position: relative;
  z-index: 1;

  background-color: #ffffff;

  padding: 40px 32px;
  border-radius: 16px;

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);

  width: 100%;
  max-width: 360px;

  text-align: center;
}

.logo {
  width: 84px;
  height: 84px;

  margin-bottom: 8px;

  border-radius: 20px;
  border: 3px solid #f5c518;

  object-fit: cover;
}

h1 {
  margin: 0;
  color: #0f2a63;
  font-size: 24px;
}

.subtitle {
  margin: 4px 0 24px;
  color: #666;
  font-size: 14px;
}

form {
  display: flex;
  flex-direction: column;
  text-align: left;
}

label {
  font-size: 13px;
  color: #333;

  margin-bottom: 4px;
  margin-top: 12px;
}

input {
  padding: 10px 12px;

  border: 1px solid #ddd;
  border-radius: 8px;

  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #0f2a63;
}

.erro {
  color: #c0392b;
  font-size: 13px;
  margin: 12px 0 0;
}

button {
  margin-top: 24px;

  padding: 12px;

  border: none;
  border-radius: 8px;

  background-color: #0f2a63;
  color: #fff;

  font-size: 15px;
  font-weight: bold;

  cursor: pointer;

  transition: background-color 0.2s;
}

button:hover:not(:disabled) {
  background-color: #0a1f4d;
}

button:disabled {
  opacity: 0.7;
  cursor: default;
}

/* Área de cadastro */
.cadastro-area {
  margin-top: 20px;
  padding-top: 18px;

  border-top: 1px solid #eee;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 6px;

  color: #666;
  font-size: 13px;
}

.btn-cadastro {
  margin-top: 0;

  padding: 0;

  background: transparent;
  color: #0f2a63;

  font-size: 14px;
  font-weight: 700;
}

.btn-cadastro:hover {
  background: transparent;
  color: #f0b429;
}
</style>