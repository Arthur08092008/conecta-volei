<template>
  <div class="layout">
    <Sidebar />

    <!-- MENU LATERAL -->
    <Sidebar />

    <!-- CONTEÚDO PRINCIPAL -->
    <main class="main-content">

      <div class="page-header">
        <div>
          <h1>Campeonatos</h1>

          <p>
            {{ campeonatos.length }} campeonato(s) cadastrado(s)
          </p>
        </div>

        <button
          class="btn-primary"
          @click="irParaCadastro"
        >
          + Novo campeonato
        </button>
      </div>

      <!-- CARREGANDO -->
      <p
        v-if="carregando"
        class="msg"
      >
        Carregando campeonatos...
      </p>

      <!-- ERRO -->
      <p
        v-if="erro"
        class="msg erro"
      >
        {{ erro }}
      </p>

      <!-- TABELA -->
      <div
        v-if="!carregando && !erro"
        class="card"
      >

        <table>
          <thead>
            <tr>
              <th>NOME</th>
              <th>PERÍODO</th>
              <th>FORMATO</th>
              <th>Nº EQUIPES</th>
              <th>STATUS</th>
              <th></th>
            </tr>
          </thead>

          <tbody>

            <tr
              v-for="c in campeonatos"
              :key="c.id"
            >

              <td class="nome-cell">
                {{ c.nome }}
              </td>

              <td class="periodo-cell">
                {{ formatarData(c.data_inicio) }}
                -
                {{ formatarData(c.data_fim) }}
              </td>

              <td>
                <span class="badge badge-gold">
                  {{ c.formato }}
                </span>
              </td>

              <td class="equipes-cell">
                {{ c.max_equipes }} equipes
              </td>

              <td>
                <span
                  class="badge"
                  :class="classeStatus(c.status)"
                >
                  {{ c.status }}
                </span>
              </td>

              <td>
                <div class="actions-cell">

                  <button
                    class="btn-excluir"
                    @click="excluirCampeonato(c.id)"
                  >
                    Excluir
                  </button>

                </div>
              </td>

            </tr>

          </tbody>
        </table>

        <!-- NENHUM CAMPEONATO -->
        <div
          v-if="campeonatos.length === 0"
          class="empty-state"
        >
          Nenhum campeonato cadastrado ainda.
        </div>

      </div>

    </main>

  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue'

export default {
  name: 'Campeonatos',
  components: {
    Sidebar,
  },
  data() {
    return {
      campeonatos: [],
      carregando: true,
      erro: null
    }
  },

  mounted() {
    this.carregarCampeonatos()
  },

  methods: {

    async carregarCampeonatos() {

      this.carregando = true
      this.erro = null

      try {

        const resposta = await fetch(
          'http://localhost:3000/campeonatos'
        )

        if (!resposta.ok) {
          throw new Error(
            'Falha ao buscar campeonatos'
          )
        }

        this.campeonatos =
          await resposta.json()

      } catch (e) {

        this.erro =
          'Não foi possível carregar os campeonatos.'

        console.error(e)

      } finally {

        this.carregando = false

      }
    },

    async excluirCampeonato(id) {

      if (
        !confirm(
          'Deseja realmente excluir este campeonato?'
        )
      ) {
        return
      }

      try {

        const resposta = await fetch(
          `http://localhost:3000/campeonatos/${id}`,
          {
            method: 'DELETE'
          }
        )

        if (!resposta.ok) {
          throw new Error(
            'Falha ao excluir campeonato'
          )
        }

        this.campeonatos =
          this.campeonatos.filter(
            c => c.id !== id
          )

      } catch (e) {

        alert(
          'Erro ao excluir campeonato.'
        )

        console.error(e)
      }
    },

    irParaCadastro() {

      this.$router.push(
        '/campeonatos/cadastro'
      )

    },

    formatarData(dataStr) {

      if (!dataStr) {
        return '-'
      }

      const data =
        new Date(dataStr)

      return data.toLocaleDateString(
        'pt-BR',
        {
          timeZone: 'UTC'
        }
      )
    },

    classeStatus(status) {

      if (status === 'Em andamento') {
        return 'badge-green'
      }

      if (status === 'Encerrado') {
        return 'badge-gray'
      }

      return 'badge-purple'
    }

  }
}
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background: #f4f5f9;
  color: #1a1a2e;
}

