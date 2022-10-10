<template>
  <div class="d-flex">
    <div class="col d-flex flex-column align-items-end text-warning">
      <h5> Bibs</h5>
      <div class="w-100 text-right">
        <forge-form-field rules="required" label="Score" v-model="half.bibs.score"
                          type="number" class="text-right">
        </forge-form-field>
        <forge-form-field rules="required" label="Players" vid="bib-players" v-model="half.bibs.players"
        >
          <template #default="{state}">
            <forge-multi-select variant="warning"
                                label="firstName"
                                :state="state"
                                :options="availableBibPlayers"
                                v-model="half.bibs.players"
                                select-value="id"
                                :show-select-all="false" />
          </template>
        </forge-form-field>

      </div>
    </div>
    <div class="col text-primary">
      <h5>Shirts</h5>
      <div class="w-100">
        <forge-form-field rules="required" label="Score" v-model="half.shirts.score"
                          type="number"></forge-form-field>
        <forge-form-field rules="required" label="Players" vid="shirt-players" 
        >
          <template #default="{state}">
            <forge-multi-select variant="primary"
                                label="firstName"
                                :state="state"
                                :options="availableShirtPlayers"
                                v-model="half.shirts.players"
                                select-value="id"
                                :show-select-all="false" />
          </template>
        </forge-form-field>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType } from "vue";
import { Half, Player } from "../../models";

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


const availableShirtPlayers = computed(() =>
    props.allPlayers.filter(p => !props.half.bibs.players.includes(p.id))
)


const availableBibPlayers = computed(() =>
    props.allPlayers.filter(p => !props.half.shirts.players.includes(p.id))
)
</script>