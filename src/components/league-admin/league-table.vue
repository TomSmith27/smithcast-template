<template>
  <div>
    <forge-table :fields="fields" :items="result">
      <!--      <template #cell(points)="{ item }">
        {{ item.points }}
        <div :class="item.newPoints > 0 ? 'text-success' : 'text-danger'" class="d-inline small">
          <b-icon :icon="item.newPoints > 0 ? 'arrow-up' : 'arrow-down'"></b-icon>
          ({{ item.newPoints }})
        </div>
      </template>-->
      <template #cell(record)="{ item }">
        <b-badge class="mr-1 text-uppercase" :variant="record == 'w' ? 'success' : record == 'l' ? 'danger' : 'primary'" v-for="record in item.record">{{ record }} </b-badge>
      </template>
    </forge-table>
    <!--    <b-form-radio-group v-model="pointsMode" :options="['Normalised', 'Points']" button-variant="outline-primary" buttons name="radios-btn-outline" class="mb-2"></b-form-radio-group>
    &lt;!&ndash;    <performance-graph />&ndash;&gt;
    <b-table :fields="fields" :items="playerTable" :tbody-tr-class="rowClass" bordered>
      <template #cell(points)="{ item }">
        {{ item.points }}
        <div :class="item.newPoints > 0 ? 'text-success' : 'text-danger'" class="d-inline small">
          <b-icon :icon="item.newPoints > 0 ? 'arrow-up' : 'arrow-down'"></b-icon>
          ({{ item.newPoints }})
        </div>
      </template>
      <template #cell(record)="{ item }">
        <b-badge class="mr-1 text-uppercase" :variant="record == 'w' ? 'success' : record == 'l' ? 'danger' : 'primary'" v-for="record in item.record">{{ record }} </b-badge>
      </template>
    </b-table>-->
  </div>
</template>

<script lang="ts" setup>
import { collection, getDocs, onSnapshot, query } from 'firebase/firestore'
import { computed, onMounted, ref, watch } from 'vue'
import { ForgeColumnBuilder } from '@3squared/forge-ui'
import { defaultConverter, Game, Player } from '../../models'
import { db } from '../../firebase'
import { useGames } from '../../composables/useGames'
import { PlayerLeagueRecord, usePlayerLeagueMapper } from '../../composables/leagueMapper'

/*const pointsMode = ref<PointsMode>('Points')
const playerTable = ref<PlayerTableFull[]>([])*/
const pickedPlayers = ref<string[]>([])
const props = defineProps({
  id: { type: String, required: true },
})
const { games, loadGames } = useGames(props.id)
const players = ref<Player[]>([])

onMounted(async () => {
  loadGames()
  const playersQuery = query(collection(db, 'leagues', props.id, 'players')).withConverter(defaultConverter<Player>())
  onSnapshot(playersQuery, (querySnapshot) => {
    players.value = querySnapshot.docs.map((d) => d.data())
  })
  //playerTable.value = await usePlayers().playerTable(games.value, pointsMode.value)
})

/*watch(pointsMode, async () => {
  playerTable.value = await usePlayers().playerTable(games.value, pointsMode.value)
})*/
const { result } = usePlayerLeagueMapper(players, games)

const fields = computed(() => {
  return new ForgeColumnBuilder<PlayerLeagueRecord>()
    .addColumn((c) => c.name)
    .addColumn(
      (c) => c.played,
      (col) => col.setLabel('Pl')
    )
    .addColumn(
      (c) => c.won,
      (col) => col.setLabel('W')
    )
    .addColumn(
      (c) => c.drawn,
      (col) => col.setLabel('D')
    )
    .addColumn(
      (c) => c.lost,
      (col) => col.setLabel('L')
    )
    .addColumn(
      (c) => c.mvps,
      (col) => col.setLabel('⭐')
    )
    .addColumn(
      (c) => c.for,
      (col) => col.setLabel('G')
    )
    .addColumn(
      (c) => c.against,
      (col) => col.setLabel('A')
    )
    .addMiscColumn('GD', (col) => col.setLabel('Diff').addFormatter((c, _, item) => item.for - item.against))
    .addColumn(
      (c) => c.points,
      (col) => col.setLabel('Pts')
    )
    .addColumn('record')
    .build()
})

/*function rowClass(item: PlayerTableFull) {
  const index = playerTable.value.indexOf(item)
  switch (index) {
    case 0:
      return 'bg-winner'
    case 1:
      return 'bg-second'
    case 2:
      return 'bg-third'
  }
  return ''
}*/
</script>
<style>
.bg-winner {
  background-color: gold;
}

.bg-second {
  background-color: silver;
}

.bg-third {
  background-color: #c99c6ef7;
}
</style>
