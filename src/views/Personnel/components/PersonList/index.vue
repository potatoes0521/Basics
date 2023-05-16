<template>
  <div class="person-table-component-wrapper">
    <XCustomTable v-bind="tableOptions" ref="tableRef">
      <template #controlLeft>
        <ButtonGroup
          v-if="buttonGroup && buttonGroup.length"
          :button-group="buttonGroup"
          :select-people="selectPeople"
          :form-data="formData"
          @on-add-personnel="onAddPersonnel"
          @refresh-page="onNeedRefreshList"
          @on-need-clean-table-checked="onNeedCleanTableChecked"
        ></ButtonGroup>
      </template>
      <template #uname="{ row }">
        <span class="uname-wrapper">
          <span>{{ row.uname }}</span>
          <IconUserIconxingzhuangjiehe v-if="row.isPrincipal" class="is-principal-icon" />
        </span>
      </template>
      <template #accountStatus="{ row }">
        <el-switch
          v-model="row.accountStatus"
          class="margin-right17"
          :active-value="1"
          :inactive-value="0 || 2"
          :before-change="onSwitchChange.bind(this, row)"
        ></el-switch>
      </template>
      <template #operation="{ row }">
        <div style="display: flex; align-items: center">
          <el-button v-auth:userEdit="$route" link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button v-auth:userInfo="$route" link type="primary" @click="openDetails(row)">详情</el-button>
          <template v-if="row.tryLoginLocked">
            <el-button v-auth:unlock="$route" link type="primary" @click="unlock(row.userId)">解锁</el-button>
          </template>
          <el-dropdown v-if="isShowMore" class="dropdown ml-[12px]" @command="handleCommand">
            <span class="el-dropdown-link">
              更多
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <div v-auth:role="$route">
                  <el-dropdown-item :command="{ type: 'role', data: row }">
                    <span class="dropdown-text">分配角色</span>
                  </el-dropdown-item>
                </div>
                <div v-auth:perm="$route">
                  <el-dropdown-item :command="{ type: 'all', data: row }">
                    <span class="dropdown-text">分配权限</span>
                  </el-dropdown-item>
                </div>
                <div v-auth:unlock="$route">
                  <el-dropdown-item :command="{ type: 'login_try', data: row }">
                    <span class="dropdown-text">登录日志</span>
                  </el-dropdown-item>
                </div>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
    </XCustomTable>
    <EditPanel ref="editPanelRef" @on-need-refresh-list="onNeedRefreshList"></EditPanel>
    <DetailsDialog ref="detailsDialogRef"></DetailsDialog>
    <LoginTryDialog ref="loginTryDialogRef" @unlock="unlock"></LoginTryDialog>
  </div>
