<template>
  <div>
    <div class="text-center display-3 h3">{{ leagueId }}</div>
    <b-button-group class="d-flex">
      <b-button class="col-4" :variant="selectedTab === 'Dashboard' ? 'primary' : 'outline-primary'" @click="selectedTab = 'Dashboard'"> <b-icon-forge-line-chart /> Dashboard </b-button>
      <b-button class="col-4" :variant="selectedTab === 'Fixtures' ? 'primary' : 'outline-primary'" @click="selectedTab = 'Fixtures'"> <b-icon-calendar-week /> Fixtures </b-button>
      <b-button class="col-4" :variant="selectedTab === 'Players' ? 'primary' : 'outline-primary'" @click="selectedTab = 'Players'"> <b-icon-person /> Players </b-button>
    </b-button-group>
    <b-button-group class="d-flex mb-3">
      <b-button class="col-4" :variant="selectedTab === 'Table' ? 'primary' : 'outline-primary'" @click="selectedTab = 'Table'"> <b-icon-table /> Table </b-button>
      <b-button class="col-4" :variant="selectedTab === 'Organise' ? 'primary' : 'outline-primary'" @click="selectedTab = 'Organise'"> <b-icon-clipboard-data /> Organise </b-button>
      <b-button class="col-4" :variant="selectedTab === 'Settings' ? 'primary' : 'outline-primary'" @click="selectedTab = 'Settings'"> <b-icon-gear /> Settings </b-button>
    </b-button-group>
    <league-players v-if="selectedTab === 'Players'" :id="leagueId"></league-players>
    <Games v-if="selectedTab === 'Fixtures'" :id="leagueId" />
    <league-dashboard v-if="selectedTab === 'Dashboard'" :id="leagueId"></league-dashboard>
    <league-table v-if="selectedTab === 'Table'" :id="leagueId"></league-table>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue2-helpers/vue-router'
import LeaguePlayers from '../../components/league-admin/league-players.vue'
import { ref } from 'vue'
import Games from '../../components/league-admin/games.vue'
import LeagueTable from '../../components/league-admin/league-table.vue'

const tabList = ['Dashboard', 'Fixtures', 'Players', 'Table', 'Organise', 'Settings'] as const
type Tab = typeof tabList[number]
const leagueId = ref(useRoute().params.id)

const selectedTab = ref<Tab>('Players')
</script>
