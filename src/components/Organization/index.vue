<!--
 * @LastEditors: liu yang
 * @Description: 组织架构组件 可选人员加部门
 * @Date: 2022-10-11 11:30:33
 * @LastEditTime: 2023-01-11 19:29:04
 * @Author: liu yang
-->
<template>
  <div class="dialog-main">
    <div
      class="dialog-left"
      :class="{
        'checkbox-class': !isRadio,
        'w-full': isRadio
      }"
    >
      <div class="dialog-title">选择</div>
      <div class="dialog-box">
        <div class="input-wrapper">
          <el-input v-model="filterText" placeholder="请输入关键字" />
        </div>
        <div class="tree-wrapper">
          <el-tree
            ref="treeRef"
            class="filter-tree"
            :data="structList"
            :show-checkbox="!isRadio"
            default-expand-all
            :props="defaultProps"
            :filter-node-method="filterNode"
            node-key="nodeKey"
            @check="onCheck"
          >
            <template #default="{ node, data }">
              <div class="custom-tree-node">
                <div
                  v-if="(resType === 'onlyPeople' && isRadio && data.userId) || (resType === 'onlyStruct' && isRadio && !data.userId)"
                  class="radio"
                  :class="{
                    'is-active': activeRadio.nodeKey === data.nodeKey
                  }"
                  @click="handleRadioClick(data)"
                ></div>
                <div v-if="!data.userId" class="icon-style">
                  <IconOrganizationFolder />
                </div>
                <template v-else>
                  <div v-if="data?.avatarUrl" class="head-img-wrapper">
                    <img src="" class="head-img" />
                  </div>
                  <div v-else class="icon-style">
                    <IconOrganizationUser2 />
                  </div>
                </template>
                <div>{{ node.label }}</div>
              </div>
            </template>
          </el-tree>
        </div>
      </div>
    </div>
    <div v-if="!isRadio" class="dialog-right">
      <div class="dialog-title">已选</div>
      <div class="dialog-box">
        <template v-if="resType === 'peopleAndStruct'"> 人和部门都选还没写完 </template>
        <template v-if="resType === 'onlyPeople'">
          <div class="dialog-people-list">
            <div v-for="item in copyCheckList" :key="item.userId" class="dialog-people-item">
              <div v-if="item.avatarUrl" class="head-img-wrapper">
                <img :src="item.avatarUrl" class="head-img" />
              </div>
              <div v-else class="icon-style icon-checked-list">
                <IconOrganizationUser2 />
              </div>
              <div class="dialog-people-name">
                <el-tooltip effect="dark" :content="item.labelName" placement="top">
                  <span class="box-item">
                    {{ item.labelName }}
                  </span>
                </el-tooltip>
              </div>
              <div v-if="!disabled" class="dialog-people-delete" @click="deleteOne(item)">
                <el-icon>
                  <Close />
                </el-icon>
              </div>
            </div>
          </div>
        </template>
        <template v-if="resType === 'onlyStruct'">
          <div class="dialog-people-list">
            <div v-for="item in checkList" :key="item.id" class="dialog-people-item">
              <div class="icon-style icon-checked-list">
                <IconOrganizationFolder />
              </div>
              <div class="dialog-people-name">
                <el-tooltip effect="dark" :content="item.name" placement="top">
                  <span class="box-item">
                    {{ item.name }}
                  </span>
                </el-tooltip>
              </div>
              <div v-if="!disabled" class="dialog-people-delete" @click="deleteOne(item)">
                <el-icon>
                  <Close />
                </el-icon>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { getStructTree } from '@/api/modules/struct';
  import { searchUser } from '@/api/modules/user';
  import { listToTree } from '@/utils/treeTool';
  import useOnlyPeople from './hooks/onlyPeople';
  import useOnlyStruct from './hooks/onlyStruct';
  import usePeopleAndStruct from './hooks/peopleAndStruct';
  import { Close } from '@element-plus/icons-vue';
  import { defineExpose, defineProps, defineEmits } from 'vue';

  defineExpose({ defaultCheck });

  const props = defineProps({
    // 返回选择的 1.人 2.人和部门 3.还是只是部门
    resType: {
      type: String,
      default: 'onlyPeople'
      // default: "onlyStruct",
    },
    // 选择类型是单选还是多选
    checkType: {
      type: String,
      default: 'checkbox'
    },
    // 选中的人
    checkList: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  });

  const emit = defineEmits(['update:checkList', 'onRadioChange']);

  const isRadio = computed(() => props.checkType !== 'checkbox');

  const filterText = ref('');

  const treeRef = ref(null);

  const defaultProps = {
    children: 'children',
    label: 'name',
    disabled: 'disabled'
  };

  watch(filterText, (val) => {
    treeRef.value?.filter(val);
  });

  const filterNode = (value, data) => {
    if (!value) return true;
    return ~data.name.indexOf(value);
  };

  /**
   * @Author: liu yang
   * @Date: 2022-11-02 15:34:32
   * @description: 处理部门
   * @return {*}
   */
  async function getStructTreeData() {
    const {
      data: { structs }
    } = await getStructTree({});
    return structs;
  }

  const userList = ref([]);
  /**
   * @Author: liu yang
   * @Date: 2022-11-02 15:34:20
   * @description: 获取人员信息
   * @return {*}
   */
  async function getUserData() {
    if (props.resType === 'onlyStruct') return [];
    const {
      data: { rows }
    } = await searchUser({ pageNum: 1, pageSize: 1000000 });
    const newRows = rows.map((v) => ({
      ...v,
      pid: v.strcutId,
      name: v.uname,
      nodeKey: `${v.strcutId}.${v.userId}`
    }));
    userList.value = newRows;
    return newRows;
  }

  const structList = ref([]);
  // const defaultExpandedKeys = ref([]);

  async function init() {
    const structs = await getStructTreeData();
    const useList = await getUserData();
    const allData = [...structs.map((v) => ({ ...v, nodeKey: v.id })), ...useList].map((v) => ({ ...v, disabled: props.disabled }));
    const treeData = listToTree({
      list: allData,
      key: 'id',
      Pkey: 'pid',
      orderBy: 'order',
      orderType: ['asc'],
      needParentData: true
    });
    structList.value = treeData;
  }

  init();

  const copyCheckList = ref([]);

  watch(
    copyCheckList,
    (val) => {
      emit('update:checkList', val);
    },
    { deep: true }
  );

  const { isHandleCheckPeople, isOpenCheckPeople } = useOnlyPeople({
    treeRef,
    emit,
    copyCheckList,
    defaultProps,
    userList
  });

  const { isHandleCheckStruct, isOpenCheckStruct } = useOnlyStruct({
    treeRef,
    emit,
    copyCheckList
  });

  const { isHandleCheckPeopleAndStruct, isOpenCheckPeopleAndStruct } = usePeopleAndStruct({
    treeRef,
    emit,
    copyCheckList,
    userList
  });

  /**
   * @Author: liu yang
   * @Date: 2022-11-02 15:35:05
   * @description: 选中项改变的时候
   * @return {*}
   */
  function onCheck() {
    if (props.resType === 'onlyPeople') {
      isHandleCheckPeople();
    } else if (props.resType === 'peopleAndStruct') {
      isHandleCheckPeopleAndStruct();
    } else if (props.resType === 'onlyStruct') {
      isHandleCheckStruct();
    }
  }

  async function defaultCheck(data = []) {
    if (!structList.value.length) {
      await init();
    }
    nextTick(() => {
      if (props.resType === 'onlyPeople') {
        isOpenCheckPeople(data);
      } else if (props.resType === 'peopleAndStruct') {
        isOpenCheckPeopleAndStruct(data);
      } else if (props.resType === 'onlyStruct') {
        isOpenCheckStruct(data);
      }
    });
  }

  function deleteOne(item) {
    treeRef.value?.setChecked(item, false, false);
    onCheck();
  }

  const activeRadio = ref('');

  function handleRadioClick(item) {
    activeRadio.value = { ...item };
    emit('onRadioChange', item);
  }
