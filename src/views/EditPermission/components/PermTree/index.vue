<template>
  <div ref="wrapperRef" v-loading="menuLoading" class="perm-tree-comp-wrapper pl-[20px]">
    <el-tabs v-model="tabsActiveName" @tab-click="tabClick">
      <el-tab-pane v-for="system in menuList" :key="system.id" :label="system.name" :name="system.id">
        <div :style="{ height: tabPaneHeightR }" class="wrapper">
          <el-tree
            :ref="(el) => (treeRefList[system.id] = el)"
            :show-checkbox="true"
            :data="system.children"
            node-key="id"
            :props="defaultProps"
            @check="(data, state) => checkChange(data, state, system.id, system.name)"
          >
            <!-- @check-change="(node, checked) => onCheck(node, checked, system.id, system.name)" -->
            <template #default="{ data }">
              <span>{{ data.name }}</span>
            </template>
          </el-tree>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
  import { inject, ref, defineEmits } from 'vue';
  import useStyle from '../../hooks/style';
  import { difference } from './utils/index';
  import useTabs from './hooks/tabs';
  import useGetPerm from './hooks/getPerm';
  // eslint-disable-next-line camelcase
  import lodash_difference from 'lodash/difference';

  const emit = defineEmits(['update:loading']);

  const eventBus = inject('eventBus');
  const halfCheckedList = inject('halfCheckedList');

  // 处理获取的权限数据
  const { menuList, menuLoading, tabsActiveName, checkedList, systemList } = useGetPerm(emit);

  // 处理权限
  const treeRefList = ref({});
  // 处理tabs
  const { tabClick } = useTabs({
    halfCheckedList,
    treeRefList,
    checkedList,
    tabsActiveName,
    eventBus,
    systemList
  });

  /**
   * @Author: liu yang
   * @Date: 2022-08-25 18:08:16
   * @description: 处理添加或者删除计算出来当前应该选中什么
   * @param {*} checkedKeys 现在选中了什么
   * @param {*} systemId 哪个子系统
   * @return {*}
   */
  function handleAddOrDel(checkedKeys, systemId) {
    // 获取当前子系统之前选择了什么
    const oldCheckList = (checkedList.value[systemId] ?? []).map((i) => i.id).filter((i) => i > 0) || [];
    // 当前子系统勾选了什么
    const nowCheckList = checkedKeys.filter((i) => i > 0);
    // 对比两者 取差集 找出不同的
    const diff = difference(oldCheckList, nowCheckList);
    const add = [];
    const del = [];
    // 在old里存在又在diff里的  证明是要删除   在old里不存在又在diff里的  证明是要添加
    // eslint-disable-next-line no-restricted-syntax
    for (let i of diff) {
      if (oldCheckList.includes(i)) {
        del.push(i);
      } else {
        add.push(i);
      }
    }
    console.log('🚀 > file: index.vue > line 115 > checkChange > del', del);
    console.log('🚀 > file: index.vue > line 113 > checkChange > add', add);
    // eslint-disable-next-line no-restricted-syntax
    for (let i of add) {
      treeRefList.value[systemId].setChecked(i, true, false);
    }
    // eslint-disable-next-line no-restricted-syntax
    for (let i of del) {
      treeRefList.value[systemId].setChecked(i, false, false);
    }
    return { del, add };
  }

  /**
   * @Author: liu yang
   * @Date: 2022-07-28 18:56:54
   * @description: 当手动处理了一个节点的选中删除
   * @param {Object} data 传递给 data 属性的数组中该节点所对应的对象
   * @param {Object} state 树目前的选中状态对象，包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性
   * @param {Number} systemId 系统id
   * @param {String} systemName 系统名称
   * @return {void}
   */
  function checkChange(data, state, systemId) {
    console.log('🚀 > file: index.vue > line 86 > checkChange ', data, state);
    const { checkedKeys } = state;
    handleAddOrDel(checkedKeys, systemId);
    setTimeout(() => {
      tabClick();
    }, 600);
  }

  /**
   * @Author: liu yang
   * @Date: 2022-07-14 18:18:19
   * @description: 选中一个角色或者权限组
   * @return {*}
   */
  eventBus.on('addPerm', (data) => {
    const add = data.funcUnitIds?.split(',') ?? [];
    console.log('🚀 > file: index.vue > line 166 > eventBus.on > addPerm', add);
    // eslint-disable-next-line no-restricted-syntax
    for (const key of systemList.value) {
      const old = treeRefList.value[key.id].getCheckedKeys().filter((i) => i > 0);
      const need = [...new Set([...old, ...add])];
      treeRefList.value[key.id].setCheckedKeys(need);
    }
    // TODO: 这里可以改成防抖的 这里不得不延迟一下  因为树形组件不支持异步调用只能这样
    setTimeout(() => {
      tabClick();
    }, 600);
  });

  /**
   * @Author: liu yang
   * @Date: 2022-07-15 18:57:25
   * @description: 当取消一个角色/权限组
   * @return {*}
   */
  eventBus.on('removePerm', ({ data, permList }) => {
    console.log('🚀 > file: index.vue > line 237 > eventBus.on > removePerm');
    const permListA = permList
      .map((i) => {
        return (i.funcUnitIds?.split(',') ?? []).map((j) => +j);
      })
      .reduce((a, b) => a.concat(b), []);
    const cancelPerm = (data.funcUnitIds?.split(',') ?? []).map((i) => +i);
    // 如果要取消的权限不在其他角色里  那么这个权限就取消掉
    const needCancel = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const key of cancelPerm) {
      if (!permListA.includes(key)) {
        needCancel.push(key);
      }
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const key of systemList.value) {
      const old = treeRefList.value[key.id].getCheckedKeys().filter((i) => i > 0);
      const need = [];
      console.log('🚀 > file: index.vue > line 206 > eventBus.on > old', old);
      // eslint-disable-next-line no-restricted-syntax
      for (const key1 of old) {
        if (!needCancel.includes(key1)) {
          need.push(key1);
        }
      }
      console.log('🚀 > file: index.vue > line 207 > eventBus.on > need', need, key.name);
      treeRefList.value[key.id].setCheckedKeys(need);
    }
    // TODO: 这里可以改成防抖的 这里不得不延迟一下  因为树形组件不支持异步调用只能这样
    setTimeout(() => {
      tabClick();
    }, 600);
  });

  /**
   * @Author: liu yang
   * @Date: 2022-07-14 17:59:40
   * @description: 处理已选择权限里删除一个权限
   * @return {*}
   */
  eventBus.on('checkListDeleteItem', (data) => {
    console.log('🚀 > file: index.vue > line 237 > eventBus.on > checkListDeleteItem');
    let oldCheckList = [];
    // 先获取现在
    // eslint-disable-next-line no-restricted-syntax
    for (let key of systemList.value) {
      const node = treeRefList.value[key.id];
      if (!node) {
        // eslint-disable-next-line no-continue
        continue;
      }
      // eslint-disable-next-line no-unsafe-optional-chaining
      oldCheckList = [...oldCheckList, ...node?.getCheckedKeys().filter((i) => i > 0)];
    }
    oldCheckList = [...new Set(oldCheckList)];
    console.log('🚀 > file: index.vue > line 239 > eventBus.on > oldCheckList', oldCheckList);
    // 取消权限
    // eslint-disable-next-line no-restricted-syntax
    for (const key of systemList.value) {
      console.log('🚀 > file: index.vue > line 243 > setTimeout > key', key);
      treeRefList.value[key.id].setChecked(data.id, false, true);
    }
    console.log(checkedList.value);
    // 获取现在
    let nowCheckList = [];
    // eslint-disable-next-line no-restricted-syntax
    for (let key of systemList.value) {
      const node = treeRefList.value[key.id];
      if (!node) {
        // eslint-disable-next-line no-continue
        continue;
      }
      // eslint-disable-next-line no-unsafe-optional-chaining
      nowCheckList = [...nowCheckList, ...node?.getCheckedKeys().filter((i) => i > 0)];
    }
    nowCheckList = [...new Set(nowCheckList)];
    console.log('🚀 > file: index.vue > line 250 > eventBus.on > nowCheckList', nowCheckList);
    // 找出来应该之前主站有  现在没有的权限
    const diff = lodash_difference(oldCheckList, nowCheckList) || [];
    console.log('🚀 > file: index.vue > line 250 > eventBus.on > diff', diff);
    if (diff.length) {
      eventBus.emit('cancelPermList', diff);
    }
    // TODO: 这里可以改成防抖的 这里不得不延迟一下  因为树形组件不支持异步调用只能这样
    setTimeout(() => {
      tabClick();
    }, 600);
  });

  /**
   * @Author: liu yang
   * @Date: 2022-07-18 10:15:04
   * @description: 获取到用户功能单元后
   * @return {*}
   */
  eventBus.on('getUserFuncUnitIds', (funcUnitIds) => {
    if (funcUnitIds.length <= 0) return;
    console.log('🚀 > file: index.vue > line 237 > eventBus.on > getUserFuncUnitIds');
    // eslint-disable-next-line no-restricted-syntax
    for (const key of systemList.value) {
      const old = treeRefList.value[key.id].getCheckedKeys();
      const need = [...new Set([...old, ...funcUnitIds])];
      treeRefList.value[key.id].setCheckedKeys(need);
    }
    // TODO: 这里可以改成防抖的 这里不得不延迟一下  因为树形组件不支持异步调用只能这样
    setTimeout(() => {
      tabClick();
    }, 600);
  });

  // 样式和公共
  const { wrapperRef, tabPaneHeightR, defaultProps } = useStyle();
</script>
<style scoped lang="scss">
  @import '@/styles/mixin.scss';

  .perm-tree-comp-wrapper {
    box-sizing: border-box;
    overflow-y: auto;
    width: 100%;
    height: 100%;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    @include selfScrollBar(rgba(153, 153, 153, 0.59));

    .wrapper {
      overflow-y: auto;
      @include selfScrollBar(rgba(153, 153, 153, 0.59));
    }
  }
</style>
