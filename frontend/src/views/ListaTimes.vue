```vue
<template>
  <div class="app-shell">

    <Sidebar />

    <main class="content">

      <!-- TOPO -->
      <div class="topo">

        <div class="titulo-area">

          <h1>Times</h1>

          <p class="subtitulo">
            {{ times.length }} time(s) cadastrado(s)
          </p>

          

        </div>

        <RouterLink
          to="/times/cadastro"
          class="btn-novo"
        >
          + Novo time
        </RouterLink>

      </div>

      <!-- CARREGANDO -->
      <div
        v-if="carregando"
        class="msg"
      >
        Carregando times...
      </div>

      <!-- ERRO -->
      <div
        v-else-if="erro"
        class="msg erro"
      >
        {{ erro }}
      </div>

      <!-- NENHUM TIME -->
      <div
        v-else-if="times.length === 0"
        class="msg"
      >
        <p>Nenhum time cadastrado ainda.</p>

        <RouterLink to="/times/cadastro">
          Cadastrar o primeiro
        </RouterLink>
      </div>

      <!-- TABELA -->
      <div
        v-else
        class="tabela-wrap"
      >

        <table>

          <thead>
            <tr>
              <th>Nome</th>
              <th>Cidade</th>
              <th>Categoria</th>
              <th>Técnico</th>
              <th>Contato</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>

            <tr
              v-for="time in times"
              :key="time.id"
            >

              <td class="nome">
                {{ time.nome || '—' }}
              </td>

              <td>
                {{ time.cidade || '—' }}
              </td>

              <td>
                <span class="badge">
                  {{ time.categoria || '—' }}
                </span>
              </td>

              <td>
                {{ time.tecnico || '—' }}
              </td>

              <td class="contato">

                <span v-if="time.email">
                  {{ time.email }}
                </span>

                <span v-if="time.telefone">
                  {{ time.telefone }}
                </span>

                <span
                  v-if="!time.email && !time.telefone"
                >
                  —
                </span>

              </td>

              <td class="acoes">

                <button
                  type="button"
                  class="btn-excluir"
                  @click="confirmarExclusao(time)"
                >
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
import { Icon } from '@iconify/vue';

import api from '../services/api';
import Sidebar from '../components/Sidebar.vue';

const times = ref([]);
const carregando = ref(true);
const erro = ref('');



/* ================================
   CARREGAR TIMES
================================ */

async function carregarTimes() {
  carregando.value = true;
  erro.value = '';

  try {
    const resposta = await api.get('/times');

    console.log('Resposta da API:', resposta.data);

    if (Array.isArray(resposta.data)) {
      times.value = resposta.data;
    } else if (Array.isArray(resposta.data.times)) {
      times.value = resposta.data.times;
    } else {
      times.value = [];
    }

  } catch (e) {
    console.error('Erro ao carregar times:', e);

    erro.value =
      e.response?.data?.mensagem ||
      e.response?.data?.message ||
      'Não foi possível carregar os times.';
  } finally {
    carregando.value = false;
  }
}

/* ================================
   EXCLUIR TIME
================================ */

async function confirmarExclusao(time) {

  const confirmou = window.confirm(
    `Excluir o time "${time.nome}"? Essa ação não pode ser desfeita.`
  );

  if (!confirmou) {
    return;
  }

  try {

    await api.delete(`/times/${time.id}`);

    times.value = times.value.filter(
      (item) => item.id !== time.id
    );

  } catch (e) {

    console.error('Erro ao excluir time:', e);

    erro.value =
      e.response?.data?.mensagem ||
      e.response?.data?.message ||
      'Não foi possível excluir o time.';
  }
}

/* ================================
   INICIAR
================================ */

onMounted(carregarTimes);
</script>

<style scoped>

.app-shell {
  min-height: 100vh;
  display: flex;
  background: #f5f6fa;
  font-family:
    'Segoe UI',
    system-ui,
    -apple-system,
    sans-serif;
}

/* ================================
   CONTEÚDO
================================ */

.content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  box-sizing: border-box;
}

/* ================================
   TOPO
================================ */

.topo {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}

.titulo-area {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

h1 {
  margin: 0;
  color: #0b1f4d;
  font-size: 26px;
  font-weight: 800;
}

.subtitulo {
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 14px;
}


/* ================================
   NOVO TIME
================================ */

.btn-novo {
  display: inline-block;

  padding: 12px 20px;

  border-radius: 10px;

  background: #0b1f4d;
  color: white;

  text-decoration: none;

  font-size: 14.5px;
  font-weight: 700;
}

.btn-novo:hover {
  background: #122f6b;
}

/* ================================
   MENSAGENS
================================ */

.msg {
  padding: 24px;

  border-radius: 14px;

  background: white;

  color: #6b7280;

  font-size: 14.5px;

  text-align: center;

  box-shadow:
    0 4px 16px rgba(20, 30, 60, 0.05);
}

.msg p {
  margin-top: 0;
}

.msg.erro {
  color: #c0392b;
}

.msg a {
  color: #0b1f4d;
  font-weight: 700;
  text-decoration: none;
}

.msg a:hover {
  text-decoration: underline;
}

/* ================================
   TABELA
================================ */

.tabela-wrap {
  width: 100%;

  background: white;

  border-radius: 16px;

  overflow-x: auto;

  box-shadow:
    0 4px 16px rgba(20, 30, 60, 0.06);
}

table {
  width: 100%;
  min-width: 800px;
  border-collapse: collapse;
}

thead {
  background: #f5f6fa;
}

th {
  padding: 14px 20px;

  text-align: left;

  color: #6b7280;

  font-size: 12.5px;

  font-weight: 700;

  text-transform: uppercase;
}

td {
  padding: 16px 20px;

  border-top: 1px solid #eef0f5;

  color: #1f2937;

  font-size: 14.5px;
}

.nome {
  color: #0b1f4d;
  font-weight: 700;
}

/* ================================
   CATEGORIA
================================ */

.badge {
  display: inline-block;

  padding: 4px 10px;

  border-radius: 999px;

  background: #e6ecfb;

  color: #2f4bb0;

  font-size: 12.5px;

  font-weight: 700;
}

/* ================================
   CONTATO
================================ */

.contato {
  display: flex;
  flex-direction: column;
  gap: 2px;

  color: #6b7280;

  font-size: 13px;
}

/* ================================
   AÇÕES
================================ */

.acoes {
  text-align: right;
}

.btn-excluir {
  padding: 7px 14px;

  border: none;
  border-radius: 8px;

  background: #fdeceb;
  color: #d93025;

  font-size: 13px;
  font-weight: 700;

  cursor: pointer;
}

.btn-excluir:hover {
  background: #fbdcda;
}

/* ================================
   RESPONSIVO
================================ */

@media (max-width: 900px) {

  .app-shell {
    flex-direction: column;
  }

  .content {
    width: 100%;
  }

}

@media (max-width: 650px) {

  .content {
    padding: 24px 16px;
  }

  .topo {
    flex-direction: column;
    gap: 16px;
  }

  .titulo-area {
    width: 100%;
  }


  .btn-novo {
    width: 100%;
    text-align: center;
    box-sizing: border-box;
  }

}

</style>