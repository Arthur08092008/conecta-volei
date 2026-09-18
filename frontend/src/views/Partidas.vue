<template>
  <div class="partidas-layout">

    <Sidebar />

    <main class="partidas-content">

      <!-- =========================
           LISTA DE PARTIDAS
      ========================== -->
      <template v-if="!criandoPartida">

        <div class="page-header">
          <div>
            <h1>Partidas</h1>
            <p>{{ partidas.length }} partida(s) cadastrada(s)</p>
          </div>

          <button
            class="btn-primary"
            @click="abrirCriacao"
          >
            + Nova partida
          </button>
        </div>

        <!-- CARREGANDO -->
        <div
          v-if="carregando"
          class="mensagem"
        >
          Carregando partidas...
        </div>

        <!-- ERRO -->
        <div
          v-else-if="erro"
          class="mensagem erro"
        >
          {{ erro }}
        </div>

        <!-- NENHUMA PARTIDA -->
        <div
          v-else-if="partidas.length === 0"
          class="empty-state"
        >
          <div class="empty-icon">
            📅
          </div>

          <h2>Nenhuma partida cadastrada</h2>

          <p>
            Cadastre a primeira partida para começar.
          </p>

          <button
            class="btn-primary"
            @click="abrirCriacao"
          >
            Nova partida
          </button>
        </div>

        <!-- LISTA DE PARTIDAS -->
        <div
          v-else
          class="partidas-list"
        >

          <div
            v-for="partida in partidas"
            :key="partida.id"
            class="partida-card"
          >

            <div class="partida-info">

              <div class="partida-times">

                <div class="time">
                  <span class="time-label">
                    Time A
                  </span>

                  <strong>
                    {{ nomeDoTime(partida.time_a) }}
                  </strong>
                </div>

                <div class="vs">
                  VS
                </div>

                <div class="time">
                  <span class="time-label">
                    Time B
                  </span>

                  <strong>
                    {{ nomeDoTime(partida.time_b) }}
                  </strong>
                </div>

              </div>

              <div class="partida-detalhes">

                <span>
                  📅 {{ formatarData(partida.data) }}
                </span>

                <span>
                  🕐 {{ partida.horario }}
                </span>

                <span>
                  📍 {{ partida.local }}
                </span>

              </div>

            </div>

            <button
              class="btn-delete"
              @click="excluirPartida(partida.id)"
            >
              Excluir
            </button>

          </div>

        </div>

      </template>


      <!-- =========================
           NOVA PARTIDA
      ========================== -->
      <template v-else>

        <div class="page-header">
          <div>
            <h1>Nova partida</h1>

            <p>
              Cadastre uma nova partida
            </p>
          </div>

          <button
            class="btn-secondary"
            @click="cancelarCriacao"
          >
            Voltar
          </button>
        </div>


        <!-- FORMULÁRIO -->
        <form
          class="form-card"
          @submit.prevent="criarPartida"
        >

          <!-- =========================
               TIMES
          ========================== -->
          <div class="form-row">

            <!-- TIME A -->
            <div class="form-group">

              <label for="timeA">
                Time A
              </label>

              <select
                id="timeA"
                v-model="novaPartida.timeA"
              >
                <option value="">
                  Selecione o Time A
                </option>

                <option
                  v-for="time in times"
                  :key="time.id"
                  :value="time.id"
                >
                  {{ time.nome }}
                </option>
              </select>

            </div>


            <div class="vs-form">
              VS
            </div>


            <!-- TIME B -->
            <div class="form-group">

              <label for="timeB">
                Time B
              </label>

              <select
                id="timeB"
                v-model="novaPartida.timeB"
              >
                <option value="">
                  Selecione o Time B
                </option>

                <option
                  v-for="time in times"
                  :key="time.id"
                  :value="time.id"
                >
                  {{ time.nome }}
                </option>
              </select>

            </div>

          </div>


          <!-- =========================
               DATA E HORÁRIO
          ========================== -->
          <div class="form-row">

            <div class="form-group">

              <label for="data">
                Data
              </label>

              <input
                id="data"
                v-model="novaPartida.data"
                type="date"
              />

            </div>


            <div class="form-group">

              <label for="horario">
                Horário
              </label>

              <input
                id="horario"
                v-model="novaPartida.horario"
                type="time"
              />

            </div>

          </div>


          <!-- =========================
               LOCAL
          ========================== -->
          <div class="form-group">

            <label for="local">
              Local
            </label>

            <input
              id="local"
              v-model="novaPartida.local"
              type="text"
              placeholder="Ex.: Ginásio Municipal"
            />

          </div>


          <!-- ERRO -->
          <div
            v-if="erroFormulario"
            class="form-erro"
          >
            {{ erroFormulario }}
          </div>


          <!-- BOTÕES -->
          <div class="form-actions">

            <button
              type="button"
              class="btn-secondary"
              @click="cancelarCriacao"
            >
              Cancelar
            </button>

            <button
              type="submit"
              class="btn-primary"
              :disabled="carregando"
            >
              {{
                carregando
                  ? 'Salvando...'
                  : 'Cadastrar partida'
              }}
            </button>

          </div>

        </form>

      </template>

    </main>

  </div>
