<template>
  <div class="app-shell">
    <Sidebar />

    <!-- Conteúdo principal -->
    <main class="content">
      <div class="topo">
        <div class="titulo-area">
          <h1>Times</h1>

          <p class="subtitulo">
            {{ times.length }} time(s) cadastrado(s)
          </p>

          <!-- BOTÃO VOLTAR -->
          <button
            class="btn-voltar"
            type="button"
            @click="voltar"
          >
            <Icon
              icon="carbon:return"
              width="24"
              height="24"
            />
            <span>Voltar</span>
          </button>
        </div>

        <RouterLink
          to="/times/cadastro"
          class="btn-novo"
        >
          + Novo time
        </RouterLink>
      </div>

      <p
        v-if="carregando"
        class="msg"
      >
        Carregando times...
      </p>

      <p
        v-else-if="erro"
        class="msg erro"
      >
        {{ erro }}
      </p>

      <p
        v-else-if="times.length === 0"
        class="msg"
      >
        Nenhum time cadastrado ainda.

        <RouterLink to="/times/cadastro">
          Cadastrar o primeiro
        </RouterLink>
      </p>

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
              <th></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="time in times"
              :key="time.id"
            >
              <td class="nome">
                {{ time.nome }}
              </td>

              <td>
                {{ time.cidade }}
              </td>

              <td>
                <span class="badge">
                  {{ time.categoria }}
                </span>
              </td>

              <td>
                {{ time.tecnico }}
              </td>

              <td class="contato">
                <span v-if="time.email">
                  {{ time.email }}
                </span>

                <span v-if="time.telefone">
                  {{ time.telefone }}
                </span>

                <span
                  v-if="
                    !time.email &&
                    !time.telefone
                  "
                >
                  —
                </span>
              </td>

              <td class="acoes">
                <button
                  class="btn-icone"
                  title="Excluir"
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
   VOLTAR
================================ */

function voltar() {
  window.history.back();
}

/* ================================
   CARREGAR TIMES
================================ */

async function carregarTimes() {
  carregando.value = true;
  erro.value = '';

  try {
    const resposta = await api.get('/times');

    times.value = resposta.data.times;

  } catch (e) {

    erro.value =
      e.response?.data?.mensagem ||
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

    await api.delete(
      `/times/${time.id}`
    );

    times.value =
      times.value.filter(
        (t) => t.id !== time.id
      );

  } catch (e) {

    erro.value =
      e.response?.data?.mensagem ||
      'Não foi possível excluir o time.';

  }
}

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

/* =================================
   CONTEÚDO
================================= */

.content {
  flex: 1;

  padding: 32px;

  overflow-y: auto;
}

/* =================================
   TOPO
================================= */

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

/* =================================
   BOTÃO VOLTAR
================================= */

.btn-voltar {
  width: 150px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  margin-top: 18px;

  padding: 11px 16px;

  border: none;

  border-radius: 8px;

  background: #6c757d;

  color: #fff;

  font-size: 14px;

  font-weight: 700;

  cursor: pointer;

  transition:
    background 0.2s,
    transform 0.2s;
}

.btn-voltar:hover {
  background: #5c636a;

  transform: translateY(-1px);
}

/* =================================
   BOTÃO NOVO
================================= */

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

/* =================================
   MENSAGENS
================================= */

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

/* =================================
   TABELA
================================= */

.tabela-wrap {
  background: #fff;

  border-radius: 16px;

  overflow: hidden;

  box-shadow:
    0 4px 16px
    rgba(20, 30, 60, 0.06);
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

/* =================================
   BADGE
================================= */

.badge {
  background: #e6ecfb;

  color: #2f4bb0;

  padding: 4px 10px;

  border-radius: 999px;

  font-size: 12.5px;

  font-weight: 700;
}

/* =================================
   CONTATO
================================= */

.contato {
  display: flex;

  flex-direction: column;

  gap: 2px;

  font-size: 13px;

  color: #6b7280;
}

/* =================================
   AÇÕES
================================= */

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

/* =================================
   RESPONSIVO
================================= */

@media (max-width: 900px) {

  .app-shell {
    flex-direction: column;
  }

  .tabela-wrap {
    overflow-x: auto;
  }

}

@media (max-width: 650px) {

  .content {
    padding: 24px;
  }

  .topo {
    flex-direction: column;

    gap: 16px;
  }

  .titulo-area {
    width: 100%;
  }

  .btn-voltar {
    width: 100%;
  }

  .btn-novo {
    width: 100%;

    text-align: center;

    box-sizing: border-box;
  }

}
</style>