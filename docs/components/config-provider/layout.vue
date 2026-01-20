<template>
  <div class="app-layout">
    <!-- 模拟导航栏 -->
    <div class="navbar">
      <span class="title">My App</span>
      <t-dropdown :options="langOptions" @click="handleLangChange">
        <t-button variant="text" style="color: #fff">
          {{ t('common.lang') }}
          <template #suffix>
            <t-icon name="chevron-down" />
          </template>
        </t-button>
      </t-dropdown>
    </div>

    <!-- 模拟内容区域 -->
    <div class="content">
      <div class="form-section">
        <t-form :label-width="100">
          <t-form-item>
            <t-input :placeholder="t('common.input.tips')" />
          </t-form-item>
          <t-form-item>
            <t-space>
              <t-button theme="primary">{{
                t('common.button.search')
              }}</t-button>
              <t-button>{{ t('common.button.reset') }}</t-button>
            </t-space>
          </t-form-item>
        </t-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Button as TButton,
  Dropdown as TDropdown,
  Form as TForm,
  FormItem as TFormItem,
  Icon as TIcon,
  Input as TInput,
  Space as TSpace
} from 'tdesign-vue-next'
import { computed } from 'vue'
const emits = defineEmits(['langChange'])
import { langList, useLocalLang } from '@/locales/index'
const { t } = useLocalLang()

const langOptions = computed(() => langList.value)

const handleLangChange = (data: any) => {
  emits('langChange', data.value)
}
</script>

<style scoped>
.app-demo {
  padding: 20px;
}

.description {
  color: var(--td-text-color-secondary);
  margin-bottom: 20px;
}

.app-layout {
  border: 1px solid var(--td-border-level-1-color);
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--td-bg-color-container);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background-color: var(--td-brand-color);
  color: white !important;
}

.navbar .title {
  font-size: 18px;
  font-weight: bold;
}

.content {
  padding: 24px;
}

.form-section {
  max-width: 600px;
}
</style>