</template>
<script setup>
  import XCustomTable from '@/components/XCustomTable/index.vue';
  import { handleTableColumn } from './config/tableColumn';
  import ButtonGroup from '../ButtonGroup/index.vue';
  import { defineProps } from 'vue';
  import useUserInfo from '@/hooks/userInfo';
  import useAuth from '@/hooks/useAuth';
  import useBath from './hooks/batch';
  import { setSession } from '@/utils/storage';
  import { ElMessage } from 'element-plus';
  import { changeUserStatus, searchUser, unlockLoginTry } from '@/api/modules/user';
  import EditPanel from '../EditPanel/index.vue';
  import DetailsDialog from '../DetailsDialog/index.vue';
  import LoginTryDialog from '../LoginTryDialog/index.vue';

  const router = useRouter();

  const props = defineProps({
    buttonGroup: {
      type: Array,
      required: true,
      default: () => []
    },
    formData: {
      type: Object,
      required: true,
      default: () => {}
    }
  });

  defineExpose({
    resetSearchForm,
    searchData,
    onNeedCleanTableChecked
  });

  const emit = defineEmits(['onNeedRefreshList']);

  const { auth } = useAuth();

  const tableColumn = computed(() => handleTableColumn({ bath: showBathHandle.value, accountStatus: auth('userState', '/personnel') }) || []);
  const showBathHandle = computed(() => {
    return props.buttonGroup.some((item) => item === 'batch-handle') && auth('batchMove', 'groups');
  });
  const { userPageHash } = useUserInfo();

  const { onSelectionChange, selectPeople, allSelectData } = useBath();

  const tableOptions = reactive({
    // 表格基础配置
    tableConfig: {
      key: userPageHash.value,
      loading: false,
      border: true,
      rowKey: 'userId',
      onSelectionChange(selection) {
        onSelectionChange(selection);
      }
    },
    // 表格数据配置
    tableData: [],
    // 表格扩展配置
    tableExtend: {
      columnSetting: true,
      refresh: true,
      density: true,
      pagination: true,
      export: true
    },
    // 导出配置
    exportConfig: {
      // 排除列
      excludeColumn: ['operation']
    },
    // 刷新数据配置
    refreshConfig: {
      onRefresh() {
        console.log('点击了刷新按钮');
        getTableData();
      }
    },
    // 表格列配置
    columnConfig: [...tableColumn.value],
    // 表格页码配置
    paginationConfig: {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      onCurrentChange(v) {
        tableOptions.paginationConfig.currentPage = v;
        getTableData();
      },
      onSizeChange(v) {
        tableOptions.paginationConfig.pageSize = v;
        getTableData();
      }
    }
  });

  function getTableData() {
    tableOptions.tableConfig.loading = true;
    searchUser({
      pageNum: tableOptions.paginationConfig.currentPage,
      pageSize: tableOptions.paginationConfig.pageSize,
      ...props.formData
    }).then(({ data }) => {
      tableOptions.tableData = data.rows;
      tableOptions.paginationConfig.total = data.totalNum;
      tableOptions.tableConfig.loading = false;
    });
  }

  getTableData();

  const isShowMore = computed(() => {
    return auth(['role', 'pg', 'perm']).some((v) => v);
  });
  const loginTryDialogRef = ref(null);
  function handleCommand({ type, data }) {
    if (type === 'login_try') {
      loginTryDialogRef.value.openDialog(data);
      return;
    }
    console.log(type);
    setSession('userMsg', data);
    router.push({
      path: '/editperm',
      query: {
        pageType: `dis_${type}`,
        uId: data.userId
      }
    });
  }
  /**
   * 改变用户状态
   * @param {Object} item 参数描述
   * @return void
   */
  function onSwitchChange(item) {
    const { userId, accountStatus } = item;
    return new Promise((resolve, reject) => {
      let state = '';
      let stateText = '';
      if (accountStatus === 1) {
        state = 2;
        stateText = '禁用';
      } else if (accountStatus === 2) {
        state = 1;
        stateText = '启用';
      } else if (accountStatus === 0) {
        state = 1;
        stateText = '启用';
      }
      // item.accountStatus = state;
      changeUserStatus({
        userId,
        accountStatus: state
      })
        .then(() => {
          ElMessage.success(`${stateText}成功`);
          resolve(true);
        })
        .catch(() => {
          ElMessage.error(`${stateText}失败`);
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(false);
        });
    });
  }

  const editPanelRef = ref(null);
  /**
   * 新增人员
   * @return void
   */
  function onAddPersonnel() {
    editPanelRef.value.openDialog('add');
  }

  /**
   * 处理编辑
   * @param {Object} item 行数据
   * @return void
   */
  function handleEdit(item) {
    editPanelRef.value.openDialog('edit', item);
  }

  const detailsDialogRef = ref(null);
  /**
   * 打开详情
   * @param {Object} rowData 行数据
   * @return void
   */
  function openDetails(item) {
    detailsDialogRef.value.openDialog(item);
  }

  function unlock(userId) {
    unlockLoginTry({ userId }).then(() => {
      ElMessage.success('解锁成功');
      resetSearchForm();
    });
  }

  function searchData() {
    tableOptions.paginationConfig.currentPage = 1;
    getTableData({ ...props.formData });
  }

  function resetSearchForm() {
    tableOptions.paginationConfig.currentPage = 1;
    getTableData({});
  }

  function onNeedRefreshList() {
    getTableData();
    emit('onNeedRefreshList');
  }

  const tableRef = ref(null);
  function onNeedCleanTableChecked() {
    allSelectData.value.clear();
    tableRef.value.$refs[userPageHash.value]?.clearSelection();
  }
</script>
<style scoped lang="scss">
  .person-table-component-wrapper {
    flex: 1;
    .uname-wrapper {
      line-height: 23px;

      .is-principal-icon {
        font-size: 20px;
        color: #34acff;
        margin-left: 4px;
        display: inline-block;
      }
    }
  }
</style>
