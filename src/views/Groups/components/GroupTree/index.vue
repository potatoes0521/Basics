<template>
  <div class="group-tree-wrapper">
    <div class="group-title">
      <div class="group-title-text">组织架构管理</div>
      <div class="group-title-right">
        <el-popover placement="left-start" popper-class="group-title-popover" trigger="click">
          <template #reference>
            <i class="el-icon-setting"></i>
          </template>
          <div class="group-title-popover-right">
            <div v-auth:export="$route" class="group-title-popover-right-item" @click="exportFile">批量导出</div>
            <div v-auth:export="$route" class="group-title-popover-right-item" @click="importFile">批量导入</div>
            <div class="group-title-popover-right-item">
              <el-checkbox v-model="showDisable" label="显示禁用"></el-checkbox>
            </div>
          </div>
        </el-popover>
      </div>
    </div>
    <div class="group-search-wrapper">
      <el-input v-model="filterText" class="input" clearable placeholder="搜索..." suffix-icon="el-icon-search" @clear="onClearInput"></el-input>
    </div>
    <div class="group-tree-list">
      <div class="only-one-wrapper">
        <div class="text" @click="onClickGroup">{{ groupData.name || '组织架构' }}</div>
        <div v-auth:add="$route" class="icon el-icon-plus" @click="addNewDep"></div>
      </div>
      <div class="tree-wrapper">
        <el-tree
          ref="treeRef"
          class="tree"
          :data="treeData || []"
          node-key="id"
          :props="defaultProps"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
        >
          <template #default="{ node, data }">
            <div class="node-item" :class="[{ 'not-active': data.status === 0 }, { 'is-active': data.status === 1 }, { 'stop-active': data.status === 2 }]">
              <span :title="node.label">{{ node.label }} {{ data.userCnt ? ` (${data.userCnt})` : '' }}</span>
              <div class="icon-list-wrapper">
                <div v-auth:edit="$route" class="icon el-icon-edit" @click.stop="handleEdit(data)"></div>
                <div v-auth:add="$route" class="icon el-icon-plus" @click.stop="handleAddChildren(data)"></div>
                <div v-auth:delete="$route" class="icon el-icon-delete" @click.stop="handleDelete(data)"></div>
              </div>
            </div>
          </template>
        </el-tree>
      </div>
    </div>
    <EditPanel ref="editFirstLevelRef" @on-need-refresh-group="reqStructTree"></EditPanel>
    <input v-show="false" ref="importBtnRef" class="importBtn" type="file" @change="uploadFn($event)" />
  </div>
