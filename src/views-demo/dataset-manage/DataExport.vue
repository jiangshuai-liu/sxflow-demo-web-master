<template>
  <div>
    <el-dialog v-model="dialogVisible" title="数据导入" width="40%" destroy-on-close>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="140px"
        class="demo-ruleForm"
        :size="formSize"
      >
        <el-row>
          <el-col :span="22">
            <el-form-item label="数据集名称" prop="metadataName">
              <el-select v-model="ruleForm.pageStyleId" class="m-2" placeholder="请选择">
                <el-option
                  v-for="item in titleList"
                  :key="item.id"
                  :label="item.datasetName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="excel文件" prop="metadataName">
              <CommonUpload v-model:useFile="excelFile" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button v-my-global-directive type="primary" @click="submitForm(ruleFormRef)"
            >确认</el-button
          >
          <el-button @click="closeDialog">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useRoute } from "vue-router";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessageBox } from "element-plus";
// import { updatemetadatalist } from 'api/metadata/index'
import CommonUpload from "./CommonUpload.vue";
import { queryfillingdatalist } from "@/api/useCommon";
// import { querytablelist } from 'api/data-export/index'
// import { querydefaultdatasetlist } from 'api/diy-statistics/index'
const workflow_id = 433
const dialogVisible = ref(false);
let excelFile = ref([]);
let titleList = ref([]);
const route = useRoute();
const open = (e) => {
  dialogVisible.value = true;
  console.log(e);
  // querydefaultdatasetlist({}).then((res) => {
  // 	console.log(res.data)
  // 	titleList.value = res.data
  // })
  // if (e) {
  // }

  queryfillingdatalist({
		name: '_w' + workflow_id,
	}).then((res) => {
		console.log(res.data)
		titleList.value = res.data.value
	})
};
const emits = defineEmits(["init"]);

const formSize = ref("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = ref({
  metadataName: "", //元数据名称
  columnName: "", //对应数据库表字段
  isEncryption: 0, //加密
  encryptionRule: "", //加密规则
  isConversion: 0, //代码转换
  codeTable: "", //数据字典表
  codeTableId: "",
  statisticsTable: "",
  statisticsTableId: "",
  isStatistics: 0, //统计条件
  isScreen: 0, //筛选条件
  pageGroup: "", //页面所属分组
  pageGroupOrder: "", //分组排序
  isOnlyRow: 0, //列表显示
  isReveal: 1, //是否显示
  isDisplay: 0, //默认显示
  metadataOrder: "", //页面排序
  excelOrder: "", //表格排序
  id: "",
});

const rules = reactive<FormRules>({
  metadataName: [{ required: true, message: "请填入", trigger: "blur" }],
  columnName: [{ required: true, message: "请填入", trigger: "blur" }],
  isEncryption: [{ required: true, message: "请选择", trigger: "change" }],
  encryptionRule: [{ required: true, message: "请填入", trigger: "blur" }],
  isConversion: [{ required: true, message: "请选择", trigger: "change" }],

  codeTable: [{ required: true, message: "请填入", trigger: "blur" }],
  codeTableId: [{ required: true, message: "请填入", trigger: "blur" }],

  isStatistics: [{ required: true, message: "请选择", trigger: "change" }],
  isReveal: [{ required: true, message: "请选择", trigger: "change" }],
  isScreen: [{ required: true, message: "请选择", trigger: "change" }],
  pageGroup: [{ required: true, message: "请填入", trigger: "blur" }],

  pageGroupOrder: [{ required: true, message: "请填入", trigger: "blur" }],
  isOnlyRow: [{ required: true, message: "请选择", trigger: "change" }],
  isDisplay: [{ required: true, message: "请选择", trigger: "change" }],
  metadataOrder: [{ required: true, message: "请填入", trigger: "blur" }],
  excelOrder: [{ required: true, message: "请填入", trigger: "blur" }],
});

const closeDialog = () => {
  resetForm(ruleFormRef.value);
  setTimeout(() => {
    dialogVisible.value = false;
  }, 100);
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      let form = {
        ...ruleForm.value,
        datasetId: route.query.id,
      };
      // updatemetadatalist(form).then((res) => {
      // 	console.log(res)
      // 	if (res.code == 1) {
      // 		resetForm(ruleFormRef.value)
      // 		setTimeout(() => {
      // 			dialogVisible.value = false
      // 		}, 100)
      // 		emits('init')
      // 	}
      // })
      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const options = Array.from({ length: 10000 }).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`,
}));
const handleClose = (done: () => void) => {
  ElMessageBox.confirm("Are you sure to close this dialog?")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};
defineExpose({
  open,
});
</script>
<style lang="scss" scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
