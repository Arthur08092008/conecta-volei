<template>
  <div class="app-shell">
    <Sidebar />

    <main class="content">
      <div class="topo">
        <div>
          <h1>Checklist</h1>
          <p class="subtitulo">
            Itens de organização de cada partida
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
      </div>

      <div class="filtro-wrap">
        <label for="partida">Partida</label>

        <select
          id="partida"
          v-model="partidaSelecionada"
          @change="carregarChecklist"
        >
          <option disabled value="">
            Selecione uma partida
          </option>

          <option
            v-for="p in partidas"
            :key="p.id"
            :value="p.id"
          >
            {{ p.mandante }} x {{ p.visitante }} —
            {{ formatarData(p.data_jogo) }}
          </option>
        </select>
      </div>

      <p
        v-if="carregandoPartidas"
        class="msg"
      >
        Carregando partidas...
      </p>

      <div
        v-else-if="!partidaSelecionada"
        class="msg"
      >
        Selecione uma partida acima para ver o checklist dela.
      </div>

      <template v-else>

        <p
          v-if="carregando"
          class="msg"
        >
          Carregando checklist...
        </p>

        <p
          v-else-if="erro"
          class="msg erro"
        >
          {{ erro }}
        </p>

        <div
          v-else
          class="checklist-wrap"
        >

          <div class="progresso">
            <div class="barra-fundo">
              <div
                class="barra-preenchida"
                :style="{ width: progresso + '%' }"
              ></div>
            </div>

            <span>
              {{ concluidos }} de {{ itens.length }} concluídos
            </span>
          </div>

          <ul class="lista-itens">

            <li
              v-for="item in itens"
              :key="item.id"
              class="item"
            >

              <label>
                <input
                  type="checkbox"
                  :checked="item.concluido"
                  @change="alternarItem(item)"
                />

                <span
                  :class="{ concluido: item.concluido }"
                >
                  {{ item.descricao }}
                </span>
              </label>

              <button
                class="btn-remover"
                @click="removerItem(item)"
                title="Remover item"
              >
                ✕
              </button>

            </li>

          </ul>

          <form
            class="novo-item"
            @submit.prevent="adicionarItem"
          >

            <input
              v-model="novoItemDescricao"
              type="text"
              placeholder="Adicionar novo item (ex: transporte confirmado)"
            />

            <button type="submit">
              + Adicionar
            </button>

          </form>

        </div>

      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';

import api from '../services/api';
import Sidebar from '../components/Sidebar.vue';

const carregandoPartidas = ref(false);
const carregando = ref(false);
const erro = ref('');

const partidas = ref([]);
const partidaSelecionada = ref('');
const itens = ref([]);
const novoItemDescricao = ref('');

const concluidos = computed(() =>
  itens.value.filter((i) => i.concluido).length
);

const progresso = computed(() =>
  itens.value.length
    ? Math.round(
        (concluidos.value / itens.value.length) * 100
      )
    : 0
);

/* ================================
   VOLTAR
================================ */

function voltar() {
  window.history.back();
}

/* ================================
   CARREGAR PARTIDAS
================================ */

async function carregarPartidas() {
  carregandoPartidas.value = true;

  try {
    const resposta = await api.get('/partidas');

    partidas.value = resposta.data;

  } catch (e) {

    console.error(
      'Erro ao carregar partidas:',
      e
    );

  } finally {

    carregandoPartidas.value = false;

  }
}

/* ================================
   CARREGAR CHECKLIST
================================ */

async function carregarChecklist() {

  if (!partidaSelecionada.value) {
    return;
  }

  carregando.value = true;
  erro.value = '';

  try {

    const resposta = await api.get(
      `/checklist/${partidaSelecionada.value}`
    );

    itens.value = resposta.data;

  } catch (e) {

    console.error(
      'Erro ao carregar checklist:',
      e
    );

    erro.value =
      'Não foi possível carregar o checklist desta partida.';

  } finally {

    carregando.value = false;

  }
}

/* ================================
   ALTERAR ITEM
================================ */

async function alternarItem(item) {

  const novoValor = !item.concluido;

  item.concluido = novoValor;

  try {

    await api.put(
      `/checklist/item/${item.id}`,
      {
        concluido: novoValor
      }
    );

  } catch (e) {

    console.error(
      'Erro ao atualizar item:',
      e
    );

    item.concluido = !novoValor;

  }
}

/* ================================
   REMOVER ITEM
================================ */

