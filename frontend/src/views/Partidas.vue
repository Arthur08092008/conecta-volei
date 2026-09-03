<template>
  <div class="partidas-page">

    <!-- =========================
         TELA DE PARTIDAS
    ========================== -->

    <div v-if="!criandoPartida">

      <div class="page-header">
        <div>
          <h1>Partidas</h1>
          <p>{{ partidas.length }} partida(s) cadastrada(s)</p>
        </div>

        <!-- BOTÃO NOVA PARTIDA -->
        <button
          class="btn-nova-partida"
          @click="abrirCriacao"
        >
          + Nova partida
        </button>
       </div>


      <div class="partidas-container">

        <!-- QUANDO NÃO EXISTIR PARTIDA -->
        <div
          v-if="partidas.length === 0"
          class="sem-partidas"
        >

          <div class="mensagem-vazia">

            <div class="icone-bola">
              🏐
            </div>

            <h2>Nenhuma partida cadastrada</h2>

            <p>
              Clique em "Nova partida" para cadastrar uma partida.
            </p>

            <button
              class="btn-criar"
              @click="abrirCriacao"
            >
              + Criar nova partida
            </button>

          </div>

        </div>


        <!-- PARTIDAS CADASTRADAS -->
        <div
          v-else
          v-for="partida in partidas"
          :key="partida.id"
          class="partida-card"
        >

          <div>
            <strong>{{ partida.timeA }}</strong>

            <span class="versus">
              x
            </span>

            <strong>{{ partida.timeB }}</strong>
          </div>

          <div class="partida-info">

            <span>
              📅 {{ partida.data }}
            </span>

            <span>
              🕐 {{ partida.horario }}
            </span>

            <span>
              📍 {{ partida.local }}
            </span>

          </div>

        </div>

      </div>

    </div>


    <!-- =========================
         TELA DE CRIAR PARTIDA
    ========================== -->

    <div v-else class="criar-partida-page">

      <div class="criar-header">

        <div>

          <h1>Nova partida</h1>

          <p>
            Cadastre uma nova partida de vôlei
          </p>

        </div>

        <!-- VOLTAR -->
        <button
          class="btn-voltar"
          @click="cancelarCriacao"
        >
          ← Voltar
        </button>

      </div>


      <!-- FORMULÁRIO -->

      <div class="form-container">

        <div class="form-titulo">

          <h2>Dados da partida</h2>

          <p>
            Preencha as informações abaixo.
          </p>

        </div>


        <!-- TIMES -->

        <div class="times-container">

          <!-- TIME A -->

          <div class="campo">

            <label>
              Time A
            </label>

            <select v-model="novaPartida.timeA">

              <option value="">
                Selecione o time
              </option>

              <option value="Time Azul">
                Time Azul
              </option>

              <option value="Time Amarelo">
                Time Amarelo
              </option>

              <option value="Time Vermelho">
                Time Vermelho
              </option>

            </select>

          </div>


          <div class="vs">
            X
          </div>


          <!-- TIME B -->

          <div class="campo">

            <label>
              Time B
            </label>

            <select v-model="novaPartida.timeB">

              <option value="">
                Selecione o time
              </option>

              <option value="Time Azul">
                Time Azul
              </option>

              <option value="Time Amarelo">
                Time Amarelo
              </option>

              <option value="Time Vermelho">
                Time Vermelho
              </option>

            </select>

          </div>

        </div>


        <!-- DATA -->

        <div class="campo">

          <label>
            Data da partida
          </label>

          <input
            type="date"
            v-model="novaPartida.data"
          >

        </div>


        <!-- HORÁRIO -->

        <div class="campo">

          <label>
            Horário
          </label>

          <input
            type="time"
            v-model="novaPartida.horario"
          >

        </div>


        <!-- LOCAL -->

        <div class="campo">

          <label>
            Local da partida
          </label>

          <input
            type="text"
            v-model="novaPartida.local"
            placeholder="Ex.: Quadra da escola"
          >

        </div>


        <!-- BOTÕES -->

        <div class="form-botoes">

          <button
            class="btn-cancelar"
            @click="cancelarCriacao"
          >
            Cancelar
          </button>

          <button
            class="btn-salvar"
            @click="criarPartida"
          >
            Criar partida
          </button>

        </div>

      </div>

    </div>

  </div>
