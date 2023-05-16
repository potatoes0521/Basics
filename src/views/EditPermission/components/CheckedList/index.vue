<template>
  <div ref="wrapperRef" class="checked-list-component-wrapper pl-[20px]">
    <el-tabs v-model="tabsActiveName" @tab-click="tabClick">
      <el-tab-pane v-for="system in systemList" :key="system.id" :label="system.name" :name="system.id">
        <div :style="{ height: tabPaneHeightR }" class="wrapper">
          <el-tree
            :ref="(el) => (treeRefList[system.id] = el)"
            node-key="id"
            default-expand-all
            :props="defaultProps"
            :data="showCheckedList[system.id]?.children"
          >
            <template #default="{ data }">
              <div class="checked-list-item">
                <span>{{ data.name }}</span>
                <span v-if="!disabledDelete" class="icon-delete" @click.stop="deleteCheckedItem(data)">
                  <el-icon><Close /></el-icon>
                </span>
              </div>
            </template>
          </el-tree>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
  import { computed, inject, ref, watch } from 'vue';
  import useStyle from '../../hooks/style';
  import { listToTree } from '@/utils/treeTool';
  import { Close } from '@element-plus/icons-vue';
  import usePageType from '@/views/EditPermission/hooks/pageType';

  const treeRefList = ref({});

  const { wrapperRef, tabPaneHeightR, defaultProps } = useStyle();

  const halfCheckedList = inject('halfCheckedList');
  const checkedList = inject('checkedList');

  const systemList = inject('systemList');
  const tabsActiveName = inject('tabsActiveName');

  const showCheckedList = ref({});

  watch(
    () => checkedList.value,
    () => {
      // eslint-disable-next-line no-restricted-syntax
      for (let i of systemList.value) {
        const sysCheckedList = [...(checkedList.value[i.id] || []), ...(halfCheckedList.value[i.id] || []), { ...i }];
        const tree = listToTree({ list: sysCheckedList, key: 'id', Pkey: 'pid' }) || [{}];
        // eslint-disable-next-line prefer-destructuring
        showCheckedList.value[i.id] = tree[0];
      }
    },
    { deep: true, immediate: true }
  );

  const eventBus = inject('eventBus');

  function tabClick() {
    eventBus.emit('tabsClick');
  }

  function deleteCheckedItem(item) {
    console.log('🚀 > file: index.vue > line 72 > deleteCheckedItem > item', item);
    eventBus.emit('checkListDeleteItem', item);
  }

  const { editType, pageEN } = usePageType();
  const disabledDelete = computed(() => {
    return editType.value === 'dis' && pageEN.value !== 'all';
  });
</script>
<style scoped lang="scss">
  @import '@/styles/mixin.scss';

  .checked-list-component-wrapper {
    box-sizing: border-box;
    overflow-y: auto;
    height: 100%;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    @include selfScrollBar(rgba(153, 153, 153, 0.59));
    .checked-list-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 70%;
      height: 100%;
      .icon-delete {
        cursor: pointer;
        display: none;
      }
      &:hover {
        .icon-delete {
          display: block;
        }
      }
    }
    .wrapper {
      overflow-y: auto;
      @include selfScrollBar(rgba(153, 153, 153, 0.59));
    }
  }
</style>
