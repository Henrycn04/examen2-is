<template>
  <div id="app">
    <MaquinaExpendedora />
  </div>
</template>

<script>
import MaquinaExpendedora from "./components/MaquinaExpendedora.vue";

export default {
  name: "App",
  components: {
    MaquinaExpendedora,
  },
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}
</style>