</template>


<script setup>

import { ref, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import api from '../services/api'


// ==========================================
// CONTROLE
// ==========================================

const criandoPartida = ref(false)

const partidas = ref([])

const times = ref([])

const carregando = ref(false)

const erro = ref('')

const erroFormulario = ref('')


// ==========================================
// NOVA PARTIDA
// ==========================================

const novaPartida = ref({
  timeA: '',
  timeB: '',
  data: '',
  horario: '',
  local: ''
})


// ==========================================
// BUSCAR TIMES
// ==========================================

async function carregarTimes() {

  try {

    const resposta = await api.get('/times')

    times.value = resposta.data

    console.log(
      'Times carregados:',
      times.value
    )

  } catch (e) {

    console.error(
      'Erro ao buscar times:',
      e
    )

    erro.value =
      e.response?.data?.mensagem ||
      'Não foi possível carregar os times.'

  }

}


// ==========================================
// BUSCAR PARTIDAS
// ==========================================

async function carregarPartidas() {

  carregando.value = true
  erro.value = ''

  try {

    const resposta = await api.get('/partidas')

    partidas.value = resposta.data

  } catch (e) {

    console.error(
      'Erro ao buscar partidas:',
      e
    )

    erro.value =
      e.response?.data?.mensagem ||
      'Não foi possível carregar as partidas.'

  } finally {

    carregando.value = false

  }

}


// ==========================================
// PEGAR NOME DO TIME
// ==========================================

function nomeDoTime(id) {

  const time = times.value.find(
    time => Number(time.id) === Number(id)
  )

  if (time) {
    return time.nome
  }

  return `Time #${id}`

}


// ==========================================
// ABRIR CRIAÇÃO
// ==========================================

async function abrirCriacao() {

  erroFormulario.value = ''

  criandoPartida.value = true

  await carregarTimes()

}


// ==========================================
// CANCELAR
// ==========================================

function cancelarCriacao() {

  criandoPartida.value = false

  erroFormulario.value = ''

  novaPartida.value = {
    timeA: '',
    timeB: '',
    data: '',
    horario: '',
    local: ''
  }

}


// ==========================================
// CRIAR PARTIDA
// ==========================================

async function criarPartida() {

  erroFormulario.value = ''

  const timeAId = Number(
    novaPartida.value.timeA
  )

  const timeBId = Number(
    novaPartida.value.timeB
  )

  const data =
    novaPartida.value.data

  const horario =
    novaPartida.value.horario

  const local =
    String(
      novaPartida.value.local || ''
    ).trim()


  // ==========================================
  // VALIDAR TIME A
  // ==========================================

  if (!timeAId) {

    erroFormulario.value =
      'Selecione o Time A.'

    return

  }


  // ==========================================
  // VALIDAR TIME B
  // ==========================================

  if (!timeBId) {

    erroFormulario.value =
      'Selecione o Time B.'

    return

  }


  // ==========================================
  // TIMES IGUAIS
  // ==========================================

  if (timeAId === timeBId) {

    erroFormulario.value =
      'Os times precisam ser diferentes.'

    return

  }


  // ==========================================
  // VALIDAR DATA
  // ==========================================

  if (!data) {

    erroFormulario.value =
      'Selecione a data da partida.'

    return

  }


  // ==========================================
  // VALIDAR HORÁRIO
  // ==========================================

  if (!horario) {

    erroFormulario.value =
      'Informe o horário da partida.'

    return

  }


  // ==========================================
  // VALIDAR LOCAL
  // ==========================================

  if (!local) {

    erroFormulario.value =
      'Informe o local da partida.'

    return

  }


  // ==========================================
  // ENVIAR PARA O BACKEND
  // ==========================================

  try {

    carregando.value = true

    const dados = {
      timeAId,
      timeBId,
      data,
      horario,
      local
    }

    console.log(
      'Dados enviados para /partidas:',
      dados
    )

    const resposta = await api.post(
      '/partidas',
      dados
    )


    console.log(
      'Partida cadastrada:',
      resposta.data
    )


    // ==========================================
    // ATUALIZAR LISTA
    // ==========================================

    partidas.value.push(
      resposta.data
    )


    // ==========================================
    // LIMPAR
    // ==========================================

    novaPartida.value = {
      timeA: '',
      timeB: '',
      data: '',
      horario: '',
      local: ''
    }


    erroFormulario.value = ''

    criandoPartida.value = false

  } catch (e) {

    console.error(
      'Erro ao criar partida:',
      e
    )

    console.error(
      'Resposta do servidor:',
      e.response?.data
    )

    erroFormulario.value =
      e.response?.data?.mensagem ||
      'Não foi possível cadastrar a partida.'

  } finally {

    carregando.value = false

  }

}


// ==========================================
// EXCLUIR PARTIDA
// ==========================================

async function excluirPartida(id) {

  const confirmar = confirm(
    'Deseja realmente excluir esta partida?'
  )

  if (!confirmar) {
    return
  }


  try {

    await api.delete(
      `/partidas/${id}`
    )

    partidas.value =
      partidas.value.filter(
        partida =>
          partida.id !== id
      )

  } catch (e) {

    console.error(
      'Erro ao excluir partida:',
      e
    )

    alert(
      e.response?.data?.mensagem ||
      'Não foi possível excluir a partida.'
    )

  }

}


// ==========================================
// FORMATAR DATA
// ==========================================

function formatarData(data) {

  if (!data) {
    return ''
  }

  return new Date(data).toLocaleDateString(
    'pt-BR',
    {
      timeZone: 'UTC'
    }
  )

}


// ==========================================
// QUANDO ABRIR A PÁGINA
// ==========================================

onMounted(async () => {

  await carregarTimes()

  await carregarPartidas()

})

</script>


<style scoped>

.partidas-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f7fb;
}

