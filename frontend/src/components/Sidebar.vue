<script setup>
// Ícones inline simples (sem libs externas), mesmo padrão usado no Inicio.vue.
// Se os seus ícones reais (IconHome, IconTimes, IconTrophy, etc.) tiverem paths
// diferentes destes, é só substituir o "d" de cada <path> pelo path real que
// você já tem no svgIcon() do Inicio.vue — a estrutura do componente continua igual.

function svgIcon(paths) {
  return {
    props: {},
    render() {
      return h(
        'svg',
        {
          viewBox: '0 0 24 24',
          width: '20',
          height: '20',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': '2',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round'
        },
        paths.map(d => h('path', { d }))
      )
    }
  }
}

import { h } from 'vue'

const IconHome = svgIcon(['M3 9l9-7 9 7', 'M9 22V12h6v10', 'M21 9v11a1 1 0 0 1-1 1h-4', 'M4 9v11a1 1 0 0 0 1 1h4'])
const IconTimes = svgIcon(['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M23 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'])
const IconTrophy = svgIcon(['M8 21h8', 'M12 17v4', 'M7 4h10v5a5 5 0 0 1-10 0V4z', 'M17 5h3a2 2 0 0 1-2 4', 'M7 5H4a2 2 0 0 0 2 4'])
const IconCalendar = svgIcon(['M8 2v4', 'M16 2v4', 'M3 10h18', 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z'])
const IconTable = svgIcon(['M3 5h18', 'M3 12h18', 'M3 19h18'])
const IconChecklist = svgIcon(['M9 11l3 3L22 4', 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'])
const IconUser = svgIcon(['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'])
</script>

<template>
  <aside class="sidebar">
    <div class="logo">
      <div class="logo-badge">
        <img src="../assets/logo.jpeg" alt="Logo VoleiTCC" />
      </div>
      <span class="logo-title">Conecta Volei</span>
    </div>

    <nav class="nav">
      <router-link to="/inicio" class="nav-item" active-class="nav-item-active">
        <component :is="IconHome" />
        <span>Início</span>
      </router-link>

      <router-link to="/times" class="nav-item" active-class="nav-item-active">
        <component :is="IconTimes" />
        <span>Times</span>
      </router-link>

      <router-link to="/campeonatos" class="nav-item" active-class="nav-item-active">
        <component :is="IconTrophy" />
        <span>Campeonatos</span>
      </router-link>

      <router-link to="/agendas" class="nav-item" active-class="nav-item-active">
        <component :is="IconCalendar" />
        <span>Agendas</span>
      </router-link>
      
      <router-link to="/checklist" class="nav-item" active-class="nav-item-active">
        <component :is="IconChecklist" />
        <span>Checklist</span>
      </router-link>

      <router-link to="/perfil" class="nav-item" active-class="nav-item-active">
        <component :is="IconUser" />
        <span>Perfil</span>
      </router-link>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 220px;
  min-height: 100vh;
  background: #0b1440;
  color: #cfd6f7;
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 32px;
}

.logo-badge {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #f0b429;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.logo-badge img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logo-title {
  font-weight: 800;
  font-size: 1.1rem;
  color: #fff;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  color: #cfd6f7;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.15s ease, color 0.15s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.nav-item-active {
  background: #f0b429;
  color: #0b1440;
}
</style>