main {
  flex: 1;
  min-width: 0;

  padding: 40px 48px;

  box-sizing: border-box;

  overflow-x: auto;
}

/* =================================
   CABEÇALHO
================================= */

.page-header {

  display: flex;

  justify-content: space-between;

  align-items: flex-start;

  margin-bottom: 28px;
}

.page-header h1 {

  font-size: 32px;

  font-weight: 800;

  margin: 0 0 6px 0;

  color: #101c46;
}

.page-header p {

  margin: 0;

  color: #6b7280;

  font-size: 15px;
}

/* =================================
   BOTÃO
================================= */

.btn-primary {

  background: #101c46;

  color: #fff;

  border: none;

  padding: 14px 22px;

  border-radius: 10px;

  font-size: 15px;

  font-weight: 700;

  cursor: pointer;

  white-space: nowrap;
}

.btn-primary:hover {

  background: #16224f;
}

/* =================================
   CARD
================================= */

.card {

  background: #fff;

  border-radius: 14px;

  overflow: hidden;

  border: 1px solid #e7e8ef;
}

/* =================================
   TABELA
================================= */

table {

  width: 100%;

  border-collapse: collapse;
}

thead th {

  text-align: left;

  font-size: 12px;

  font-weight: 700;

  color: #6b7280;

  padding: 18px 24px;

  background: #fafafc;

  border-bottom: 1px solid #e7e8ef;
}

tbody td {

  padding: 18px 24px;

  font-size: 15px;

  border-bottom: 1px solid #e7e8ef;
}

tbody tr:last-child td {

  border-bottom: none;
}

/* =================================
   CÉLULAS
================================= */

.nome-cell {

  font-weight: 700;

  color: #101c46;
}

.periodo-cell,
.equipes-cell {

  color: #6b7280;

  font-size: 14px;
}

/* =================================
   BADGES
================================= */

.badge {

  display: inline-block;

  padding: 6px 14px;

  border-radius: 20px;

  font-size: 13px;

  font-weight: 700;

  white-space: nowrap;
}

.badge-purple {

  background: #e7e6fb;

  color: #4b3fd1;
}

.badge-green {

  background: #e3f8ea;

  color: #1f9d55;
}

.badge-gray {

  background: #eef0f4;

  color: #6b7280;
}

.badge-gold {

  background: #fdf1dc;

  color: #a06600;
}

/* =================================
   AÇÕES
================================= */

.actions-cell {

  display: flex;

  justify-content: flex-end;
}

.btn-excluir {

  background: #fde7e9;

  color: #d1435b;

  border: none;

  padding: 9px 16px;

  border-radius: 8px;

  font-size: 14px;

  font-weight: 700;

  cursor: pointer;
}

.btn-excluir:hover {

  background: #f8d5d9;
}

/* =================================
   VAZIO
================================= */

.empty-state {

  padding: 60px 24px;

  text-align: center;

  color: #6b7280;
}

/* =================================
   MENSAGENS
================================= */

.msg {

  padding: 24px;

  color: #6b7280;
}

.msg.erro {

  color: #d1435b;
}

/* =================================
   RESPONSIVO
================================= */

@media (max-width: 900px) {

  .main-content {

    padding: 24px;
  }

}

@media (max-width: 700px) {

  .page-header {

    flex-direction: column;

    gap: 16px;
  }

  .btn-primary {

    width: 100%;
  }

  .card {

    overflow-x: auto;
  }

  table {

    min-width: 700px;
  }

}

</style>