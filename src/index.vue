<script setup lang="ts">
import { changeLocale, langList } from './locales'
import { DynamicRoutes } from './router'

const routes = DynamicRoutes
</script>

<template>
  <div>
    <t-head-menu theme="light" value="item1" height="120px">
      <template #logo>
        <h2>组件示例路12由</h2>
      </template>
      <template #operations>
        <t-dropdown trigger="click">
          <t-icon class="t-menu__operations-icon" name="translate" />
          <template #dropdown>
            <t-dropdown-item
              v-for="(lang, index) in langList"
              :key="index"
              :value="lang.value"
              @click="(options) => changeLocale(options.value as string)"
            >
              {{ lang.content }}
            </t-dropdown-item>
          </template>
        </t-dropdown>
      </template>
    </t-head-menu>
    <t-head-menu expand-type="popup">
      <template v-for="route in routes" :key="route.name">
        <t-menu-item
          v-if="!route.children?.length"
          :value="route.path"
          :to="{ name: route.name as string }"
        >
          {{ route.meta?.title || route.name }}
        </t-menu-item>

        <t-submenu v-else :value="route.path" :title="route.path">
          <t-menu-item
            v-for="child in route.children"
            :key="child.name"
            :value="child.path"
            :to="{ name: child.name as string }"
          >
            {{ child.meta?.title || child.name }}
          </t-menu-item>
        </t-submenu>
      </template>
    </t-head-menu>
  </div>
</template>

<style scoped></style>
