<template>
  <div>
    <h2>组件示例路由</h2>
    <t-head-menu expand-type="popup">
      <template v-for="route in routes" :key="route.name">
        <t-menu-item v-if="!route.children?.length" :value="route.path" :to="{ name: route.name }">
          {{ route.meta?.title || route.name }}
        </t-menu-item>

        <t-submenu v-else :value="route.path" :title="route.path">
          <t-menu-item
            v-for="child in route.children"
            :key="child.name"
            :value="child.path"
            :to="{ name: child.name }"
          >
            {{ child.meta?.title || child.name }}
          </t-menu-item>
        </t-submenu>
      </template>
    </t-head-menu>
  </div>
</template>

<script setup lang="ts">
import { DynamicRoutes } from './router'

const routes = DynamicRoutes
</script>

<style scoped></style>