</template>
<script setup>
  import EditPanel from '../EditPanel/index.vue';
  import { listToTree, findOnePathById } from '@/utils/treeTool';
  import { deleteStruct, getStructTree, importStruct, exportStruct } from '@/api/modules/struct';
  import { messageContentRender } from '@/utils/createdHtmlTemplate';
  import { isNull } from '@/utils/typeOf';
  import { watch } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';

  defineExpose({
    onNeedRefreshList
  });

  const emit = defineEmits(['onClickDep']);

  let allData = [];
  let checkedTreeNode = null;

  const treeData = ref([]);
  const filterText = ref('');

  const defaultProps = {
    children: 'children',
    label: 'name'
  };
  const showDisable = ref(false);
  const groupData = ref({});
  const loadingIng = ref(false);

  const treeRef = ref(null);
  watch(filterText, (val) => {
    if (val) {
      treeRef.value.filter(val);
    } else {
      onClearInput();
    }
  });

  function filterNode(value, data) {
    if (!value) return true;
    return data.name.indexOf(value) !== -1;
  }

  function onClearInput() {
    filterText.value = '';
    treeRef.value.filter('');
  }

  watch(showDisable, () => {
    filterStatusNode();
  });

  /**
   * 过滤出来对应状态的数据并选中
   * @param {Boolean} value=this.showDisable 是否显示已禁用的数据
   * @param {Number} id=this.checkedTreeNode?.id 要选中的数据的ID
   * @return void
   */
  function filterStatusNode(id = checkedTreeNode?.id) {
    // 如果显示禁用显示所有数据
    const newStructs = showDisable.value ? allData : allData.filter((item) => item.status !== 2);
    const allTree = listToTree({
      list: newStructs,
      key: 'id',
      Pkey: 'pid',
      orderBy: 'order'
    });
    groupData.value = allTree[0] || {};
    treeData.value = allTree[0]?.children || [];
    id = id || allTree[0]?.id || null;

    setTreeCurrentKey(id);
  }

  const importBtnRef = ref(null);
  function importFile() {
    importBtnRef.value.click();
  }

  function uploadFn(event) {
    const file = event.target.files[0];
    const form = new FormData();
    form.append('file', file);
    if (file) {
      loadingIng.value = true;
      // 判断文件后缀
      const testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
      // 文件大小
      // const isLt2M = file.size / 1024 / 1024 < 50
      // if ((testmsg === 'xls' || testmsg === 'xlsx') && isLt2M) {
      if (testmsg === 'xlsx') {
        importStruct(form)
          .then(() => {
            loadingIng.value = false;
            ElMessage({
              showClose: true,
              message: '导入成功',
              type: 'success'
            });
            // 处理刷新
            getStructTree();
          })
          .catch(() => {
            loadingIng.value = false;
          });
      } else {
        loadingIng.value = false;
        ElMessage({
          showClose: true,
          message: '上传文件只能是xlsx格式',
          type: 'warning'
        });
      }
    } else {
      return;
    }
    importBtnRef.value.value = null;
  }

  function exportFile() {
    let includeLogicDel = false;
    ElMessageBox.confirm('是否导出已删除的数据?', '请确认', {
      confirmButtonText: '是',
      cancelButtonText: '否',
      type: 'warning',
      distinguishCancelAndClose: true
    })
      .then(() => {
        includeLogicDel = true;
        return true;
      })
      .catch((err) => {
        if (err === 'cancel') {
          includeLogicDel = false;
          return true;
        }
        return false;
      })
      .then((res) => {
        if (!res) return;
        exportStruct({ includeLogicDel });
      });
  }
  /**
   * 当点击了节点
   * @param {Object} data node数据
   * @return void
   */
  function handleNodeClick(data) {
    const path = findOnePathById({
      tree: treeData.value,
      idNum: data.id,
      allData: true
    });
    checkedTreeNode = { ...data };
    onClickDep(data, path);
  }

  function onClickDep(data, path) {
    emit('onClickDep', data, path);
  }

  const editFirstLevelRef = ref(null);
  /**
   * 添加子节点
   * @param {Object} data 节点数据
   * @return void
   */
  function addNewDep() {
    editFirstLevelRef.value.openDialog('add_level1', groupData.value);
  }

  /**
   * 获取部门数据
   * @return void
   */
  function reqStructTree() {
    getStructTree({}).then(({ data: { structs } }) => {
      const newStructs = structs.map((item) => {
        if (!item.pid) {
          item.pid = 0;
        }
        return item;
      });
      allData = [...newStructs];
      filterStatusNode();
    });
  }

  reqStructTree();

  /**
   * 编辑
   * @param {Object} data 要编辑的部门
   * @return void
   */
  function handleEdit(data) {
    editFirstLevelRef.value.openDialog('edit', data);
    if (checkedTreeNode && checkedTreeNode.id === data.id) return;
    checkedTreeNode = data;
    setTreeCurrentKey(data.id);
  }

  /**
   * 添加子节点
   * @param {Object} data 节点数据
   * @return void
   */
  function handleAddChildren(data) {
    editFirstLevelRef.value.openDialog('add_level_other', data);
  }

  /**
   * 当点击了删除部门
   * @param {Object} data 要删除的部门
   * @return void
   */
  function handleDelete(data) {
    if (data.userCnt > 0) {
      ElMessageBox.confirm(
        messageContentRender({
          icon: 'el-icon-error error',
          title: '提示',
          message: '待删除的部门中存在用户，请移除用户后再试！'
        }),
        {
          dangerouslyUseHTMLString: true,
          showConfirmButton: true,
          confirmButtonText: '知道了',
          showCancelButton: false,
          showClose: false
        }
      ).then(() => {});
      return;
    }
    ElMessageBox.confirm(
      messageContentRender({
        icon: 'el-icon-error error',
        title: '提示',
        message: '确认删除该部门？（该部门包含子部门，则子部门的所有信息都会删除）'
      }),
      {
        dangerouslyUseHTMLString: true,
        showConfirmButton: true,
        confirmButtonText: '知道了',
        showCancelButton: true,
        showClose: true,
        cancelButtonText: '关闭'
      }
    ).then(() => {
      deleteStruct({ structId: data.id })
        .then(() => {
          ElMessage.success('删除成功');
          if (checkedTreeNode && checkedTreeNode.id === data.id) {
            checkedTreeNode = null;
          }
          reqStructTree();
        })
        .catch(() => {});
    });
  }

  /**
   * 设置树上的选中
   * @param {Number} id 要选中的数据的ID
   * @return void
   */
  function setTreeCurrentKey(id) {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(id) || isNull(id)) return;
    nextTick(() => {
      treeRef.value.setCurrentKey(id);
    });
  }

  /**
   * 处理刷新
   * @return void
   */
  function onNeedRefreshList() {
    reqStructTree();
  }

  /**
   * 当点击了公司名称
   * @return void
   */
  function onClickGroup() {
    onClickDep(groupData.value, [groupData.value]);
    checkedTreeNode = null;
  }
