<template>
  <div>
    <h1>All Leagues</h1>
    <div v-for="league in leagues">
      <b-card class="shadow">
        <b-card-body>
          <div class="d-flex justify-content-between">
            <b-card-title>{{ league.name }}</b-card-title>
            <div>
              <span class="text-muted">                Members: <b-badge variant="primary">{{league.players.length}}</b-badge>                              </span>
              <b-button class="ml-2" :to="{name : 'league-details', params : {id : league.id}}" variant="primary">View
                League
              </b-button>
              <b-button class="ml-2" variant="outline-danger" @click="deleteLeague(league.id)">Delete League</b-button>
            </div>
          </div>
        </b-card-body>
      </b-card>
    </div>
    <div class="bg-white shadow-sm mt-3">
      <b-button class="w-100" variant="outline-primary" v-b-modal.create-league>
        Create New League
      </b-button>
    </div>
    <forge-modal id="create-league" title="Create New League" :on-confirm="createLeague">
      <ValidationObserver ref="observer">
        <forge-form-field rules="required" label="Name" v-model="newLeagueName"></forge-form-field>
      </ValidationObserver>
    </forge-modal>
  </div>
</template>

<script lang="ts" setup>

import { onMounted, ref } from "vue";
import { collection, getDocs, query, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { ForgeModal } from "@3squared/forge-ui";
import { ValidationObserver } from 'vee-validate'

const leagues = ref<League[]>([]);
const newLeagueName = ref('');
const observer = ref()
onMounted(async () => {
  const q = query(collection(db, 'leagues')).withConverter<League>({
    toFirestore(modelObject) {
      return { ...modelObject }
    },
    fromFirestore(snapshot, options) {
      const data = snapshot.data(options);
      return { id: snapshot.id, ...data } as League
    }
  })
  onSnapshot(q, (querySnapshot) => {
    leagues.value = querySnapshot.docs.map((d) => d.data());
  })
})

async function deleteLeague(id: string) {
  console.log(id)
  await deleteDoc(doc(db, 'leagues', id));
}

async function createLeague() {
  if (!await observer.value.validate()) {
    return false
  }
  return await addDoc(collection(db, 'leagues'), {
    name: newLeagueName.value,
    players: [{ id: 1, name: 'You' }]
  });
}

</script>

<style scoped>

</style>