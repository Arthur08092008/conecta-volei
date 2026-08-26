<template>
  <div class="page">
    
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
          <svg width="46" height="46" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#f0b429" stroke-width="1.6" />
            <path
              d="M12 3c2.5 2.5 2.5 15.5 0 18M4.5 8c3 1.8 12 1.8 15 0M4.5 16c3-1.8 12-1.8 15 0"
              stroke="#ffffff"
              stroke-width="1.3"
              fill="none"
            />
          </svg>
        </div>
        <h1>Cadastro de Campeonato</h1>
        <p class="subtitle">Preencha os dados da competição</p>
      </div>
 
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
        <p class="sucesso-titulo">Campeonato criado com sucesso!</p>
        <p class="sucesso-texto">{{ form.nome }} já está pronto para receber inscrições de equipes.</p>
        <button class="btn-secundario" @click="resetar">Cadastrar outro campeonato</button>
      </div>
 
      <form v-else @submit.prevent="handleSubmit">
        <div class="field">
          <label>Nome do campeonato</label>
          <input
            type="text"
            v-model="form.nome"
            placeholder="Ex: Copa Escolar de Vôlei 2026"
          />
        </div>
 
        <div class="linha-dupla">
          <div class="field flex1">
            <label>Data de início</label>
            <input type="date" v-model="form.dataInicio" />
          </div>
          <div class="field flex1">
            <label>Data de término</label>
            <input type="date" v-model="form.dataFim" />
          </div>
        </div>
 
        <div class="field">
          <label>Formato de disputa</label>
          <select v-model="form.formato">
            <option value="GRUPOS">Fase de grupos</option>
            <option value="MATA_MATA">Eliminatória (mata-mata)</option>
            <option value="MISTO">Grupos + eliminatórias</option>
          </select>
        </div>
 
        <div class="field">
          <label>Número máximo de equipes</label>
          <input
            type="number" min="2"
            v-model.number="form.maxEquipes"
            placeholder="Ex: 8"
          />
        </div>
 
        <div class="field">
          <label>Regulamento (opcional)</label>
          <textarea
            v-model="form.regulamento"
            rows="3"
            placeholder="Regras específicas, critérios de desempate, premiação..."
          ></textarea>
        </div>
 
        <p v-if="erro" class="erro">{{ erro }}</p>
 
        <button type="submit" class="btn-principal">Criar campeonato</button>
      </form>
    </div>
  </div>
</template>
 
<script>
export default {
  name: "CadastroCampeonato",
  data() {
    return {
      form: {
        nome: "",
        dataInicio: "",
        dataFim: "",
        formato: "GRUPOS",
        maxEquipes: null,
        regulamento: "",
      },
      enviado: false,
      erro: "",
    };
  },
  methods: {
    handleSubmit() {
      if (!this.form.nome.trim() || !this.form.dataInicio || !this.form.dataFim) {
        this.erro = "Preencha nome, data de início e data de término.";
        return;
      }
 
      if (new Date(this.form.dataFim) < new Date(this.form.dataInicio)) {
        this.erro = "A data de término não pode ser anterior à data de início.";
        return;
      }
 
      if (!this.form.maxEquipes || this.form.maxEquipes < 2) {
        this.erro = "Informe um número de equipes válido (mínimo 2).";
        return;
      }
 
      this.erro = "";
 

      this.enviado = true;
    },
    resetar() {
      this.form = {
        nome: "",
        dataInicio: "",
        dataFim: "",
        formato: "GRUPOS",
        maxEquipes: null,
        regulamento: "",
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
  background: linear-gradient(135deg, #0b1f4d 0%, #122f6b 55%, #163a82 100%);
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
.field select,
.field textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  font-size: 15px;
  border: 1.5px solid #e2e5ec;
  border-radius: 10px;
  outline: none;
  color: #1f2937;
  background: #fafbfc;
  font-family: inherit;
}
 
.field select {
  cursor: pointer;
}
 
.field textarea {
  resize: vertical;
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
</style>
