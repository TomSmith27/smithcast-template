<template>
  <div class="d-flex justify-content-center">
    <h4>
      <!--      Total Games Played : {{ games.length }}-->
    </h4>
    <div class="chart-container" style="position: relative; height: 40vh; width: 80vw">
      <h3 class="text-center">Wins</h3>
      <forge-chart :chart-config="winsCHartConfig"></forge-chart>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { computed, onMounted, ref } from 'vue'
import { collection, getDocs, query } from 'firebase/firestore'
import { ArcElement, Chart, ChartConfiguration, Legend, PieController, Tooltip } from 'chart.js'
import { defaultConverter, Game } from '../../models'
import { db } from '../../firebase'
import dayjs from 'dayjs'

Chart.register(PieController, ArcElement, Legend, Tooltip)
export default Vue.extend({
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  name: 'HomeView',
  setup(props) {
    const games = ref<Game[]>([])
    onMounted(async () => {
      const q = query(collection(db, 'leagues', props.id, 'games')).withConverter<Game>(defaultConverter())
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs
        .map((d) => d.data())
        .sort((a, b) => {
          return dayjs(a.date).isAfter(b.date) || dayjs(a.date).isSame(b.date) ? -1 : 1
        })
      games.value = data
    })
    const shirtWins = computed(() => games.value.flatMap((g) => [g.firstHalf, g.secondHalf]).filter((g) => g.shirts.score > g.bibs.score).length)
    const bibWins = computed(() => games.value.flatMap((g) => [g.firstHalf, g.secondHalf]).filter((g) => g.shirts.score < g.bibs.score).length)
    const draws = computed(() => games.value.flatMap((g) => [g.firstHalf, g.secondHalf]).filter((g) => g.shirts.score === g.bibs.score).length)
    const winsCHartConfig = computed<ChartConfiguration>(() => {
      const config: ChartConfiguration<'pie'> = {
        type: 'pie',
        data: {
          labels: ['Bibs', 'Shirts', 'Draw'],
          datasets: [
            {
              label: 'All',
              data: [bibWins.value, shirtWins.value, draws.value],
              backgroundColor: ['#ffc107', '#36A2EB', '#939393'],
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
        },
      }
      return config
    })
    return { games, winsCHartConfig }
  },
})
</script>
