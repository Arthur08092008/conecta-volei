<template>
  <div class="app-shell">

    <Sidebar />

    <main class="content">

      <div class="fundo">

        <div class="card">

          <!-- SETA VOLTAR -->
          <button
            class="btn-voltar"
            type="button"
            title="Voltar"
            @click="voltar"
          >
            <Icon
              icon="carbon:chevron-left"
              width="24"
              height="24"
            />
          </button>

          <!-- ÍCONE -->
          <div class="icone">

            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
            >

              <path
                d="M8 4h8v4a4 4 0 01-8 0V4z"
                stroke="#f0a800"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />

              <path
                d="M8 4H4v2a4 4 0 004 4"
                stroke="#f0a800"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />

              <path
                d="M16 4h4v2a4 4 0 01-4 4"
                stroke="#f0a800"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />

              <path
                d="M12 12v4"
                stroke="#f0a800"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />

              <path
                d="M9 20h6"
                stroke="#f0a800"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />

              <path
                d="M10 16h4v4h-4z"
                stroke="#f0a800"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />

            </svg>

          </div>

          <h1>Cadastro de Campeonato</h1>

          <p class="subtitulo">
            Preencha os dados da competição
          </p>


          <!-- FORMULÁRIO -->
          <form @submit.prevent="salvar">


            <!-- NOME -->
            <div class="campo">

              <label for="nome">
                Nome do campeonato
              </label>

              <input
                id="nome"
                v-model="form.nome"
                type="text"
                placeholder="Ex: Copa Escolar de Vôlei 2026"
                required
              />

            </div>


            <!-- DATAS -->
            <div class="linha">

              <div class="campo">

                <label for="inicio">
                  Data de início
                </label>

                <input
                  id="inicio"
                  v-model="form.data_inicio"
                  type="date"
                  required
                />

              </div>


              <div class="campo">

                <label for="fim">
                  Data de término
                </label>

                <input
                  id="fim"
                  v-model="form.data_fim"
                  type="date"
                  required
                />

              </div>

            </div>


            <!-- FORMATO -->
            <div class="campo">

              <label for="formato">
                Formato de disputa
              </label>

              <select
                id="formato"
                v-model="form.formato"
                required
              >

                <option
                  disabled
                  value=""
                >
                  Selecione
                </option>

                <option value="GRUPOS">
                  Fase de grupos
                </option>

                <option value="MATA_MATA">
                  Eliminatória (mata-mata)
                </option>

                <option value="MISTO">
                  Misto (grupos + mata-mata)
                </option>

              </select>

            </div>


            <!-- MÁXIMO DE EQUIPES -->
            <div class="campo">

              <label for="max_equipes">
                Número máximo de equipes
              </label>

              <input
                id="max_equipes"
                v-model.number="form.max_equipes"
                type="number"
                min="2"
                placeholder="Ex: 8"
                required
              />

            </div>


            <!-- STATUS -->
            <div class="campo">

              <label for="status">
                Status
              </label>

              <select
                id="status"
                v-model="form.status"
              >

                <option value="planejado">
                  Planejado
                </option>

                <option value="em andamento">
                  Em andamento
                </option>

                <option value="finalizado">
                  Finalizado
                </option>

                <option value="cancelado">
                  Cancelado
                </option>

              </select>

            </div>


            <!-- VISIBILIDADE -->
            <div class="campo">

              <label for="publico">
                Visibilidade do campeonato
              </label>

              <select
                id="publico"
                v-model="form.publico"
                required
              >

                <option :value="true">
                  Público
                </option>

                <option :value="false">
                  Privado
                </option>

              </select>

              <small class="ajuda">

                <span v-if="form.publico">
                  Este campeonato ficará visível para os usuários.
                </span>

                <span v-else>
                  Este campeonato ficará privado e não será exibido na lista pública.
                </span>

              </small>

            </div>


            <!-- REGULAMENTO -->
            <div class="campo">

              <label for="regulamento">
                Regulamento (opcional)
              </label>

              <textarea
                id="regulamento"
                v-model="form.regulamento"
                rows="3"
                placeholder="Regras da competição..."
              ></textarea>

            </div>


            <!-- ERRO -->
            <p
              v-if="erro"
              class="msg-erro"
            >
              {{ erro }}
            </p>


            <!-- AÇÕES -->
            <div class="acoes">

              <button
                type="submit"
                class="btn-primario"
                :disabled="salvando"
              >

                {{
                  salvando
                    ? 'Salvando...'
                    : 'Salvar campeonato'
                }}

              </button>

            </div>

          </form>

        </div>

      </div>

    </main>

  </div>
</template>


<script>

import { Icon } from '@iconify/vue'
import Sidebar from '../components/Sidebar.vue'

