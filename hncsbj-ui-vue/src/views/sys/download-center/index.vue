<template>
  <el-drawer
    v-model="visible"
    :destroy-on-close="true"
    :size="500"
    title="下载中心"
  >
    <el-scrollbar class="download-center-container">
      <div class="card-list">
        <template v-for="(item, index) in state.dataList" :key="index">
          <el-card class="box-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <el-tag type="info" size="small">文件</el-tag>
                <span class="file-name">{{ item.name }}</span>
              </div>
            </template>

            <div class="card-content">
              <el-row :gutter="20">
                <el-col :span="4">
                  <div class="info-item">
                    <div class="info-label">下载次数</div>
                    <div class="info-value">{{ item.downloadTimes || 0 }}</div>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="info-item">
                    <div class="info-label">创建时间</div>
                    <div class="info-value">{{ item.createTime || '-' }}</div>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="info-item">
                    <div class="info-label">完成时间</div>
                    <div class="info-value">{{ item.completedDateTime || '-' }}</div>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="info-item">
                    <div class="info-label">状态</div>
                    <div class="info-value">
                      <el-tag v-if="item.status === 'SUCCESS'" type="success" size="small">成功</el-tag>
                      <el-tag v-if="item.status === 'FAILED'" type="danger" size="small">失败</el-tag>
                      <el-tag v-if="!item.status && !item.completedDateTime" type="warning" size="small">处理中</el-tag>
                      <span v-if="!item.status && item.completedDateTime">-</span>
                    </div>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="info-item">
                    <div class="info-label">错误信息</div>
                    <div class="info-value">
                      <el-popover
                        v-if="item.remark"
                        placement="top"
                        :width="300"
                        trigger="hover"
                        :content="item.remark"
                      >
                        <template #reference>
                          <el-tag type="warning" size="small">查看</el-tag>
                        </template>
                      </el-popover>
                      <span v-if="!item.remark">-</span>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>

            <template #footer>
              <div class="card-footer">
                <el-button
                  type="primary"
                  :icon="Download"
                  @click="downloadHandle(item.id,item.url)"
                  :disabled="!item.url"
                >
                  下载
                </el-button>
              </div>
            </template>
          </el-card>
        </template>
      </div>

      <!-- 空状态 -->
      <div v-if="state.dataList.length === 0 && !state.dataListLoading" class="empty-state">
        <el-empty description="暂无下载文件" />
      </div>

      <!-- 分页区域 -->
      <div class="pagination-container">
        <el-pagination
          :current-page="state.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="state.limit"
          :total="state.total"
          layout="total, prev, pager, next"
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
        />
      </div>
    </el-scrollbar>
  </el-drawer>
</template>

<script setup lang="ts" name="SysDownloadCenterIndex">
import { nextTick, reactive, ref } from 'vue'
import { useCrud } from "@/hooks"
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import emits from "@/utils/emits"
import {useAddDownloadTimesApi} from "@/api/sys/download-center";

const visible = ref(false)

emits.on('openSysDownloadCenter', () => {
  visible.value = true,
      nextTick(() => {
    getDataList()
        })

})

const state = reactive({
  dataListUrl: '/sys/download-center/page',
  queryForm: {
  },
  dataList: [],
  dataListLoading: false,

})

const { getDataList, sizeChangeHandle, currentChangeHandle } = useCrud(state)

// 下载处理
const downloadHandle = (id:number,url: string) => {
  if (!url) {
    ElMessage.warning('下载链接不存在')
    return
  }
  window.open(url, '_blank')
  useAddDownloadTimesApi(id)
  getDataList()
}

</script>

<style scoped lang="scss">
.download-center-container {
  padding: 15px;

  .card-list {
    margin-bottom: 20px;

    .box-card {
      margin-bottom: 15px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 10px;

    .file-name {
      flex: 1;
      font-weight: 500;
      color: #303133;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .card-content {
    .info-item {
      text-align: center;

      .info-label {
        font-size: 12px;
        color: #909399;
        margin-bottom: 5px;
      }

      .info-value {
        font-size: 14px;
        color: #303133;
        font-weight: 500;
      }
    }
  }

  .card-footer {
    text-align: center;

    .el-button {
      min-width: 100px;
    }
  }

  .empty-state {
    padding: 40px 0;
    text-align: center;
  }

  .pagination-container {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
