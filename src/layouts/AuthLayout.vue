<template>
  <div id="auth-layout">
    <div class="row">
      <div class="col-md-6" v-show="$q.screen.gt.sm">
        <div class="logo-wrapper row justify-center items-center">
          <div class="logo ">
            <q-img class="logo-bkp" src="~assets/logo_bkp.png"></q-img>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.logo-wrapper {
  height: 100vh;
  border: 1px solid #86EEC8;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #3A876B 100%);
}

.logo-bkp {
  width: 321px;
  height: 126.306px;
  flex-shrink: 0;
}
</style>
