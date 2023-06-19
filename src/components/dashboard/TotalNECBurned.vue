<template>
  <div class="total-nec-burned content-box px-[35px] py-[30px]" style="max-height: 400px;">
    <div class="md:grid md:grid-cols-10">
      <div class="xl:col-span-4 md:col-span-5">
        <block-header>
          <template v-slot:title>
            <h3>Total NEC Burned</h3>
          </template>
        </block-header>

        <div class="nec-box">
          <div>
            <span class="num">{{ formatNumberByLocale(burntTotalCount, 0) }}</span>
            <span>NEC</span>
          </div>
        </div>
      </div>
      <div class="xl:col-span-6 md:col-span-5 ml-8">
        <ul class="nec-list">
          <li v-for="(item, idx) in burntListData" :key="idx">
            <div class="nec-block">
              <img src="../../assets/img/flame-1.png" alt="" />
              <span>
                {{ item.necValue }}
              </span>
            </div>
            <div>
              <div class="name">{{ item.blockNumber | formatHexToInt }}</div>
              <div class="time"><timeago :datetime="timestampToDate(item.timestamp)" :auto-update="1" :converter-options="{includeSeconds: true}"></timeago></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import BlockHeader from "../common/BlockHeader.vue";
import gql from "graphql-tag";
import {
  timestampToDate,
  formatHash,
  numToFixed,
  formatNumberByLocale,
  formatHexToInt,
} from "@/filters";
import { WEIToNEC } from "@/utils/transactions";
const GET_BURNT_TOTAL = gql`
  query GetNecBurnedTotalAmount {
    necBurnedTotalAmount
  }
`;

const GET_BURNT_LIST = gql`
                    query GetNecLatestBlockBurnList($count: Int = 25) {
                      necLatestBlockBurnList(count: $count) {
                            blockNumber
                            timestamp
                            necValue
                        }
                    }
                `;

export default {
  components: { BlockHeader },
  name: "total-nec-burned",
  data() {
    return {
      // nec: [
      //   {
      //     name: "Block 9903",
      //     time: "About 2 hours ago",
      //     block: 0,
      //   },
      //   {
      //     name: "Block 9903",
      //     time: "About 2 hours ago",
      //     block: 0,
      //   },
      //   {
      //     name: "Block 9903",
      //     time: "About 2 hours ago",
      //     block: 0,
      //   },
      //   {
      //     name: "Block 9903",
      //     time: "About 2 hours ago",
      //     block: 0,
      //   },
      //   {
      //     name: "Block 9903",
      //     time: "About 2 hours ago",
      //     block: 0,
      //   },
      // ],

      burntTotalCount: 0,
      burntListData: []
    };
  },
  apollo: {
    necBurnedTotalAmount: {
      query: GET_BURNT_TOTAL,
      fetchPolicy: "network-only",
      result({ data }) {
        if (data && data.necBurnedTotalAmount) {
          this.burntTotalCount = data.necBurnedTotalAmount;
        }
      },
    },
    necLatestBlockBurnList: {
      query: GET_BURNT_LIST,
      variables: {
          count: 4,
      },
      fetchPolicy: "network-only",
      result({ data }) {
        if (data && data.necLatestBlockBurnList) {
          this.burntListData = data.necLatestBlockBurnList;
        }
      },
    }
  },
  methods: {
    timestampToDate,
    formatHash,
    numToFixed,
    formatNumberByLocale,
    formatHexToInt,
    WEIToNEC
  }
};
</script>
