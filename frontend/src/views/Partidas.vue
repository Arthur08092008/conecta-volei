<template>
  <div class="app-shell">
    <Sidebar />

    <main class="content">
      <div class="topo">
        <div>
          <h1>Partidas</h1>
          <p class="subtitulo">{{ partidas.length }} partida(s) cadastrada(s)</p>
        </div>
        <RouterLink to="/agendas" class="btn-primary">+ Nova partida</RouterLink>
      </div>

      <p v-if="carregando" class="msg">Carregando partidas...</p>
      <p v-else-if="erro" class="msg erro">{{ erro }}</p>
      <p v-else-if="partidas.length === 0" class="msg">
        Nenhuma partida cadastrada ainda.
        <RouterLink to="/agendas">Agendar a primeira</RouterLink>
      </p>

      <div v-else class="tabela-wrap">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Mandante</th>
              <th>Visitante</th>
              <th>Campeonato</th>
              <th>Resultado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in partidas" :key="p.id">
              <td class="data-cell">
                {{ formatarData(p.data_jogo) }}
                <span v-if="p.horario" class="horario">{{ formatarHorario(p.horario) }}</span>
              </td>
              <td class="nome">{{ p.mandante }}</td>
              <td class="nome">{{ p.visitante }}</td>
              <td>{{ p.campeonato_nome || '—' }}</td>
              <td>
                <span v-if="p.resultado" class="badge">{{ p.resultado }}</span>
                <span v-else class="pendente">Não realizada</span>
              </td>
              <td class="acoes">
                <RouterLink
                  class="btn-checklist"
                  :to="{ path: '/checklist', query: { partida: p.id } }"
                >
                  Checklist
                </RouterLink>
                <button class="btn-excluir" @click="excluirPartida(p.id)">Excluir</button>
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
import Sidebar from '../components/Sidebar.vue';

const partidas = ref([]);
const carregando = ref(true);
const erro = ref('');

async function carregarPartidas() {
  carregando.value = true;
  erro.value = '';
  try {
    const resposta = await api.get('/partidas');
    partidas.value = resposta.data;
  } catch (e) {
    console.error('Erro ao carregar partidas:', e);
    erro.value = 'Não foi possível carregar as partidas.';
  } finally {
    carregando.value = false;
  }
}

async function excluirPartida(id) {
  if (!confirm('Deseja realmente excluir esta partida?')) return;
  try {
    await api.delete(`/partidas/${id}`);
    partidas.value = partidas.value.filter((p) => p.id !== id);
  } catch (e) {
    console.error('Erro ao excluir partida:', e);
    alert('Erro ao excluir partida.');
  }
}

function formatarData(data) {
  if (!data) return '—';
  const [ano, mes, dia] = data.slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}

function formatarHorario(hms) {
  return hms ? hms.slice(0, 5) : '';
}

onMounted(carregarPartidas);
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

.btn-primary {
  background: #0b1f4d;
  color: #fff;
  text-decoration: none;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 14.5px;
  font-weight: 700;
}

.btn-primary:hover {
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

.data-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-weight: 600;
  color: #0b1f4d;
}

.horario {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
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

.pendente {
  color: #9ca3af;
  font-size: 13px;
}

.acoes {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn-checklist {
  background: #fdf1dc;
  color: #a06600;
  text-decoration: none;
  border: none;
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 700;
}

.btn-checklist:hover {
  background: #fbe6c0;
}

.btn-excluir {
  background: #fdeceb;
  color: #d93025;
  border: none;
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.btn-excluir:hover {
  background: #fbdcda;
}

@media (max-width: 900px) {
  .app-shell {
    flex-direction: column;
  }
  .tabela-wrap {
    overflow-x: auto;
  }
}
</style>