<template>
  <div>
    <h1>Administration</h1>
    <p>Name: {{ userName }}</p>
    <AddCoins />
  </div>
</template>

<script>
import AddCoins from '@/components/AddCoins.vue';

export default {
  components: { AddCoins },
  data() {
    return { userName: 'Hernán Espinoza' };
  }
};
</script>
