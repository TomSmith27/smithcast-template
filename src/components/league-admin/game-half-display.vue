<template>
  <div class="d-flex">
    <div class="col d-flex flex-column align-items-end text-warning">
      <span class="d-flex align-items-center"> 
        <span class="display-4">Bibs - </span>
        <span class="display-2">{{ half.bibs.score }}</span>
      </span>
      <div class="w-100 text-right">
        <b-badge variant="warning" class="mx-1" v-for="player in half.bibs.players">{{ playerName(player) }}</b-badge>
      </div>
    </div>
    <div class="col text-primary">
        <span class="d-flex align-items-center">
          <span class="display-2">{{ half.shirts.score }}</span>
        <span class="display-4"> - Shirts</span>
      </span>
      <div class="w-100">
        <b-badge variant="primary" class="mx-1" v-for="player in half.shirts.players">{{ playerName(player) }}</b-badge>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref, toRef } from "vue";
import { Half, Player } from "../../models";
import { usePlayerName } from "../../composables";

const props = defineProps({
  allPlayers: {
    type: Array as PropType<Player[]>,
    required: true
  },
  half: {
    type: Object as PropType<Half>,
    required: true
  }
})
const players = ref(props.allPlayers);
const { playerName } = usePlayerName(players)

</script>