<!--
 * @Author: liuYang
 * @Description: tab面板
 * @Path: 引入路径
 * @Date: 2021-03-19 14:25:41
 * @LastEditors: liu yang
 * @LastEditTime: 2022-12-02 18:24:34
 * @MustParam: 必传参数
 * @OptionalParam: 选传参数
 * @EmitFunction: 函数
 * @Slot/Props.children: 提供的插槽或render
 * @Examples: 使用示例
-->
<template>
  <div class="pane-components-wrapper">
    <div class="button-group">
      <el-button v-auth:add="$route" type="primary" @click="addFatherMenu">新增一级菜单</el-button>
    </div>
    <XTable
      :indent="26"
      border
      show-overflow-tooltip
      row-key="menuId"
      :total-num="totalNum"
      :table-data="tableData"
      :table-column="tableColumn"
      :current-page="currentPage"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @on-current-page-change="onCurrentPageChange"
    >
      <template #actions>
        <el-table-column label="图标" min-width="150">
          <template #default="scope">
            <template v-if="scope.row.menuIcon && scope.row.menuIcon.startsWith('@')">
              <XIcon :icon-class="scope.row.menuIcon" class-name="svg-icon-menu"> </XIcon>
            </template>
            <template v-if="scope.row.menuIcon && scope.row.menuIcon.startsWith('el-')">
              <i class="icon" :class="scope.row.menuIcon"> </i>
            </template>
            <template v-if="scope.row.menuIcon && scope.row.menuIcon.startsWith('icon-')">
              <i class="icon" :class="'iconfont icon-menu ' + scope.row.menuIcon"> </i>
            </template>
            <span v-else> </span>
            <span>{{ scope.row.menuName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="链接类型" prop="hrefType" :formatter="hrefTypeFormatter"> </el-table-column>
        <el-table-column label="打开方式" prop="openInNewWindow" :formatter="openInNewWindowFormatter"> </el-table-column>
        <el-table-column label="链接地址" prop="menuHref" :formatter="menuHrefFormatter" min-width="220"> </el-table-column>
        <el-table-column label="同级排序" prop="menuOrder" min-width="120" align="center"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="240">
          <template #default="scope">
            <el-button v-auth:edit="$route" type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
            <el-button v-auth:delete="$route" type="primary" link @click="handleDeleteMenu(scope.row)">删除</el-button>
            <el-button v-auth:add="$route" type="primary" link :disabled="!!scope.row.hrefType" @click="addNewChildrenMenu(scope.row, 'list')">添加</el-button>
            <template v-if="!scope.row.children && (userIsRoot || scope.row.hrefType === 3 || !scope.row.hrefType)">
              <el-button v-auth:configure="$route" type="primary" link @click="bindPage(scope.row)">配置链接</el-button>
            </template>
          </template>
        </el-table-column>
      </template>
    </XTable>
    <HandleChildrenMenu ref="handleChildrenMenuRef" :menu-pid-list="pidData" @on-need-refresh-menu="getSubsystemMenu"></HandleChildrenMenu>
    <HandleParentMenuDialog ref="handleParentMenuDialogRef" @on-need-refresh-menu="getSubsystemMenu"></HandleParentMenuDialog>
    <SubsystemPage ref="subsystemPageRef" :ss-id="subsystemData.ssId" @on-need-refresh-menu="getSubsystemMenu"></SubsystemPage>
  </div>
</template>
<script setup>
  import { XTable } from '@xiaoshi/xiaoshi-components';
  import { deleteMenu, getSubsystemMenuTree } from '@/api/modules/menu';
  import HandleChildrenMenu from '../HandleChildrenMenu/index.vue';
  import HandleParentMenuDialog from '../HandleParentMenuDialog/index.vue';
  import { listToTree } from '@/utils/treeTool';
  import SubsystemPage from '../SubsystemPage/index.vue';
  import useUserInfo from '@/hooks/userInfo';
  import { ElMessage, ElMessageBox } from 'element-plus';

  const fatherWarn = '该操作会删除当前菜单和当前菜单的子节点菜单，是否确认删除？';
  const childrenWarn = '该操作会删除当前菜单，是否确认删除？';
  const props = defineProps({
    subsystemData: {
      type: Object,
      default: () => {}
    }
  });
  const tableColumn = [];
  let allData = [];

  const tableData = ref([]);
  const totalNum = ref(0);
  const currentPage = ref(1);
  const deleteLoading = ref(false);
  const warningMsg = ref('');
  const pidData = ref([]);

  const { userInfo } = useUserInfo();
  const userIsRoot = computed(() => userInfo.value?.userLevel === 99999);

  getSubsystemMenu();

  const handleParentMenuDialogRef = ref(null);
  function addFatherMenu() {
    handleParentMenuDialogRef.value.openDialog('add', {
      ssId: props.subsystemData.ssId
    });
  }

  function onCurrentPageChange(page) {
    currentPage.value = page;
    getSubsystemMenu();
  }

  function handleEdit(row) {
    if (!row.menuPid) {
      handleParentMenuDialogRef.value.openDialog('edit', row);
    } else {
      handleParentMenuDialogRef.value.openDialog('edit', row);
    }
  }

  function handleDeleteMenu(row) {
    if (!row.menuPid) {
      warningMsg.value = fatherWarn;
    } else {
      warningMsg.value = childrenWarn;
    }
    ElMessageBox.confirm(warningMsg.value, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteLoading.value = true;
        deleteMenu({ ...row }).then(() => {
          ElMessage.success('删除成功');
          deleteLoading.value = false;
          getSubsystemMenu();
        });
      })
      .catch(() => {
        deleteLoading.value = false;
      });
  }

  function getSubsystemMenu() {
    getSubsystemMenuTree({ ssId: props.subsystemData.ssId }).then(({ data: { menus } }) => {
      menus = menus.map((item) => {
        if (!item.menuPid) {
          item.menuPid = 0;
        }
        return item;
      });
      tableData.value = listToTree({ list: menus, orderBy: 'menuOrder' }) || [];
      allData = menus || [];
    });
  }

  const handleChildrenMenuRef = ref(null);
  function addNewChildrenMenu(row, addType) {
    pidData.value = allData.filter((item) => item.menuPid === row.menuPid && !row.hrefType);
    handleChildrenMenuRef.value.openDialog(`add_${addType}`, {
      ssId: props.subsystemData.ssId,
      ...row
    });
  }

  const subsystemPageRef = ref(null);
  function bindPage(row) {
    subsystemPageRef.value.openDialog(row);
  }

  function hrefTypeFormatter(row) {
    const hash = {
      1: '本系统',
      2: '其他子系统',
      3: '外链'
    };
    return hash[row.hrefType] || '-';
  }
  function menuHrefFormatter(row) {
    return row.menuHref ? row.menuHref : '-';
  }

  function openInNewWindowFormatter(row) {
    const hash = {
      0: '当前窗口',
      1: '新窗口'
    };
    return hash[row.openInNewWindow] || '-';
  }
</script>
<style scoped lang="scss">
  .pane-components-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .svg-icon-menu {
    font-size: 20px !important;
    margin-right: 7px !important;
  }
  .button-group {
    padding: 0px 20px 22px;
  }
  .icon {
    font-size: 20px;
    color: #606266;
    vertical-align: middle;
    margin-right: 8px;
  }
  .icon-menu {
    color: currentColor !important;
    width: 14px;
    height: 14px;
    font-size: 16px !important;
  }
</style>
