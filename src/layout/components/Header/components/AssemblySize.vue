<template>
  <el-dropdown trigger="click" @command="setAssemblySize">
    <i :class="'iconfont icon-contentright'" class="toolBar-icon"></i>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in assemblySizeList" :key="item" :disabled="assemblySize === item" :command="item">
          {{ assemblySizeListCh[item] }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
  import { reactive, computed } from 'vue';
  import { useSystemStore } from '@/store/system';

  const systemStore = useSystemStore();
  const assemblySize = computed(() => systemStore.assemblySize);

  const assemblySizeList = ['default', 'large', 'small'];
  const assemblySizeListCh = reactive({
    default: '默认',
    large: '大型',
    small: '小型'
  });

  const setAssemblySize = (item) => {
    if (assemblySize.value === item) return;
    systemStore.setAssemblySizeSize(item);
  };
</script>