.partidas-content {
  flex: 1;
  min-width: 0;
  padding: 32px;
  box-sizing: border-box;
  overflow-x: hidden;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.page-header h1 {
  margin: 0 0 6px;
  color: #0b1f4d;
  font-size: 30px;
}

.page-header p {
  margin: 0;
  color: #68738a;
  font-size: 14px;
}


/* ==========================================
   BOTÕES
========================================== */

.btn-primary {
  border: none;
  border-radius: 9px;
  padding: 12px 20px;
  background: #f0b429;
  color: #0b1f4d;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}

.btn-primary:hover {
  transform: translateY(-1px);
  opacity: 0.9;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  border: 1px solid #d5dbea;
  border-radius: 9px;
  padding: 11px 18px;
  background: #fff;
  color: #0b1f4d;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #f1f3f8;
}


/* ==========================================
   MENSAGENS
========================================== */

.mensagem {
  padding: 20px;
  border-radius: 12px;
  background: #fff;
  color: #68738a;
  text-align: center;
}

.mensagem.erro {
  color: #b42318;
  background: #fff1f0;
}


/* ==========================================
   ESTADO VAZIO
========================================== */

.empty-state {
  padding: 60px 20px;
  border-radius: 16px;
  background: #fff;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}

.empty-icon {
  font-size: 45px;
  margin-bottom: 12px;
}

.empty-state h2 {
  margin: 0 0 8px;
  color: #0b1f4d;
}

.empty-state p {
  margin: 0 0 24px;
  color: #68738a;
}


/* ==========================================
   LISTA
========================================== */

.partidas-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.partida-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 22px;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.partida-info {
  flex: 1;
}

.partida-times {
  display: flex;
  align-items: center;
  gap: 25px;
}

.time {
  display: flex;
  flex-direction: column;
  min-width: 150px;
}

.time-label {
  margin-bottom: 5px;
  color: #8993a7;
  font-size: 12px;
}

.time strong {
  color: #0b1f4d;
  font-size: 17px;
}

.vs {
  font-weight: 800;
  color: #f0b429;
}

.partida-detalhes {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 15px;
  color: #68738a;
  font-size: 13px;
}

.btn-delete {
  border: none;
  border-radius: 8px;
  padding: 9px 14px;
  background: #fff0f0;
  color: #c62828;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-delete:hover {
  background: #ffe0e0;
}


/* ==========================================
   FORMULÁRIO
========================================== */

.form-card {
  max-width: 800px;
  padding: 28px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.form-row {
  display: flex;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 20px;
}

.form-group label {
  color: #0b1f4d;
  font-size: 14px;
  font-weight: 700;
}

.form-group input,
.form-group select {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 1px solid #d5dbea;
  border-radius: 9px;
  outline: none;
  background: #fff;
  color: #1f2937;
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #0b1f4d;
}

.form-group select {
  cursor: pointer;
}

.vs-form {
  padding-bottom: 31px;
  color: #f0b429;
  font-weight: 800;
}


/* ==========================================
   ERRO DO FORMULÁRIO
========================================== */

.form-erro {
  margin-top: 5px;
  margin-bottom: 15px;
  padding: 12px;
  border-radius: 8px;
  background: #fff1f0;
  color: #b42318;
  font-size: 14px;
}


/* ==========================================
   AÇÕES
========================================== */

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}


/* ==========================================
   RESPONSIVIDADE
========================================== */

@media (max-width: 900px) {

  .partidas-layout {
    flex-direction: column;
  }

  .partidas-content {
    padding: 20px;
  }

  .page-header {
    align-items: flex-start;
    gap: 15px;
  }

  .partida-card {
    align-items: flex-start;
    flex-direction: column;
  }

  .partida-times {
    flex-wrap: wrap;
  }

  .form-row {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
  }

  .vs-form {
    display: none;
  }

}

</style>