import { Game, Player } from '../models'
import { computed, Ref } from 'vue'

export interface PlayerLeagueRecord {
  id: string
  name: string
  played: number
  won: number
  drawn: number
  lost: number
  for: number
  against: number
  points: number
  record: Result[]
  mvps: number
}

export type Result = 'w' | 'd' | 'l'

export function usePlayerLeagueMapper(players: Ref<Player[]>, games: Ref<Game[]>) {
  const result = computed((): PlayerLeagueRecord[] => {
    return players.value.map((p) => {
      const gamesWithPlayer = games.value.filter((g) => [...g.firstHalf.bibs.players, ...g.firstHalf.shirts.players, ...g.secondHalf.bibs.players, ...g.secondHalf.shirts.players].includes(p.id))
      const halvesWithPlayer = gamesWithPlayer.flatMap((g) => [g.firstHalf, g.secondHalf])

      const gamesWonAsBib = halvesWithPlayer.filter((g) => g.bibs.score > g.shirts.score && g.bibs.players.includes(p.id)).length
      const gamesWonAsShirt = halvesWithPlayer.filter((g) => g.shirts.score > g.bibs.score && g.shirts.players.includes(p.id)).length
      const won = gamesWonAsBib + gamesWonAsShirt

      const gamesLostAsBib = halvesWithPlayer.filter((g) => g.bibs.score < g.shirts.score && g.bibs.players.includes(p.id)).length
      const gamesLostAsShirt = halvesWithPlayer.filter((g) => g.shirts.score < g.bibs.score && g.shirts.players.includes(p.id)).length
      const lost = gamesLostAsBib + gamesLostAsShirt

      const drawn = halvesWithPlayer.length - won - lost

      const goalsForBib = halvesWithPlayer.filter((g) => g.bibs.players.includes(p.id)).reduce((a, b) => +a + +b.bibs.score /** goalsMultiplier(b.players, 'Bib')*/, 0)
      const goalsAgainstBib = halvesWithPlayer.filter((g) => g.bibs.players.includes(p.id)).reduce((a, b) => +a + +b.shirts.score /** goalsMultiplier(b.players, 'Bib')*/, 0)

      const goalsForShirt = halvesWithPlayer.filter((g) => g.shirts.players.includes(p.id)).reduce((a, b) => +a + +b.shirts.score /** goalsMultiplier(b.players, 'Shirt')*/, 0)
      const goalsAgainstShirt = halvesWithPlayer.filter((g) => g.shirts.players.includes(p.id)).reduce((a, b) => +a + +b.bibs.score /** goalsMultiplier(b.players, 'Shirt')*/, 0)

      const goalsFor = goalsForBib + goalsForShirt
      const goalsAgainst = goalsAgainstBib + goalsAgainstShirt

      const playersOfMatch = gamesWithPlayer.filter((g) => g.playerOfMatch == p.id).length

      const points = won * 3 + drawn + lost * -3 + goalsFor - goalsAgainst + playersOfMatch * 2

      const lastNGames = halvesWithPlayer.slice(-5)
      const lastNResults: Result[] = lastNGames.map((g): Result => {
        if (g.shirts.score === g.bibs.score) {
          return 'd'
        }
        if ((g.bibs.score > g.shirts.score && g.bibs.players.includes(p.id)) || (g.shirts.score > g.bibs.score && g.shirts.players.includes(p.id))) {
          return 'w'
        }

        return 'l'
      })

      return {
        id: p.id,
        name: p.firstName,
        played: halvesWithPlayer.length,
        won: won,
        lost: lost,
        drawn: drawn,
        for: goalsFor,
        against: goalsAgainst,
        mvps: playersOfMatch,
        points: points,
        record: lastNResults,
      }
    })
  })

  return { result }
}
