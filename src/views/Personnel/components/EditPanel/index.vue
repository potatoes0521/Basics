<!--
 * @Author: liuYang
 * @Description: 请填写描述信息
 * @Path: 引入路径
 * @Date: 2021-03-18 17:50:50
 * @LastEditors: liu yang
 * @LastEditTime: 2022-12-22 15:11:15
 * @MustParam: 必传参数
 * @OptionalParam: 选传参数
 * @EmitFunction: 函数
 * @Slot/Props.children: 提供的插槽或render
 * @Examples: 使用示例
-->
<template>
  <div class="edit-panel-wrapper">
    <XDrawer ref="drawerRef" destroy-on-close :title="title" @before-close="closeDialog">
      <template #main>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="84px" label-position="right" @submit.prevent @keyup.enter="submitForm('form')">
          <!--  头像 -->
          <el-form-item label="">
            <UploadHead v-model:headImg="form.avatarUrl"> </UploadHead>
          </el-form-item>
          <el-form-item v-if="openType === 'add'" label="用户名" prop="username">
            <el-input v-model.trim="form.username" placeholder="请输入"> </el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model.trim="form.password" show-password type="password" :placeholder="passwordPlaceholder"> </el-input>
          </el-form-item>
          <el-form-item v-if="openType === 'add'" label="工号" prop="workNo">
            <el-input v-model.trim="form.workNo" placeholder="请输入"> </el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="uname">
            <el-input v-model.trim="form.uname" placeholder="请输入"> </el-input>
          </el-form-item>
          <el-form-item label="部门等级" prop="structGrade">
            <el-select v-model="form.structGrade" class="lang-input" clearable filterable placeholder="请选择">
              <el-option v-for="item in structGradeOptions" :key="item.grade" :label="item.name" :value="item.grade"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部门" prop="strcutId">
            <el-cascader
              v-model="form.strcutId"
              class="lang-input"
              clearable
              filterable
              placeholder="请选择部门"
              :options="strcutTree"
              :props="{ expandTrigger: 'click', checkStrictly: true, value: 'id', label: 'name' }"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item label="业务场景" prop="sceneCode">
            <el-select v-model="form.sceneCode" class="lang-input" placeholder="请选择" clearable>
              <el-option v-for="item in sceneCodeList" :key="item.sceneCode" :label="item.sceneName" :value="item.sceneCode"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部门负责人" prop="isPrincipal">
            <el-radio-group v-model="form.isPrincipal">
              <el-radio :label="false">否</el-radio>
              <el-radio :label="true">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="用户等级" prop="userLevel">
            <el-select v-model="form.userLevel" class="lang-input" placeholder="请选择" clearable>
              <el-option v-for="item in userLevelList" :key="item.userLevelCode" :label="item.userLevelName" :value="item.userLevelCode"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账号状态" prop="accountStatus">
            <el-radio-group v-model="form.accountStatus">
              <el-radio v-for="item in statusList" :key="item.id" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="showBindings" label="子系统" prop="bindings">
            <el-select v-model="form.bindings" class="lang-input" clearable multiple collapse-tags collapse-tags-tooltip filterable placeholder="请选择">
              <el-option v-for="item in subsystemList" :key="item.ssId" :label="item.ssName" :value="item.ssId"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="form.sex">
              <el-radio :label="0">女</el-radio>
              <el-radio :label="1">男</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="inline-wrapper">
            <div class="inline">
              <el-form-item inline label="手机号" prop="phoneNo">
                <el-input v-model.trim="form.phoneNo" placeholder="请输入"> </el-input>
              </el-form-item>
            </div>
            <div class="inline">
              <el-form-item label="微信号" prop="wechatNo">
                <el-input v-model.trim="form.wechatNo" placeholder="请输入"> </el-input>
              </el-form-item>
            </div>
          </div>
          <div class="inline-wrapper">
            <div class="inline">
              <el-form-item label="昵称" prop="nickName">
                <el-input v-model.trim="form.nickName" placeholder="请输入"> </el-input>
              </el-form-item>
            </div>
            <div class="inline">
              <el-form-item label="QQ号" prop="qqNo">
                <el-input v-model.trim="form.qqNo" placeholder="请输入"> </el-input>
              </el-form-item>
            </div>
          </div>
          <div class="inline-wrapper">
            <div class="inline">
              <el-form-item inline label="电子邮箱" prop="email">
                <el-input v-model.trim="form.email" placeholder="请输入"> </el-input>
              </el-form-item>
            </div>
            <div class="inline">
              <el-form-item label="薪资" prop="salary">
                <el-input v-model.trim="form.salary" placeholder="请输入"> </el-input>
              </el-form-item>
            </div>
          </div>
          <el-form-item label="个性签名" prop="whatsup">
            <el-input v-model.trim="form.whatsup" placeholder="请输入"> </el-input>
          </el-form-item>
          <el-form-item label="入职时间" prop="workTime">
            <el-date-picker v-model="form.workTime" type="date" placeholder="选择日期" value-format="YYYY-MM-DD"> </el-date-picker>
          </el-form-item>
        </el-form>
        <div class="form-button-wrapper">
          <el-button class="button" type="primary" @click="submitForm('form')">确定</el-button>
          <el-button class="button" @click="closeDialog">取消</el-button>
        </div>
      </template>
    </XDrawer>
  </div>
