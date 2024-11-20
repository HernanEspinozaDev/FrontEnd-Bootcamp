<template>
  <div class="home-container">
    <h1 class="title">Lista de Juegos Disponibles</h1>
    <div class="game-list">
      <GameCard v-for="game in games" :key="game.id" :game="game" />
    </div>
  </div>
</template>

<script>
import GameCard from '@/components/GameCard.vue';
import { fetchGames } from '@/api';

export default {
  components: { GameCard },
  data() {
    return {
      games: []
    };
  },
  async mounted() {
    try {
      const data = await fetchGames();
      this.games = data.results;
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  }
};
</script>

<style scoped>
.home-container {
  padding: 20px;
  text-align: center;
}

.title {
  margin-bottom: 20px;
  font-size: 2em;
}

.game-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}
</style>
