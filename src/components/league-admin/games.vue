<template>
  <div>
    <forge-page-header :title="`Games for ${props.id}`">
      <b-button variant="primary" @click="beginAddGame">Add Game</b-button>
    </forge-page-header>
    <div class="shadow-sm d-flex flex-column p-3 my-2 border" v-for="game in games">
      <div class="d-flex align-items-center justify-content-between">
        <div class="h4">{{ formatDate(game.date) }}</div>
        <div>
          <b-button class="mr-2" variant="outline-primary" @click="beginEditGame(game.id)">Edit</b-button>
          <b-button variant="outline-danger" @click="deleteGame(game.id)">Delete</b-button>
        </div>
      </div>
      <h5 class="text-center">First Half</h5>
      <game-half-display :all-players="players" :half="game.firstHalf"></game-half-display>
      <br />
      <h5 class="text-center">Second Half</h5>
      <game-half-display :all-players="players" :half="game.secondHalf"></game-half-display>
      <span class="display-4 d-flex mt-4 justify-content-center"> ⭐ Player of Match - {{ playerName(game.playerOfMatch) }} ⭐ </span>
    </div>

    <forge-modal id="add-edit-game" title="Add Game" :on-confirm="saveGame" size="xl">
      <ValidationObserver ref="observer">
        <forge-form-field rules="required" label="Date" v-model="newGame.date" type="date">
          <template #default="{ state }">
            <forge-date-picker v-model="newGame.date" :config="{ altInput: true, altFormat: 'D d M Y' }"></forge-date-picker>
          </template>
        </forge-form-field>
        <h5>First Half</h5>
        <game-half-form :all-players="players" :half="newGame.firstHalf"></game-half-form>
        <hr />
        <h5>Second Half</h5>
        <game-half-form :all-players="players" :half="newGame.secondHalf"></game-half-form>
        <hr />
        <div>
          <forge-form-field rules="required" label="Player of the Match" type="number" class="text-center">
            <template #default="{ state }">
              <forge-multi-select label="firstName" :multiple="false" :state="state" :options="playerOfMatchContenders" select-value="id" v-model="newGame.playerOfMatch" :show-select-all="false" />
            </template>
          </forge-form-field>
        </div>
      </ValidationObserver>
    </forge-modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, onMounted, ref } from 'vue'
import { defaultConverter, Game, Player } from '../../models'
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useForgeModal } from '@3squared/forge-ui'
import { ValidationObserver } from 'vee-validate'
import GameHalfForm from './game-half-form.vue'
import dayjs from 'dayjs'
import { usePlayerName } from '../../composables'

const props = defineProps({
  id: { type: String, required: true },
})
const games = ref<Game[]>([])
const observer = ref()
const gamesCollection = collection(db, 'leagues', props.id, 'games')
onMounted(async () => {
  const q = query(gamesCollection).withConverter(
    defaultConverter<Game>((data) => ({
      date: dayjs(data.date.toDate()).toDate(),
    }))
  )
  onSnapshot(q, (querySnapshot) => {
    games.value = querySnapshot.docs.map((d) => d.data())
  })

  const playersQuery = query(collection(db, 'leagues', props.id, 'players')).withConverter(defaultConverter<Player>())
  onSnapshot(playersQuery, (querySnapshot) => {
    players.value = querySnapshot.docs.map((d) => d.data())
  })
})

const players = ref<Player[]>([])
const playerOfMatchContenders = computed(() => {
  return players.value.filter((p) => [...newGame.value.firstHalf.bibs.players, ...newGame.value.firstHalf.shirts.players, ...newGame.value.secondHalf.bibs.players, ...newGame.value.secondHalf.shirts.players].includes(p.id))
})

function emptyNewGame() {
  return {
    ...{
      date: new Date(),
      firstHalf: {
        bibs: {
          score: 0,
          players: [],
        },
        shirts: {
          score: 0,
          players: [],
        },
      },
      secondHalf: {
        bibs: {
          score: 0,
          players: [],
        },
        shirts: {
          score: 0,
          players: [],
        },
      },
      playerOfMatch: '',
    },
  }
}

const newGame = ref<Game | Omit<Game, 'id'>>(emptyNewGame())
const instance = getCurrentInstance()!

function beginAddGame() {
  newGame.value = emptyNewGame()
  instance!.proxy.$bvModal.show('add-edit-game')
}

function beginEditGame(id: string) {
  newGame.value = games.value.find((g) => g.id == id)!
  instance!.proxy.$bvModal.show('add-edit-game')
}

async function saveGame() {
  if ('id' in newGame.value) {
    return await setDoc(doc(db, 'leagues', props.id, 'games', newGame.value.id), {
      ...newGame.value,
    })
  } else {
    return await addGame()
  }
}

async function addGame() {
  if (!(await observer.value.validate())) {
    return false
  }
  await addDoc(gamesCollection, newGame.value)
}

const { forgeConfirmModal } = useForgeModal()

async function deleteGame(id: string) {
  const gameToDelete = games.value.find((p) => p.id === id)
  if (
    gameToDelete &&
    (await forgeConfirmModal({
      body: [''],
      options: {
        centered: true,
        bodyClass: 'd-none',
        title: `Are you sure you want to delete the game on ${gameToDelete.date}?`,
      },
    }))
  ) {
    await deleteDoc(doc(db, 'leagues', props.id, 'games', id))
  }
}

const formatDate = (date: Date) => dayjs(date).format('ddd DD-MM-YYYY')

const { playerName } = usePlayerName(players)
</script>
