import { Player } from "./models";
import { Ref } from "vue";

export function usePlayerName(allPlayers : Ref<Player[]>) {
  function playerName(id: string) {
    return allPlayers.value.find(p => p.id == id)?.firstName ?? 'Unknown'
  }

  return { playerName }
}