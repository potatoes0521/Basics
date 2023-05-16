<!--
 * @Author: liuYang
 * @Description: 请填写描述信息
 * @Path: 引入路径
 * @Date: 2021-03-17 10:17:51
 * @LastEditors: liu yang
 * @LastEditTime: 2022-12-01 19:09:01
 * @MustParam: 必传参数
 * @OptionalParam: 选传参数
 * @EmitFunction: 函数
 * @Slot/Props.children: 提供的插槽或render
 * @Examples: 使用示例
-->
<template>
  <el-dialog v-model="dialogVisible" title="详情" width="678px" destroy-on-close>
    <div class="dialog-form-item">
      <div class="form-item-label">子系统名称</div>
      <div class="form-item-value">{{ detailsData.ssName }}</div>
    </div>
    <div class="dialog-form-item">
      <div class="form-item-label">页面uri</div>
      <div class="form-item-value">{{ detailsData.pageUri }}</div>
    </div>
    <div class="dialog-form-item">
      <div class="form-item-label">页面名称</div>
      <div class="form-item-value">{{ detailsData.pageName }}</div>
    </div>
    <div class="dialog-form-item">
      <div class="form-item-label">页面类型</div>
      <div class="form-item-value">{{ pageType }}</div>
    </div>
    <div class="dialog-form-item">
      <div class="form-item-label">描述</div>
      <div class="form-item-value">{{ detailsData.remarks || '暂无' }}</div>
    </div>
    <div class="dialog-form-item">
      <div class="form-item-label">创建时间</div>
      <div class="form-item-value">{{ detailsData.gmtCreate }}</div>
    </div>
    <div class="dialog-form-item">
      <div class="form-item-label">最后编辑时间</div>
      <div class="form-item-value">{{ detailsData.gmtModified }}</div>
    </div>
    <div class="dialog-form-item">
      <div class="form-item-label">功能单元</div>
      <div class="form-item-value">
        <div class="unit-info">
          <span v-if="funcUnits.length <= 0">暂无</span>
          <template v-else>
            <div v-for="(item, i) of funcUnits" :key="i" class="unit-info-item">
              <div class="title">
                <span>名称：{{ item.name }}</span
                ><span>编码：{{ item.code }}</span>
              </div>
              <div class="perms">
                <span class="tit">权限：</span>
                <div class="jurisdiction">
                  <span v-if="item.perms.length <= 0">暂无</span>
                  <template v-else>
                    <el-tag v-for="(v, j) of permsFormmat(item.perms)" :key="j" class="tag-style" type="info">{{ v }}</el-tag>
                  </template>
                </div>
              </div>
              <div class="remarks">
                <span>备注：{{ item.remarks || '暂无' }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script setup>
  import { defineExpose } from 'vue';
  import { getSubsystemPageDetailsFe } from '@/api/modules/sub';

  defineExpose({ openDialog });

  const dialogVisible = ref(false);
  const detailsData = ref({});
  const funcUnits = computed(() => {
    return detailsData.value && detailsData.value.funcUnits && detailsData.value.funcUnits.length >= 0 ? detailsData.value.funcUnits : [];
  });
  const pageType = computed(() => {
    return detailsData.value.pageType === 1 ? '需绑定到菜单' : '游离页面';
  });
  const permsFormmat = (val) => {
    return Array.isArray(val) ? val : [];
  };
  function openDialog(params) {
    dialogVisible.value = true;
    const { pageId } = params;
    getSubsystemPageDetailsFe({ pageId }).then(({ data }) => {
      detailsData.value.funcUnits = [
        ...data.funcUnits.map((v) => {
          if (v.perms) {
            v.perms = v.perms.split(',');
          } else {
            v.perms = [];
          }
          return v;
        })
      ];
      detailsData.value = { ...data };
      console.log(detailsData.value);
    });
  }
</script>
<style scoped lang="scss">
  .dialog-form-item {
    display: flex;
    align-items: flex-start;
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 20px;

    .form-item-label {
      width: 85px;
      text-align: right;
      margin-right: 20px;
      color: #999999;
      line-height: 20px;
    }
    .form-item-value {
      flex: 1;
      line-height: 20px;
      color: #333333;
      text-align: justify;
    }
    .unit-info {
      width: 100%;

      .unit-info-item {
        width: 100%;
        padding: 20px 15px 20px 15px;
        box-sizing: border-box;
        background: #f5f6fa;

        .title {
          width: 100%;
          display: flex;
          justify-content: flex-start;
          font-weight: 500;
          margin-bottom: 15px;
          span {
            margin-right: 20px;
          }
        }
        .perms {
          margin-bottom: 8px;
          display: flex;
          .tit {
            width: 44px;
            flex-shrink: 0;
          }
          .jurisdiction {
            .tag-style {
              margin-bottom: 4px;
              margin-right: 4px;
            }
          }
        }
      }
      .unit-info-item:not(:last-child) {
        margin-bottom: 10px;
      }
    }
  }
</style>
