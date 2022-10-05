<template>
  <div>
    <forge-page-header :title="leagueId">
      <b-form-group v-slot="{ ariaDescribedby }">
        <b-form-radio-group
            id="btn-radios-1"
            v-model="selectedTab"
            :options="tabList"
            :aria-describedby="ariaDescribedby"
            button-variant="outline-primary"
            buttons
        ></b-form-radio-group>
      </b-form-group>
    </forge-page-header>
    <league-players v-if="selectedTab === 'players'" :id="leagueId"></league-players>
    <Games v-if="selectedTab === 'fixtures'" :id="leagueId" />
    <league-dashboard v-if="selectedTab === 'dashboard'" :id="leagueId"></league-dashboard>
  </div>
</template>

<script lang="ts" setup>

import { useRoute } from 'vue2-helpers/vue-router';
import LeaguePlayers from "../../components/league-admin/league-players.vue";
import { ref } from "vue";
import Games from "../../components/league-admin/games.vue";

const tabList = ['players', 'fixtures', 'dashboard'] as const;
type Tab = typeof tabList[number];
const leagueId = ref(useRoute().params.id);

const selectedTab = ref<Tab>('players')


</script>