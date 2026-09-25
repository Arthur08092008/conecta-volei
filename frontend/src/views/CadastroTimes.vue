<template>
  <Sidebar />

  <div class="page">
    <!-- marca decorativa no canto -->
    <svg
      class="logo-bg"
      width="480"
      height="480"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle cx="12" cy="12" r="9" stroke="#f0b429" stroke-width="0.5" />
      <path
        d="M12 3c2.5 2.5 2.5 15.5 0 18M4.5 8c3 1.8 12 1.8 15 0M4.5 16c3-1.8 12-1.8 15 0"
        stroke="#f0b429"
        stroke-width="0.4"
        fill="none"
      />
    </svg>

    <div class="circle-bg"></div>

    <div class="card">
      <div class="header">
        <div class="logo-circle">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path
              d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
              stroke="#ffffff"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle
              cx="9"
              cy="7"
              r="4"
              stroke="#ffffff"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M23 21v-2a4 4 0 0 0-3-3.87"
              stroke="#ffffff"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M16 3.13a4 4 0 0 1 0 7.75"
              stroke="#ffffff"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <h1>Cadastro de Time</h1>
        <p class="subtitle">Preencha os dados da equipe</p>
      </div>

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

      <div v-if="enviado" class="sucesso">
        <div class="check-circle">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="#1f9d55"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <p class="sucesso-titulo">
          Time cadastrado com sucesso!
        </p>

        <p class="sucesso-texto">
          {{ form.nome }} já pode participar das competições.
        </p>

        <button
          class="btn-secundario"
          @click="resetar"
        >
          Cadastrar outro time
        </button>
      </div>

      <form
        v-else
        @submit.prevent="handleSubmit"
      >
        <div class="field">
          <label>Nome do time</label>

          <input
            type="text"
            v-model="form.nome"
            placeholder="Ex: Águias Vôlei Clube"
          />
        </div>

        <div class="field">
          <label>Cidade</label>

          <input
            type="text"
            v-model="form.cidade"
            placeholder="Ex: São Paulo"
          />
        </div>

        <div class="field">
          <label>Categoria</label>

          <select v-model="form.categoria">
            <option>Masculino</option>
            <option>Feminino</option>
            <option>Misto</option>
          </select>
        </div>

        <div class="field">
          <label>Técnico responsável</label>

          <input
            type="text"
            v-model="form.tecnico"
            placeholder="Nome completo"
          />
        </div>

        <div class="linha-dupla">
          <div class="field flex1">
            <label>E-mail de contato</label>

            <input
              type="email"
              v-model="form.email"
              placeholder="time@exemplo.com"
            />
          </div>

          <div class="field flex1">
            <label>Telefone</label>

            <input
              type="tel"
              v-model="form.telefone"
              placeholder="(00) 00000-0000"
            />
          </div>
        </div>

        <p
          v-if="erro"
          class="erro"
        >
          {{ erro }}
        </p>

        <button
          type="submit"
          class="btn-principal"
          :disabled="carregando"
        >
          {{ carregando ? "Cadastrando..." : "Cadastrar time" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import Sidebar from "../components/Sidebar.vue";
import api from "../services/api";
import { Icon } from "@iconify/vue";

export default {
  name: "CadastroTimes",

  components: {
    Sidebar,
    Icon,
  },

  data() {
    return {
      form: {
        nome: "",
        cidade: "",
        categoria: "Masculino",
        tecnico: "",
        email: "",
        telefone: "",
      },

      enviado: false,
      erro: "",
      carregando: false,
    };
  },

  methods: {
    voltar() {
      window.history.back();
    },

    async handleSubmit() {
      if (
        !this.form.nome.trim() ||
        !this.form.cidade.trim() ||
        !this.form.tecnico.trim()
      ) {
        this.erro =
          "Preencha nome do time, cidade e técnico responsável.";
        return;
      }

      this.erro = "";
      this.carregando = true;

      try {
        await api.post("/times", this.form);

        this.enviado = true;
      } catch (e) {
        this.erro =
          e.response?.data?.mensagem ||
          "Não foi possível cadastrar o time.";
      } finally {
        this.carregando = false;
      }
    },

    resetar() {
      this.form = {
        nome: "",
        cidade: "",
        categoria: "Masculino",
        tecnico: "",
        email: "",
        telefone: "",
      };

      this.enviado = false;
    },
  },
};
</script>

<style scoped>
.page {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(
    135deg,
    #0b1f4d 0%,
    #122f6b 55%,
    #163a82 100%
  );

  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
  overflow: hidden;

  font-family: "Segoe UI", system-ui, -apple-system, sans-serif;

  padding: 40px 20px;
}

.logo-bg {
  position: absolute;
  bottom: -140px;
  right: -120px;
  opacity: 0.9;
}

.circle-bg {
  position: absolute;
  top: -180px;
  left: -200px;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
}

.card {
  position: relative;
  z-index: 1;

  background: #ffffff;

  border-radius: 20px;

  width: 100%;
  max-width: 520px;

  padding: 44px 48px 40px;

  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.35);
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;

  margin-bottom: 8px;
}

.logo-circle {
  width: 84px;
  height: 84px;

  border-radius: 50%;

  background: #0b1f4d;

  border: 3px solid #f0b429;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 18px;
}

h1 {
  color: #0b1f4d;

  font-size: 28px;
  font-weight: 800;

  margin: 0;
}

.subtitle {
  color: #6b7280;

  font-size: 15px;

  margin-top: 6px;
}

/* BOTÃO VOLTAR */

.btn-voltar {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  margin-top: 20px;
  margin-bottom: 24px;

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

.field {
  margin-bottom: 16px;
}

.field label {
  display: block;

  color: #0b1f4d;

  font-size: 14px;
  font-weight: 600;

  margin-bottom: 6px;
}

.field input,
.field select {
  width: 100%;
  box-sizing: border-box;

  padding: 12px 14px;

  font-size: 15px;

  border: 1.5px solid #e2e5ec;
  border-radius: 10px;

  outline: none;

  color: #1f2937;

  background: #fafbfc;
}

.field select {
  cursor: pointer;
}

.linha-dupla {
  display: flex;
  gap: 12px;
}

.flex1 {
  flex: 1;
}

.erro {
  color: #d93025;

  font-size: 13.5px;

  margin-top: 4px;
  margin-bottom: 4px;
}

.btn-principal {
  width: 100%;

  background: #0b1f4d;
  color: #fff;

  border: none;
  border-radius: 10px;

  padding: 14px;

  font-size: 16px;
  font-weight: 700;

  cursor: pointer;

  margin-top: 16px;

  transition: background 0.15s;
}

.btn-principal:hover {
  background: #122f6b;
}

.btn-principal:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.sucesso {
  text-align: center;

  padding: 24px 0;
}

.check-circle {
  width: 56px;
  height: 56px;

  border-radius: 50%;

  background: #e8f7ee;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 16px;
}

.sucesso-titulo {
  color: #0b1f4d;

  font-weight: 600;

  font-size: 17px;

  margin-bottom: 4px;
}

.sucesso-texto {
  color: #6b7280;

  font-size: 14px;

  margin-bottom: 24px;
}

.btn-secundario {
  background: #0b1f4d;
  color: #fff;

  border: none;
  border-radius: 10px;

  padding: 12px 24px;

  font-size: 15px;
  font-weight: 600;

  cursor: pointer;
}

/* RESPONSIVIDADE */

@media (max-width: 600px) {
  .page {
    padding: 25px 15px;
  }

  .card {
    padding: 32px 24px;
  }

  h1 {
    font-size: 24px;
  }

  .linha-dupla {
    flex-direction: column;
    gap: 0;
  }
}
</style>