</template>


<script setup>

import { ref } from 'vue'


/* =================================
   CONTROLE DA TELA
================================= */

const criandoPartida = ref(false)


/* =================================
   PARTIDAS
================================= */

const partidas = ref([])


/* =================================
   NOVA PARTIDA
================================= */

const novaPartida = ref({

  timeA: '',

  timeB: '',

  data: '',

  horario: '',

  local: ''

})


/* =================================
   ABRIR TELA DE CRIAÇÃO
================================= */

function abrirCriacao() {

  criandoPartida.value = true

}


/* =================================
   CANCELAR
================================= */

function cancelarCriacao() {

  criandoPartida.value = false

}


/* =================================
   CRIAR PARTIDA
================================= */

function criarPartida() {

  // Verificar campos

  if (
    !novaPartida.value.timeA ||
    !novaPartida.value.timeB ||
    !novaPartida.value.data ||
    !novaPartida.value.horario ||
    !novaPartida.value.local
  ) {

    alert('Preencha todos os campos.')

    return

  }


  // Não permite o mesmo time

  if (
    novaPartida.value.timeA ===
    novaPartida.value.timeB
  ) {

    alert('Os times precisam ser diferentes.')

    return

  }


  // Criar partida

  const nova = {

    id: Date.now(),

    timeA: novaPartida.value.timeA,

    timeB: novaPartida.value.timeB,

    data: novaPartida.value.data,

    horario: novaPartida.value.horario,

    local: novaPartida.value.local

  }


  // Adicionar na lista

  partidas.value.push(nova)


  // Limpar formulário

  novaPartida.value = {

    timeA: '',

    timeB: '',

    data: '',

    horario: '',

    local: ''

  }


  // Voltar para partidas

  criandoPartida.value = false

}

</script>


<style scoped>

.partidas-page {

  padding: 40px 46px;

  background: #f5f6fa;

  min-height: 100vh;

}


/* =================================
   CABEÇALHO
================================= */

.page-header,
.criar-header {

  display: flex;

  justify-content: space-between;

  align-items: flex-start;

  margin-bottom: 45px;

}


h1 {

  margin: 0;

  color: #0d2354;

  font-size: 42px;

  font-weight: 800;

}


.page-header p,
.criar-header p {

  margin-top: 8px;

  color: #667085;

  font-size: 20px;

}


/* =================================
   BOTÃO NOVA PARTIDA
================================= */

.btn-nova-partida {

  background: #0d2354;

  color: white;

  border: none;

  border-radius: 15px;

  padding: 18px 30px;

  font-size: 20px;

  font-weight: 700;

  cursor: pointer;

}


.btn-nova-partida:hover {

  background: #172f68;

}


/* =================================
   CONTAINER PARTIDAS
================================= */

.partidas-container {

  background: white;

  border-radius: 22px;

  min-height: 500px;

  padding: 30px;

  box-shadow:
    0 2px 10px rgba(0, 0, 0, 0.03);

}


/* =================================
   NENHUMA PARTIDA
================================= */

.sem-partidas {

  display: flex;

  align-items: center;

  justify-content: center;

  min-height: 440px;

}


.mensagem-vazia {

  text-align: center;

}


.icone-bola {

  font-size: 60px;

  margin-bottom: 15px;

}


.mensagem-vazia h2 {

  color: #0d2354;

  margin: 0;

  font-size: 25px;

}


.mensagem-vazia p {

  color: #667085;

  font-size: 17px;

  margin: 10px 0 25px;

}