export default {

  name: 'CadastroCampeonato',

  components: {
    Sidebar,
    Icon
  },

  data() {

    return {

      form: {

        nome: '',

        data_inicio: '',

        data_fim: '',

        formato: '',

        max_equipes: null,

        status: 'planejado',

        // NOVO
        // true = público
        // false = privado
        publico: true,

        regulamento: ''

      },

      salvando: false,

      erro: null

    }

  },


  methods: {

    /* =========================
       VOLTAR
    ========================= */

    voltar() {

      window.history.back()

    },


    /* =========================
       SALVAR CAMPEONATO
    ========================= */

    async salvar() {

      this.salvando = true

      this.erro = null

      try {

        const resposta = await fetch(
          'http://localhost:3000/campeonatos',
          {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json'
            },

            body: JSON.stringify(
              this.form
            )

          }
        )


        if (!resposta.ok) {

          const mensagem =
            await resposta.text()

          console.error(
            'Erro do servidor:',
            mensagem
          )

          throw new Error(
            'Falha ao salvar campeonato'
          )

        }


        // Depois de salvar,
        // volta para a lista.
        this.$router.push(
          '/campeonatos'
        )


      } catch (e) {

        this.erro =
          'Não foi possível salvar o campeonato. Tente novamente.'

        console.error(
          'Erro ao salvar:',
          e
        )

      } finally {

        this.salvando = false

      }

    }

  }

}

</script>


<style scoped>

/* =========================
   ESTRUTURA
========================= */

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

  overflow-y: auto;

}


/* =========================
   FUNDO
========================= */

.fundo {

  min-height: 100vh;

  display: flex;

  align-items: center;

  justify-content: center;

  background: linear-gradient(
    135deg,
    #16224f 0%,
    #101c46 60%,
    #0b1533 100%
  );

  padding: 40px 20px;

}


/* =========================
   CARD
========================= */

.card {

  position: relative;

  background: #fff;

  border-radius: 20px;

  padding: 40px;

  width: 100%;

  max-width: 480px;

  box-sizing: border-box;

}


/* =========================
   SETA VOLTAR
========================= */

.btn-voltar {

  position: absolute;

  top: 20px;

  left: 20px;

  z-index: 2;

  width: 40px;

  height: 40px;

  display: flex;

  align-items: center;

  justify-content: center;

  border: 1.5px solid #e7e8ef;

  border-radius: 50%;

  background: #fafbfd;

  color: #101c46;

  cursor: pointer;

  transition:
    background 0.2s,
    border-color 0.2s,
    transform 0.2s;

}


.btn-voltar:hover {

  background: #eef1f6;

  border-color: #101c46;

  transform: translateX(-3px);

}


/* =========================
   ÍCONE
========================= */

.icone {

  width: 72px;

  height: 72px;

  border-radius: 50%;

  background: #101c46;

  border: 3px solid #f0a800;

  display: flex;

  align-items: center;

  justify-content: center;

  margin: 0 auto 20px auto;

  overflow: hidden;

}


/* =========================
   TÍTULO
========================= */

h1 {

  text-align: center;

  font-size: 24px;

  font-weight: 800;

  color: #101c46;

  margin: 0 0 8px 0;

}


.subtitulo {

  text-align: center;

  color: #6b7280;

  font-size: 14px;

  margin: 0 0 20px 0;

}


/* =========================
   CAMPOS
========================= */

.campo {

  margin-bottom: 16px;

  flex: 1;

}


.campo label {

  display: block;

  font-size: 13px;

  font-weight: 700;

  color: #101c46;

  margin-bottom: 6px;

}


.campo input,
.campo select,
.campo textarea {

  width: 100%;

  padding: 11px 14px;

  border-radius: 8px;

  border: 1px solid #e7e8ef;

  font-size: 14px;

  font-family: inherit;

  background: #fafbfd;

  box-sizing: border-box;

  outline: none;

}


.campo input:focus,
.campo select:focus,
.campo textarea:focus {

  border-color: #101c46;

}


/* =========================
   AJUDA VISIBILIDADE
========================= */

.ajuda {

  display: block;

  margin-top: 6px;

  font-size: 12px;

  line-height: 1.4;

  color: #6b7280;

}


/* =========================
   LINHA
========================= */

.linha {

  display: flex;

  gap: 14px;

}


/* =========================
   ERRO
========================= */

.msg-erro {

  color: #d1435b;

  font-size: 14px;

  margin: 0 0 12px 0;

}


/* =========================
   AÇÕES
========================= */

.acoes {

  display: flex;

  justify-content: flex-end;

  gap: 10px;

  margin-top: 8px;

}


/* =========================
   BOTÃO SALVAR
========================= */

.btn-primario {

  width: 100%;

  background: #101c46;

  color: #fff;

  border: none;

  padding: 12px 22px;

  border-radius: 10px;

  font-size: 14px;

  font-weight: 700;

  cursor: pointer;

  transition:
    background 0.2s,
    transform 0.2s;

}


.btn-primario:hover:not(:disabled) {

  background: #17275f;

  transform: translateY(-1px);

}


.btn-primario:disabled {

  opacity: 0.6;

  cursor: not-allowed;

}


/* =========================
   RESPONSIVIDADE
========================= */

@media (max-width: 900px) {

  .app-shell {

    flex-direction: column;

  }

  .fundo {

    padding: 24px 16px;

  }

}


@media (max-width: 600px) {

  .card {

    padding: 28px 20px;

    border-radius: 16px;

  }

  .linha {

    flex-direction: column;

    gap: 0;

  }

  h1 {

    font-size: 21px;

  }

}

</style>