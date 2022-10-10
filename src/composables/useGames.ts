import { onMounted, ref } from 'vue'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { defaultConverter, Game, Player } from '../models'
import dayjs from 'dayjs'
import { db } from '../firebase'

export function useGames(leagueId: string) {
  const gamesCollection = collection(db, 'leagues', leagueId, 'games')
  const games = ref<Game[]>([])
  function loadGames() {
    const q = query(gamesCollection).withConverter(
      defaultConverter<Game>((data) => ({
        date: dayjs(data.date.toDate()).toDate(),
      }))
    )
    onSnapshot(q, (querySnapshot) => {
      games.value = querySnapshot.docs.map((d) => d.data())
    })
  }

  return { games, loadGames }
}
