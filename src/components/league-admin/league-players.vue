<template>
  <div>
    <forge-page-header :title="`Players for ${props.id}`">
      <b-button variant="primary" @click="beginAddPlayer">Add Player</b-button>
    </forge-page-header>
    <div class="shadow-sm d-flex p-3 my-2 border align-items-center justify-content-between" v-for="player in players">
      <div class="d-flex align-items-center">
        <img class="profile-pic mr-2" src="https://cdn-icons-png.flaticon.com/512/147/147285.png" alt="" />
        <div class="h4">
          {{ player.firstName }} <em v-if="player.nickName">"({{ player.nickName }})"</em>
          {{ player.lastName }}
        </div>
      </div>
      <div>
        <b-button class="mr-2" variant="outline-primary" @click="beginEditPlayer(player.id)">Edit</b-button>
        <b-button variant="outline-danger" @click="deletePlayer(player.id)">Delete</b-button>
      </div>
    </div>
    <player-form-modal :player="editingPlayer" :on-confirm="savePlayer" />
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, onMounted, ref } from 'vue'
import { collection, doc, onSnapshot, query, addDoc, deleteDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { defaultConverter, Player } from '../../models'
import { useForgeModal } from '@3squared/forge-ui'
import PlayerFormModal from './player-form-modal.vue'

const props = defineProps({
  id: { type: String, required: true },
})
const players = ref<Player[]>([])
const playersCollection = collection(db, 'leagues', props.id, 'players')
onMounted(async () => {
  const q = query(playersCollection).withConverter(defaultConverter<Player>())
  onSnapshot(q, (querySnapshot) => {
    players.value = querySnapshot.docs.map((d) => d.data())
  })
})
const defaultPlayer = () => ({
  ...{
    firstName: '',
    lastName: '',
    nickName: '',
    photoUrl: 'https://cdn-icons-png.flaticon.com/512/147/147285.png',
  },
})
const editingPlayer = ref<Omit<Player, 'id'> | Player>(defaultPlayer())
const root = getCurrentInstance()!.proxy.$root

async function beginEditPlayer(id: string) {
  editingPlayer.value = { ...players.value.find((p) => p.id == id)! }
  root.$bvModal.show('player-form-modal')
}

async function beginAddPlayer(id: string) {
  editingPlayer.value = defaultPlayer()
  root.$bvModal.show('player-form-modal')
}

async function savePlayer() {
  if ('id' in editingPlayer.value) {
    await setDoc(doc(db, 'leagues', props.id, 'players', editingPlayer.value.id), {
      ...editingPlayer.value,
    })
  } else {
    await addPlayer()
  }
}

async function addPlayer() {
  await addDoc(playersCollection, editingPlayer.value)
}

const { forgeConfirmModal } = useForgeModal()

async function deletePlayer(id: string) {
  const playerToDelete = players.value.find((p) => p.id === id)
  if (
    playerToDelete &&
    (await forgeConfirmModal({
      body: [''],
      options: {
        centered: true,
        bodyClass: 'd-none',
        title: `Are you sure you want to delete ${playerToDelete.firstName} ${playerToDelete.lastName}?`,
      },
    }))
  ) {
    await deleteDoc(doc(db, 'leagues', props.id, 'players', id))
  }
}
</script>

<style lang="scss">
.profile-pic {
  height: 64px;
  width: 64px;
}
</style>
