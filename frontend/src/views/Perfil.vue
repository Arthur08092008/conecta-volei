<template>
  <div class="app-shell">
    <Sidebar />

    <main class="content">
      <div class="topo">
        <div>
          <h1>Perfil</h1>
          <p class="subtitulo">Seus dados de acesso</p>
        </div>
      </div>

      <p v-if="carregando" class="msg">Carregando dados...</p>
      <p v-else-if="erro" class="msg erro">{{ erro }}</p>

      <div v-else class="card">
        <form @submit.prevent="salvar">
          <div class="field">
            <label for="nome">Nome</label>
            <input id="nome" v-model="form.nome" type="text" required />
          </div>

          <div class="field">
            <label for="email">E-mail</label>
            <input id="email" v-model="form.email" type="email" required />
          </div>

          <p v-if="mensagem" class="mensagem-sucesso">{{ mensagem }}</p>

          <div class="form-actions">
            <button type="submit" class="btn-primary" :disabled="salvando">
              {{ salvando ? 'Salvando...' : 'Salvar alterações' }}
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import Sidebar from '../components/Sidebar.vue';

const carregando = ref(true);
const salvando = ref(false);
const erro = ref('');
const mensagem = ref('');

const form = ref({
  nome: '',
  email: '',
});

async function carregarPerfil() {
  carregando.value = true;
  erro.value = '';
  try {
    const resposta = await api.get('/usuarios/perfil');
    form.value.nome = resposta.data.nome;
    form.value.email = resposta.data.email;
  } catch (e) {
    console.error('Erro ao carregar perfil:', e);
    erro.value = 'Não foi possível carregar seus dados.';
  } finally {
    carregando.value = false;
  }
}

async function salvar() {
  salvando.value = true;
  mensagem.value = '';
  try {
    await api.put('/usuarios/perfil', form.value);
    mensagem.value = 'Dados atualizados com sucesso.';
  } catch (e) {
    console.error('Erro ao salvar perfil:', e);
    erro.value = 'Não foi possível salvar as alterações.';
  } finally {
    salvando.value = false;
  }
}

onMounted(carregarPerfil);
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  background: #f5f6fa;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

.content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

.topo {
  margin-bottom: 24px;
}

h1 {
  color: #0b1f4d;
  font-size: 26px;
  font-weight: 800;
  margin: 0;
}

.subtitulo {
  color: #6b7280;
  font-size: 14px;
  margin-top: 4px;
}

.msg {
  color: #6b7280;
  font-size: 14.5px;
  background: #fff;
  padding: 24px;
  border-radius: 14px;
  text-align: center;
}

.msg.erro {
  color: #c0392b;
}

.card {
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 16px rgba(20, 30, 60, 0.06);
  max-width: 420px;
}

.field {
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
}

.field label {
  font-size: 12.5px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.field input {
  padding: 11px 14px;
  border: 1.5px solid #e2e6f0;
  border-radius: 8px;
  font-size: 14.5px;
  outline: none;
  transition: border-color 0.15s;
}

.field input:focus {
  border-color: #0b1f4d;
}

.mensagem-sucesso {
  color: #1f9d55;
  font-size: 13.5px;
  font-weight: 600;
  margin: 0 0 16px;
}

.form-actions {
  display: flex;
}

.btn-primary {
  background: #0b1f4d;
  color: #fff;
  border: none;
  padding: 12px 22px;
  border-radius: 10px;
  font-size: 14.5px;
  font-weight: 700;
  cursor: pointer;
}

.btn-primary:hover {
  background: #122f6b;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: default;
}

@media (max-width: 900px) {
  .app-shell {
    flex-direction: column;
  }
}
</style>