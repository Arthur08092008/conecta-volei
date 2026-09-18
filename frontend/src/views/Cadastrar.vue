<template>
  
  <div class="cadastro-page">

    <div class="shape shape-blue"></div>
    <div class="shape shape-yellow"></div>

    <div class="cadastro-card">

      <img
        class="logo"
        src="../assets/logo.jpeg"
        alt="Logo VoleiTCC"
      />

      <h1>Criar conta</h1>
      <p class="subtitle">
        Cadastre-se no VoleiTCC
      </p>

      <form @submit.prevent="cadastrar">

        <label for="nome">Nome</label>
        <input
          id="nome"
          v-model="nome"
          type="text"
          placeholder="Digite seu nome"
          required
        />

        <label for="email">E-mail</label>
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="Digite seu E-mail@exemplo.com"
          required
        />

        <label for="senha">Senha</label>
        <input
          id="senha"
          v-model="senha"
          type="password"
          placeholder="Digite sua senha"
          required
        />

        <label for="confirmarSenha">Confirmar senha</label>
        <input
          id="confirmarSenha"
          v-model="confirmarSenha"
          type="password"
          placeholder="Digite a senha novamente"
          required
        />

        <p v-if="erro" class="erro">
          {{ erro }}
        </p>

        <p v-if="sucesso" class="sucesso">
          {{ sucesso }}
        </p>

        <button
          type="submit"
          :disabled="carregando"
        >
          {{ carregando ? 'Cadastrando...' : 'Criar conta' }}
        </button>

      </form>

      <div class="login-area">
        <span>Já possui uma conta?</span>

        <button
          type="button"
          class="btn-login"
          @click="router.push('/')"
        >
          Voltar para o login
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();

const nome = ref('');
const email = ref('');
const senha = ref('');
const confirmarSenha = ref('');

const erro = ref('');
const sucesso = ref('');
const carregando = ref(false);

async function cadastrar() {
  erro.value = '';
  sucesso.value = '';

  if (senha.value !== confirmarSenha.value) {
    erro.value = 'As senhas não são iguais.';
    return;
  }

  carregando.value = true;

  try {
    await api.post('/auth/cadastro', {
      nome: nome.value,
      email: email.value,
      senha: senha.value,
    });

    sucesso.value = 'Cadastro realizado com sucesso!';

    nome.value = '';
    email.value = '';
    senha.value = '';
    confirmarSenha.value = '';

    setTimeout(() => {
      router.push('/');
    }, 1500);

  } catch (e) {
    erro.value =
      e.response?.data?.mensagem ||
      'Não foi possível realizar o cadastro.';
  } finally {
    carregando.value = false;
  }
}
</script>

<style scoped>
.cadastro-page {
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

.cadastro-card {
  position: relative;
  z-index: 1;

  background-color: #ffffff;

  padding: 35px 32px;

  border-radius: 16px;

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);

  width: 100%;
  max-width: 380px;

  text-align: center;
}

.logo {
  width: 75px;
  height: 75px;

  margin-bottom: 8px;

  border-radius: 18px;

  border: 3px solid #f5c518;

  object-fit: cover;
}

h1 {
  margin: 0;

  color: #0f2a63;

  font-size: 24px;
}

.subtitle {
  margin: 4px 0 20px;

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
  margin-top: 10px;
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

  margin: 10px 0 0;
}

.sucesso {
  color: #1f9d55;

  font-size: 13px;

  margin: 10px 0 0;
}

form > button {
  margin-top: 20px;

  padding: 12px;

  border: none;

  border-radius: 8px;

  background-color: #0f2a63;

  color: #fff;

  font-size: 15px;

  font-weight: bold;

  cursor: pointer;
}

form > button:hover:not(:disabled) {
  background-color: #0a1f4d;
}

form > button:disabled {
  opacity: 0.7;

  cursor: default;
}

.login-area {
  margin-top: 18px;

  padding-top: 16px;

  border-top: 1px solid #eee;

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 5px;

  color: #666;

  font-size: 13px;
}

.btn-login {
  margin-top: 0;

  padding: 0;

  border: none;

  background: transparent;

  color: #0f2a63;

  font-size: 14px;

  font-weight: bold;

  cursor: pointer;
}

.btn-login:hover {
  background: transparent;

  color: #f0b429;
}
</style>
```