</script>
<style scoped lang="scss">
  .dialog-main {
    display: flex;
    justify-content: space-between;
    .checkbox-class {
      width: 45%;
      margin-right: 10px;
    }
    .dialog-left {
      .dialog-box {
        display: flex;
        flex-direction: column;
        .input-wrapper {
          margin-bottom: 20px;
        }

        .tree-wrapper {
          overflow-y: auto;
          flex: 1;
          &::-webkit-scrollbar {
            width: 4px;
            background-color: transparent;
          }

          &::-webkit-scrollbar-track {
            border-radius: 10px;
            background-color: transparent;
          }

          &::-webkit-scrollbar-thumb {
            background-color: #e9eaec;
            border-radius: 3px;
          }

          .custom-tree-node {
            display: flex;
            align-items: center;
            font-size: 14px;
            .icon-style {
              margin-right: 5px;
            }
          }
        }
      }
    }
    .dialog-right {
      width: 55%;
      display: flex;
      flex-direction: column;
      .dialog-box {
        .dialog-people-list {
          height: 100%;
          overflow-y: auto;
          &::-webkit-scrollbar {
            width: 4px;
            background-color: transparent;
          }

          &::-webkit-scrollbar-track {
            border-radius: 10px;
            background-color: transparent;
          }

          &::-webkit-scrollbar-thumb {
            background-color: #e9eaec;
            border-radius: 3px;
          }
          .dialog-people-item {
            display: flex;
            line-height: 18px;
            align-items: center;
            margin-bottom: 10px;
            .head-img-wrapper {
              width: 14px;
              height: 14px;
              border-radius: 50%;
              overflow: hidden;
              margin-right: 10px;
              .head-img {
                width: 100%;
                height: 100%;
              }
            }

            .icon-checked-list {
              margin-right: 10px;
            }

            .dialog-people-name {
              font-size: 14px;
              color: #606266;
              width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              .box-item {
                color: #606266;
              }
            }

            .dialog-people-delete {
              cursor: pointer;
              color: #606266;
              display: none;
              font-size: 14px;
            }
            &:hover {
              .dialog-people-delete {
                display: block;
              }
            }
          }
        }
      }
    }

    .dialog-title {
      line-height: 20px;
      color: #000;
      font-size: 14px;
      margin-bottom: 10px;
    }

    .dialog-box {
      overflow-y: auto;
      height: 400px;
      border: 1px solid #d9d9d9;
      padding: 20px;
      box-sizing: border-box;
    }
    .radio {
      width: 12px;
      height: 12px;
      margin-right: 5px;
      border-radius: 50%;
      box-sizing: border-box;
      border: 3px solid;
      border-color: #d8d8d8;
    }
    .is-active {
      border-color: var(--el-color-primary);
    }
  }
</style>