async function removerItem(item) {

  try {

    await api.delete(
      `/checklist/item/${item.id}`
    );

    itens.value =
      itens.value.filter(
        (i) => i.id !== item.id
      );

  } catch (e) {

    console.error(
      'Erro ao remover item:',
      e
    );

  }
}

/* ================================
   ADICIONAR ITEM
================================ */

async function adicionarItem() {

  if (!novoItemDescricao.value.trim()) {
    return;
  }

  try {

    const resposta = await api.post(
      `/checklist/${partidaSelecionada.value}`,
      {
        descricao:
          novoItemDescricao.value.trim()
      }
    );

    itens.value.push(resposta.data);

    novoItemDescricao.value = '';

  } catch (e) {

    console.error(
      'Erro ao adicionar item:',
      e
    );

  }
}

/* ================================
   FORMATAR DATA
================================ */

function formatarData(data) {

  if (!data) {
    return '';
  }

  const [
    ano,
    mes,
    dia
  ] = data
    .slice(0, 10)
    .split('-');

  return `${dia}/${mes}/${ano}`;
}

onMounted(carregarPartidas);
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
   FILTRO
================================= */

.filtro-wrap {
  background: #fff;

  border-radius: 14px;

  padding: 16px 20px;

  margin-bottom: 20px;

  display: flex;

  flex-direction: column;

  gap: 6px;

  max-width: 420px;

  box-shadow:
    0 4px 16px
    rgba(20, 30, 60, 0.06);
}

.filtro-wrap label {
  font-size: 12.5px;

  font-weight: 700;

  color: #6b7280;

  text-transform: uppercase;
}

.filtro-wrap select {
  padding: 10px 12px;

  border: 1.5px solid #e2e6f0;

  border-radius: 8px;

  font-size: 14px;

  outline: none;
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

/* =================================
   CHECKLIST
================================= */

.checklist-wrap {
  background: #fff;

  border-radius: 16px;

  padding: 24px;

  box-shadow:
    0 4px 16px
    rgba(20, 30, 60, 0.06);

  max-width: 560px;
}

/* =================================
   PROGRESSO
================================= */

.progresso {
  display: flex;

  align-items: center;

  gap: 12px;

  margin-bottom: 20px;
}

.barra-fundo {
  flex: 1;

  height: 8px;

  border-radius: 999px;

  background: #eef0f5;

  overflow: hidden;
}

.barra-preenchida {
  height: 100%;

  background: #0b1f4d;

  transition: width 0.2s;
}

.progresso span {
  font-size: 12.5px;

  font-weight: 700;

  color: #6b7280;

  white-space: nowrap;
}

/* =================================
   LISTA
================================= */

.lista-itens {
  list-style: none;

  margin: 0 0 16px;

  padding: 0;

  display: flex;

  flex-direction: column;

  gap: 4px;
}

.item {
  display: flex;

  align-items: center;

  justify-content: space-between;

  padding: 10px 4px;

  border-top: 1px solid #eef0f5;
}

.item label {
  display: flex;

  align-items: center;

  gap: 10px;

  font-size: 14.5px;

  color: #1f2937;

  cursor: pointer;
}

.item input[type='checkbox'] {
  width: 18px;

  height: 18px;

  accent-color: #0b1f4d;

  cursor: pointer;
}

.concluido {
  text-decoration: line-through;

  color: #9ca3af;
}

/* =================================
   REMOVER
================================= */

.btn-remover {
  background: none;

  border: none;

  color: #c0392b;

  font-size: 13px;

  cursor: pointer;

  padding: 4px 8px;
}

/* =================================
   NOVO ITEM
================================= */

.novo-item {
  display: flex;

  gap: 8px;
}

.novo-item input {
  flex: 1;

  padding: 10px 12px;

  border: 1.5px solid #e2e6f0;

  border-radius: 8px;

  font-size: 14px;

  outline: none;
}

.novo-item input:focus {
  border-color: #0b1f4d;
}

.novo-item button {
  background: #f0b429;

  color: #0b1f4d;

  border: none;

  padding: 10px 16px;

  border-radius: 8px;

  font-weight: 700;

  font-size: 14px;

  cursor: pointer;
}

/* =================================
   RESPONSIVO
================================= */

@media (max-width: 900px) {

  .app-shell {
    flex-direction: column;
  }

  .content {
    padding: 24px;
  }

}

@media (max-width: 600px) {

  .novo-item {
    flex-direction: column;
  }

  .novo-item button {
    width: 100%;
  }

  .btn-voltar {
    width: 100%;
  }

}
</style>