<template>
  <div class="comp-wrapper">
    <template v-if="showRole">
      <Perm v-loading="roleLoading" name="角色" :perm-list="roleList" name-key="roleName" id-key="roleId" />
    </template>
    <!-- <template v-if="pageEN === 'perm_group'">
      <Perm
        name="权限组"
        v-loading="permGroupLoading"
        :permList="permGroupList"
        nameKey="skillName"
        @onCheckBoxValueChange="onCheckedItem"
      />
    </template> -->
  </div>
</template>
<script></script>
<script setup>
  import Perm from './components/Perm/index.vue';
  import { ref, defineEmits, defineProps, nextTick, computed } from 'vue';
  import { roleSelectList } from '@/api/modules/select';
  import usePageType from '../../hooks/pageType';
  import useRole from './hooks/role';
  import _orderBy from 'lodash/orderBy';

  const emit = defineEmits(['update:loading', 'update:pageLoading']);
  const props = defineProps({
    permTreeLoading: {
      type: Boolean,
      default: false
    },
    pageLoading: {
      type: Boolean,
      default: false
    }
  });

  const roleLoading = ref(false);
  const { pageEN, editType } = usePageType();
  const showRole = computed(() => pageEN.value === 'role' || pageEN.value === 'all');
  if (showRole.value) {
    getAllRole();
  }

  const roleList = ref([]);

  /**
   * @Author: liu yang
   * @Date: 2022-07-27 13:40:03
   * @description: 获取已有角色
   * @return {*}
   */
  function getAllRole() {
    roleLoading.value = true;
    roleSelectList().then(({ data: { options } }) => {
      roleList.value = _orderBy(options, 'roleOrder');
      roleLoading.value = false;
      // 如果不是分配没必要同步
      if (editType.value !== 'dis') return;
      nextTick(() => {
        emit('update:loading', true);
      });
      console.log('🚀 > file: index.vue > line 42 > roleSelectList > options', options);
    });
  }

  useRole(roleList, props, emit);
</script>
<style scoped lang="scss">
  .comp-wrapper {
    padding: 20px;
    padding-top: 0px;
    box-sizing: border-box;
    display: flex;
    position: relative;
  }
</style>
