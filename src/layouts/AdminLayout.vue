<template>
  <q-layout view="hhh lpR lFf">

    <q-header bordered class="bg-white text-black">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-btn flat :to="{ name: 'AdminHomePage' }">Admin</q-btn>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-scroll-area class="fit">
        <q-list>
          <q-item clickable :to="{ name: 'AdminManageUserIndexPage' }">
            <q-item-section avatar>
              <q-icon name="group_add" />
            </q-item-section>
            <q-item-section>
              Manage User
            </q-item-section>
          </q-item>
          <q-item clickable :to="{ name: 'ManagePlantIndexPage' }">
            <q-item-section avatar>
              <q-icon name="home_work" />
            </q-item-section>
            <q-item-section>
              Manage Plant
            </q-item-section>
          </q-item>
          <q-item clickable :to="{ name: 'AdminManageIssueIndexPage' }">
            <q-item-section avatar>
              <q-icon name="table_chart" />
            </q-item-section>
            <q-item-section>
              Manage Issue
            </q-item-section>
          </q-item>
          <q-item clickable :to="{ name: 'HomePage' }">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>
              Halaman User
            </q-item-section>
          </q-item>
          <q-item clickable :to="{ name: 'AdminManageManageInformationPage' }">
            <q-item-section avatar>
              <q-icon name="info" />
            </q-item-section>
            <q-item-section>
              Manage Information
            </q-item-section>
          </q-item>
          <q-item clickable @click="logout()">
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>
            <q-item-section>
              Logout
            </q-item-section>
          </q-item>
          <q-separator />

        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { ref } from 'vue'
import { useUserStore } from 'src/stores/user'

export default {
  setup() {
    const leftDrawerOpen = ref(false)
    const { logout } = useUserStore()

    return {
      leftDrawerOpen,
      logout,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
}
</script>
