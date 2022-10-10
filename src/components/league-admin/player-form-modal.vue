<template>
  <forge-modal id="player-form-modal" title="Add Player" :on-confirm="beforeOnConfirm">
    <ValidationObserver ref="observer">
      <forge-form-field rules="required" label="First Name" v-model="player.firstName"></forge-form-field>
      <forge-form-field rules="required" label="Last Name" v-model="player.lastName"></forge-form-field>
      <forge-form-field rules="" label="Nickname" v-model="player.nickName"></forge-form-field>
    </ValidationObserver>
  </forge-modal>
</template>

<script lang="ts" setup>
import { PropType, ref } from "vue";
import { Player } from "../../models";
import { ValidationObserver } from 'vee-validate'

const props = defineProps({
  onConfirm: {
    type: Function,
    required: true
  },
  player: {
    type: Object as PropType<Omit<Player, 'id'>>,
    required: true
  }
})
const observer = ref()

async function beforeOnConfirm() {
  if (!await observer.value.validate()) {
    return false
  }
  await props.onConfirm()
}
</script>