<template>
  <div class="app-shell">
    <!-- Menu lateral (igual ao Inicio.vue) -->
    <aside class="sidebar">
      <div class="sidebar-logo">
        <div class="logo-badge">
          <img src="../assets/logo.jpeg" alt="Logo VoleiTCC" />
        </div>
        <span>Conecta Volei</span>
      </div>

      <nav class="sidebar-nav">
        <RouterLink to="/inicio" class="nav-item" active-class="nav-item-active">
          Início
        </RouterLink>
        <RouterLink to="/times" class="nav-item" active-class="nav-item-active">
          Times
        </RouterLink>
        <RouterLink to="/campeonatos" class="nav-item" active-class="nav-item-active">
          Campeonatos
        </RouterLink>
        <RouterLink to="/tabelas" class="nav-item" active-class="nav-item-active">
          Tabelas
        </RouterLink>
        <RouterLink to="/partidas" class="nav-item" active-class="nav-item-active">
          Partidas
        </RouterLink>
        <RouterLink to="/perfil" class="nav-item" active-class="nav-item-active">
          Perfil
        </RouterLink>
      </nav>
    </aside>

    <!-- Conteúdo principal -->
    <main class="content">
      <div class="topo">
        <div>
          <h1>Times</h1>
          <p class="subtitulo">{{ times.length }} time(s) cadastrado(s)</p>
        </div>
        <RouterLink to="/times/cadastro" class="btn-novo">+ Novo time</RouterLink>
      </div>

      <p v-if="carregando" class="msg">Carregando times...</p>
      <p v-else-if="erro" class="msg erro">{{ erro }}</p>
      <p v-else-if="times.length === 0" class="msg">
        Nenhum time cadastrado ainda.
        <RouterLink to="/times/cadastro">Cadastrar o primeiro</RouterLink>
      </p>

      <div v-else class="tabela-wrap">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cidade</th>
              <th>Categoria</th>
              <th>Técnico</th>
              <th>Contato</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="time in times" :key="time.id">
              <td class="nome">{{ time.nome }}</td>
              <td>{{ time.cidade }}</td>
              <td>
                <span class="badge">{{ time.categoria }}</span>
              </td>
              <td>{{ time.tecnico }}</td>
              <td class="contato">
                <span v-if="time.email">{{ time.email }}</span>
                <span v-if="time.telefone">{{ time.telefone }}</span>
                <span v-if="!time.email && !time.telefone">—</span>
              </td>
              <td class="acoes">
                <button class="btn-icone" title="Excluir" @click="confirmarExclusao(time)">
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import api from '../services/api';

const times = ref([]);
const carregando = ref(true);
const erro = ref('');

async function carregarTimes() {
  carregando.value = true;
  erro.value = '';
  try {
    const resposta = await api.get('/times');
    times.value = resposta.data.times;
  } catch (e) {
    erro.value = e.response?.data?.mensagem || 'Não foi possível carregar os times.';
  } finally {
    carregando.value = false;
  }
}

async function confirmarExclusao(time) {
  const confirmou = window.confirm(`Excluir o time "${time.nome}"? Essa ação não pode ser desfeita.`);
  if (!confirmou) return;

  try {
    await api.delete(`/times/${time.id}`);
    times.value = times.value.filter((t) => t.id !== time.id);
  } catch (e) {
    erro.value = e.response?.data?.mensagem || 'Não foi possível excluir o time.';
  }
}

onMounted(carregarTimes);
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  background: #f5f6fa;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

/* Sidebar (mesmo estilo do Inicio.vue) */
.sidebar {
  width: 220px;
  flex-shrink: 0;
  background: #0b1f4d;
  color: #fff;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 8px 24px;
  font-size: 18px;
  font-weight: 800;
}

.logo-badge {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #f0b429;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.logo-badge img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  padding: 11px 14px;
  border-radius: 10px;
  color: #cfd8ea;
  text-decoration: none;
  font-size: 14.5px;
  font-weight: 600;
  transition: background 0.15s, color 0.15s;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

.nav-item-active {
  background: #f0b429;
  color: #0b1f4d;
}

/* Conteúdo */
.content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

.topo {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.btn-novo {
  background: #0b1f4d;
  color: #fff;
  text-decoration: none;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 14.5px;
  font-weight: 700;
}

.btn-novo:hover {
  background: #122f6b;
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

.msg a {
  color: #0b1f4d;
  font-weight: 700;
}

.tabela-wrap {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(20, 30, 60, 0.06);
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f5f6fa;
}

th {
  text-align: left;
  padding: 14px 20px;
  font-size: 12.5px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: #6b7280;
  font-weight: 700;
}

td {
  padding: 16px 20px;
  border-top: 1px solid #eef0f5;
  font-size: 14.5px;
  color: #1f2937;
}

.nome {
  font-weight: 700;
  color: #0b1f4d;
}

.badge {
  background: #e6ecfb;
  color: #2f4bb0;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 700;
}

.contato {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 13px;
  color: #6b7280;
}

.acoes {
  text-align: right;
}

.btn-icone {
  background: #fdeceb;
  color: #d93025;
  border: none;
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.btn-icone:hover {
  background: #fbdcda;
}

@media (max-width: 900px) {
  .app-shell {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    flex-direction: row;
    align-items: center;
    overflow-x: auto;
  }
  .sidebar-nav {
    flex-direction: row;
  }
  .tabela-wrap {
    overflow-x: auto;
  }
}
</style>