</template>
<script setup>
  import { XDrawer } from '@xiaoshi/xiaoshi-components';
  import { addUser, editUser, userDetail } from '@/api/modules/user';
  import _intersection from 'lodash/intersection';
  import { getStructTree } from '@/api/modules/struct';
  import { findOnePathById, listToTree } from '@/utils/treeTool';
  import { formValidateIsCodeNumberLine, isEmail, isPhoneNumber, formValidateIsStrongPassword, formValidateIsEditPassword } from '@/utils/patter';
  import { statusList } from './config/status';
  import { desEncrypt } from '@/utils/jsencrypt';
  import UploadHead from './components/UploadHead/index.vue';
  import { getSceneCodeList } from '@/api/modules/setting';
  import { ElMessage } from 'element-plus';

  const emit = defineEmits(['onNeedRefreshList']);

  defineExpose({
    openDialog,
    closeDialog
  });

  const openType = ref('add');
  const title = computed(() => {
    return `${openType.value === 'add' ? '新增' : '编辑'}人员`;
  });

  const passwordMustRules = [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      min: 6,
      max: 16,
      message: '密码长度在6位以上, 16位以下',
      trigger: 'blur'
    },
    {
      validator: formValidateIsStrongPassword,
      trigger: 'blur'
    }
  ];
  const passwordRules = [{ validator: formValidateIsEditPassword, trigger: 'blur' }];

  const baseForm = {
    avatarUrl: '',
    username: '',
    password: '',
    userLevel: '',
    bindings: '',
    accountStatus: 1,
    workNo: '',
    uname: '',
    nickName: '',
    whatsup: '',
    phoneNo: '',
    email: '',
    qqNo: '',
    wechatNo: '',
    sex: 0,
    salary: '',
    workTime: '',
    structGrade: '',
    strcutId: '',
    sceneCode: '',
    isPrincipal: false
  };

  const form = ref({ ...baseForm });
  const formRef = ref(null);

  const rules = ref({
    username: [
      { required: true, message: '请输入登录用户名', trigger: 'blur' },
      {
        validator: formValidateIsCodeNumberLine,
        trigger: 'blur'
      }
    ],
    password: [],
    structGrade: [{ required: true, message: '请选择人员部门等级', trigger: 'change' }],
    strcutId: [{ required: true, message: '请选择人员所在部门', trigger: 'change' }],
    userLevel: [{ required: true, message: '请选择用户等级', trigger: 'change' }],
    sceneCode: [{ required: true, message: '请选择业务场景', trigger: 'change' }],
    bindings: [{ required: false }],
    accountStatus: [{ required: true, message: '请选择账户状态', trigger: 'change' }],
    workNo: [
      { required: true, message: '请输入工号', trigger: 'blur' },
      {
        validator: formValidateIsCodeNumberLine,
        trigger: 'blur'
      }
    ],
    uname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    nickName: [{ required: false }],
    whatsup: [{ required: false }],
    phoneNo: [
      { required: false },
      {
        validator: (rule, value, callback) => {
          if (value && !isPhoneNumber(value)) {
            callback(new Error('请输入正确的手机号'));
          } else {
            callback();
          }
        },
        trigger: 'blur'
      }
    ],
    email: [
      { required: false },
      {
        validator: (rule, value, callback) => {
          if (value && !isEmail(value)) {
            callback(new Error('请输入正确的邮箱'));
          } else {
            callback();
          }
        },
        trigger: 'blur'
      }
    ],
    qqNo: [{ required: false }],
    wechatNo: [{ required: false }],
    sex: [{ required: false }],
    salary: [{ required: false }],
    // workTime: [{ required: false }],
    isPrincipal: [{ required: false }]
  });

  const strcutTree = ref([]);

  const subsystemList = inject('subsystemOptions');
  const userLevelList = inject('userLevelOptions');
  const structGradeOptions = inject('structGradeOptions');

  const sceneCodeList = ref([]);

  function reqSceneCodeList() {
    getSceneCodeList()
      .then(({ data: { rows } }) => {
        sceneCodeList.value = rows.length ? rows : [];
      })
      .catch(() => {});
  }
  reqSceneCodeList();

  const passwordPlaceholder = computed(() => {
    return openType.value === 'add' ? '请输入' : '编辑会重置该人员密码';
  });

  const showBindings = computed(() => {
    return form.value.userLevel && ![99999, 8888].includes(+form.value.userLevel);
  });

  const drawerRef = ref(null);
  function closeDialog() {
    resetForm();
    drawerRef.value.closePanel();
  }

  function resetForm() {
    form.value = { ...baseForm };
    formRef.value.resetFields();
  }

  function openDialog(type, data) {
    openType.value = type;
    handleStatusList(type, data);
    form.value = { ...baseForm };
    if (type === 'edit') {
      rules.value.password = [...passwordRules];
      getDetails(data.userId);
    } else {
      rules.value.password = [...passwordMustRules];
    }
    drawerRef.value.openPanel();
    nextTick(() => {
      formRef.value.resetFields();
    });
  }

  const statusOptions = ref([]);
  function handleStatusList(type, { accountStatus } = {}) {
    if (type.startsWith('add')) {
      statusOptions.value = statusList.filter((item) => item.value !== 2);
    } else if (accountStatus === 1 || accountStatus === 2) {
      statusOptions.value = statusList.filter((item) => item.value !== 0);
    } else {
      statusOptions.value = statusList;
    }
  }

  function getDetails(userId) {
    userDetail({ userId }).then(({ data }) => {
      console.log('🚀 > file: index.vue:323 > userDetail > data', data);
      form.value = { ...data };
      const subsystemNameList = _intersection(
        subsystemList.value.map((item) => item.ssId),
        (form.value.bindings?.split(',') || []).map((item) => +item)
      );
      const path = findOnePathById({
        tree: strcutTree.value,
        idNum: data.strcutId
      });
      form.value.bindings = subsystemNameList;
      form.value.strcutId = path;
    });
  }

  function reqStructTree() {
    getStructTree({}).then(({ data: { structs } }) => {
      const newStructs = structs
        .map((item) => {
          if (!item.pid) {
            item.pid = 0;
          }
          return item;
        })
        .filter((item) => item.status === 1);
      strcutTree.value = listToTree({
        list: newStructs,
        key: 'id',
        Pkey: 'pid',
        orderBy: 'order'
      });
    });
  }

  reqStructTree();

  function submitForm() {
    formRef.value.validate(async (valid) => {
      if (valid) {
        const sendData = { ...form.value };
        console.log('表单提交', sendData);
        sendData.password = (await desEncrypt(sendData.password)) || '';
        if (Array.isArray(sendData.bindings)) {
          sendData.bindings = sendData.bindings?.join();
        }
        if (sendData.strcutId) {
          sendData.strcutId = sendData.strcutId[sendData.strcutId.length - 1];
        }
        if (openType.value === 'add') {
          addUser(sendData).then(() => {
            emit('onNeedRefreshList');
            ElMessage.success('添加成功');
            closeDialog();
          });
        } else {
          delete sendData.username;
          editUser(sendData).then(() => {
            emit('onNeedRefreshList');
            ElMessage.success('编辑成功');
            closeDialog();
          });
        }
      }
    });
  }
</script>
<style scoped lang="scss">
  .inline-wrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .inline {
      width: 48%;
    }
  }
  .form-button-wrapper {
    text-align: right;
    margin-top: 30px;
  }
</style>