.btn-criar {

  background: #f5b923;

  color: #0d2354;

  border: none;

  border-radius: 10px;

  padding: 13px 22px;

  font-size: 16px;

  font-weight: 700;

  cursor: pointer;

}


/* =================================
   CARD DA PARTIDA
================================= */

.partida-card {

  display: flex;

  justify-content: space-between;

  align-items: center;

  padding: 24px;

  margin-bottom: 15px;

  border: 1px solid #e5e7eb;

  border-radius: 14px;

}


.partida-card strong {

  color: #0d2354;

  font-size: 20px;

}


.versus {

  margin: 0 15px;

  color: #667085;

  font-weight: bold;

}


.partida-info {

  display: flex;

  gap: 25px;

  color: #667085;

}


/* =================================
   TELA CRIAR PARTIDA
================================= */

.criar-partida-page {

  width: 100%;

}


.btn-voltar {

  background: white;

  color: #0d2354;

  border: 1px solid #d0d5dd;

  border-radius: 12px;

  padding: 15px 25px;

  font-size: 17px;

  font-weight: 700;

  cursor: pointer;

}


.btn-voltar:hover {

  background: #f5f6fa;

}


/* =================================
   FORMULÁRIO
================================= */

.form-container {

  background: white;

  border-radius: 22px;

  padding: 35px;

  max-width: 900px;

  box-shadow:
    0 2px 10px rgba(0, 0, 0, 0.03);

}


.form-titulo {

  margin-bottom: 30px;

}


.form-titulo h2 {

  margin: 0;

  color: #0d2354;

  font-size: 25px;

}


.form-titulo p {

  color: #667085;

  margin-top: 7px;

}


/* =================================
   TIMES
================================= */

.times-container {

  display: grid;

  grid-template-columns: 1fr 60px 1fr;

  gap: 20px;

  align-items: end;

  margin-bottom: 25px;

}


.vs {

  display: flex;

  justify-content: center;

  align-items: center;

  height: 48px;

  color: #0d2354;

  font-weight: 800;

  font-size: 20px;

}


/* =================================
   CAMPOS
================================= */

.campo {

  display: flex;

  flex-direction: column;

  margin-bottom: 22px;

}


.campo label {

  margin-bottom: 8px;

  color: #0d2354;

  font-weight: 700;

  font-size: 16px;

}


.campo input,
.campo select {

  height: 50px;

  border: 1px solid #d0d5dd;

  border-radius: 10px;

  padding: 0 14px;

  font-size: 16px;

  color: #344054;

  background: white;

  outline: none;

}


.campo input:focus,
.campo select:focus {

  border-color: #0d2354;

  box-shadow:
    0 0 0 3px rgba(13, 35, 84, 0.08);

}


/* =================================
   BOTÕES
================================= */

.form-botoes {

  display: flex;

  justify-content: flex-end;

  gap: 15px;

  margin-top: 30px;

  padding-top: 25px;

  border-top: 1px solid #eaecf0;

}


.btn-cancelar {

  background: #f2f4f7;

  color: #344054;

  border: none;

  border-radius: 10px;

  padding: 15px 25px;

  font-size: 16px;

  font-weight: 700;

  cursor: pointer;

}


.btn-salvar {

  background: #0d2354;

  color: white;

  border: none;

  border-radius: 10px;

  padding: 15px 25px;

  font-size: 16px;

  font-weight: 700;

  cursor: pointer;

}


.btn-salvar:hover {

  background: #172f68;

}


/* =================================
   RESPONSIVO
================================= */

@media (max-width: 700px) {

  .partidas-page {

    padding: 25px;

  }


  .page-header,
  .criar-header {

    flex-direction: column;

    gap: 20px;

  }


  .times-container {

    grid-template-columns: 1fr;

  }


  .vs {

    height: auto;

  }


  .partida-card {

    flex-direction: column;

    align-items: flex-start;

    gap: 20px;

  }


  .partida-info {

    flex-direction: column;

    gap: 8px;

  }

}

</style>