<template>
  <div id="app">
    <CoffeeMachine />
  </div>
</template>

<script>
import CoffeeMachine from "./components/CoffeeMachine.vue";

export default {
  name: "App",
  components: {
    CoffeeMachine,
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

