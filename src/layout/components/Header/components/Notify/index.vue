<template>
  <div class="notify-wrapper">
    <el-popover ref="targetPopover" trigger="click" placement="bottom" :width="320" popper-class="notify-popover" @show="showPopover" @hide="hidePopover">
      <div class="notify-tab">
        <div class="notify-tab-header">
          <span class="notify-tab-title">消息</span>
          <span class="notify-tab-option" @click="readMessageAll">全部已读</span>
        </div>
        <ul
          v-if="messageList && messageList.length > 0"
          ref="infiniteScrollEl"
          v-infinite-scroll="queryMyNoticeFn"
          class="notify-infinite-list"
          :infinite-scroll-disabled="disabled"
          infinite-scroll-distance="10"
        >
          <li
            v-for="item in messageList"
            :key="item.id"
            class="notify-infinite-list-item"
            :class="{ 'notify-infinite-list-item-active': !(item.unreadUsers.indexOf(userInfo?.userId) !== -1) }"
          >
            <el-badge
              :hidden="!(item.unreadUsers.indexOf(userInfo?.userId) !== -1)"
              :is-dot="item.unreadUsers.indexOf(userInfo?.userId) !== -1"
              class="n-i-l-mark"
            >
              <div class="n-i-l-item">
                <div class="n-i-l-item-title">{{ item.msg }}</div>
                <div class="n-i-l-item-date">{{ item.sendTime }}</div>
              </div>
            </el-badge>
          </li>
          <li v-if="infiniteLoading" class="flex h-30px w-full justify-center items-center">
            <IconEosIconsThreeDotsLoading class="text-[var(--xx-text-color-secondary)] text-[1.3rem]" />
          </li>
          <li v-if="infiniteScrollDisabled" class="flex h-34px w-full text-10px justify-center items-center">没有更多了</li>
        </ul>
        <!-- <div v-if="messageList && messageList.length > 0" class="notify-tab-all-data" @click="toAllList">
          查看全部 <IconIcOutlineArrowCircleRight class="text-[var(--el-text-color-regular)] ml-2px text-[0.9rem] n-t-a-icon" />
        </div> -->
        <div v-if="messageList && messageList.length === 0" class="notify-tab-no-data">
          <el-empty description="暂无数据" :image-size="50" />
        </div>
      </div>
      <template #reference>
        <div class="notify text-[var(--xx-navbar-text-color)] text-[0.9rem]">
          <el-badge :value="unreadNum" :max="99" :hidden="unreadNum == 0" :is-dot="false">
            <IconEpBell />
          </el-badge>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script setup>
  import { useNotify } from './hooks/useNotify';

  const { messageList, showPopover, hidePopover, readMessageAll, userInfo, unreadNum, queryMyNoticeFn, infiniteLoading, infiniteScrollDisabled, disabled } =
    useNotify();
</script>
<style scoped lang="scss">
  .notify {
    @apply cursor-pointer flex h-full items-center justify-center box-border;
  }
</style>
<style lang="scss">
  .notify-popover {
    padding: 0 !important;
    ::-webkit-scrollbar {
      width: 4px;
      background-color: transparent;
    }

    ::-webkit-scrollbar-track {
      border-radius: 10px;
      background-color: transparent;
    }

    ::-webkit-scrollbar-thumb {
      background-color: #e9eaec;
      border-radius: 3px;
    }
    .notify-tab {
      @apply;

      .notify-tab-header {
        @apply border-b-[var(--xx-secondary-bg-color)] border-solid flex border-b-width-1px h-46px px-20px justify-between items-center box-border;
        .notify-tab-title {
          @apply font-600 text-16px text-[#333333];
        }
        .notify-tab-option {
          @apply cursor-pointer text-[var(--el-color-primary)] text-14px;
        }
      }

      .notify-infinite-list {
        overflow: auto;
        @apply h-[400px] m-0 w-full p-0;
        .notify-infinite-list-item {
          @apply cursor-pointer flex w-full px-20px justify-center items-center box-border;

          .n-i-l-mark {
            @apply w-full;
            .el-badge__content {
              @apply top-1/2;
            }
          }

          .n-i-l-item {
            @apply flex flex-col w-full min-h-80px py-20px pr-5px justify-between items-start box-border;
            .n-i-l-item-title {
              @apply font-400 mb-8px text-14px text-[#333333] leading-5;
            }
            .n-i-l-item-date {
              @apply font-400 text-12px text-[#999999];
            }
          }
        }

        .notify-infinite-list-item:hover {
          @apply bg-[#F7F7F7];
        }

        .notify-infinite-list-item-active {
          // @apply bg-[#F7F7F7];
          .n-i-l-item-title {
            color: #999999 !important;
          }
        }
      }

      .notify-tab-all-data {
        @apply border-t-[var(--xx-secondary-bg-color)] border-solid cursor-pointer flex border-t-width-1px h-40px w-full justify-center items-center box-border;
      }
      .notify-tab-all-data:hover {
        @apply text-[var(--el-color-primary)];
        .n-t-a-icon {
          @apply text-[var(--el-color-primary)];
        }
      }

      .notify-tab-no-data {
        height: 400px;
      }
    }
  }

  .notify {
    .el-badge__content.is-fixed {
      transform: translateY(-50%) translateX(100%) scale(0.75);
    }
  }

  .handle-button-right {
    float: right;
  }
</style>