</script>

<style lang="scss">
  .group-title-popover {
    min-width: 50px !important;
    width: 95px !important;
    padding: 0 0 !important;
    z-index: 1000 !important;
    .group-title-popover-right {
      width: 100%;
      .group-title-popover-right-item {
        width: 100%;
        height: 35px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 0 8px;
        box-sizing: border-box;
        cursor: pointer;
        font-size: 10px;
        .el-checkbox {
          display: inherit;
          .el-checkbox__label {
            font-size: 10px !important;
            padding-left: 5px;
          }
        }
      }
      .group-title-popover-right-item:hover {
        background-color: rgba(64, 158, 255, 0.1);
      }
      .group-title-popover-right-item:not(:first-child) {
        border-top: 1px solid #eee;
      }
    }
  }
</style>
<style scoped lang="scss">
  @import '@/styles/mixin.scss';

  .group-tree-wrapper {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    @include selfScrollBar(rgba(153, 153, 153, 0.59));

    .group-title {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #222222;
      line-height: 22px;

      .group-title-text {
        font-size: 16px;
        font-weight: 500;
      }
      .group-title-right {
        font-size: 14px;
        cursor: pointer;
        > span {
          margin-left: 6px;
        }
      }
    }

    .group-search-wrapper {
      margin-top: 29px;
      margin-bottom: 29px;
    }

    .group-tree-list {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      .only-one-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        .text {
          font-size: 14px;
          font-weight: 500;
          color: #333333;
          line-height: 20px;
          cursor: pointer;
        }
        .icon {
          font-size: 16px;
          color: #999999;
          cursor: pointer;
        }
      }
      .tree-wrapper {
        flex: 1;
        overflow-y: auto;
        @include selfScrollBar(rgba(153, 153, 153, 0.59));
      }

      :deep(.tree .el-tree-node__content > .el-tree-node__expand-icon) {
        padding: 5px;
      }
      :deep(.el-tree-node__label) {
        display: inline-block;
        width: 100%;
        height: 100%;
      }
      .node-item {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        font-size: 14px;
        font-weight: 400;
        user-select: none;
        -moz-user-select: -moz-none;
        -moz-user-select: none;
        -o-user-select: none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        position: relative;
        span {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          width: 100%;
          text-overflow: ellipsis;
        }
        .icon-list-wrapper {
          display: none;
          padding-right: 4px;

          .icon {
            font-size: 14px;
            color: #999999;
            margin-right: 6px;
            cursor: pointer;
          }
        }

        &:hover {
          .icon-list-wrapper {
            display: flex;
          }
        }
      }
      .is-active {
        color: #333333;
      }
      .stop-active,
      .not-active {
        color: #999999;
      }

      .stop-active > span {
        text-decoration: line-through;
      }
    }

    .importBtn {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      opacity: 0;
      z-index: -1;
    }

    :deep(.el-tree-node__content) {
      &:hover {
        background-color: #f7f7f7;
        border-radius: 2px;
      }
    }

    :deep(.el-tree-node.is-current > .el-tree-node__content) {
      background-color: #f7f7f7 !important;
      .expanded.el-tree-node__expand-icon.el-icon-caret-right {
        color: #44a8ff;
      }
      .node-item {
        color: #44a8ff;
        font-weight: 500;
      }
      .el-tree-node__expand-icon.is-leaf {
        &::after {
          background-color: #44a8ff;
        }
      }
    }
    :deep(.el-tree-node__expand-icon.is-leaf) {
      &::after {
        background-color: #d8d8d8;
        content: '';
        width: 6px;
        height: 6px;
        position: absolute;
        right: 6px;
        top: 0;
        bottom: 0;
        margin: auto;
        border-radius: 50%;
      }
    }
  }
</style>
