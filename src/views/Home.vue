<template>
  <div class="dashboard">
    <div class="summery-block mlg:grid mlg:grid-cols-12 lg:!pl-0">
      <div class="xl:col-span-7 mlg:col-span-6 flex flex-col justify-between">
        <div
          class="stats grid xl:grid-cols-4 mlg:grid-cols-2 sm:grid-cols-4 grid-cols-2 xl:mt-10"
        >
          <div class="stats__block">
            <h4>Blocks</h4>
            <h2>
              {{this.stateData.blocks | formatHexToInt}}
            </h2>
            <span class="positive">+13.6%</span>
          </div>
          <div class="stats__block">
            <h4>Validators</h4>
            <h2>{{this.stateData.validators | formatHexToInt }}</h2>
            <span class="negative">-10.6%</span>
          </div>
          <div class="stats__block">
            <h4>Accounts</h4>
            <h2>{{ this.stateData.accounts | formatHexToInt }}</h2>
            <span class="positive">+13.6%</span>
          </div>
          <div class="stats__block">
            <h4>Transactions</h4>
            <h2>{{ this.stateData.transactions | formatHexToInt }}</h2>
            <span class="positive">+13.6%</span>
          </div>
        </div>
        <div class="txt-ad ml-[35px] lg:block hidden">
          This section will be text advertisement
        </div>
      </div>

      <div class="chart xl:col-span-5 mlg:col-span-6">
        <apex-chart
          type="area"
          height="270"
          :options="chartOptions"
          :series="series"
        ></apex-chart>
      </div>
    </div>

    <div class="grid-cols-2 gap-7 2xl:gap-10 mt-6 lg:grid hidden">
      <div class="my_ads_block">Ads</div>
      <div class="my_ads_block">Ads</div>
    </div>

    <div class="grid mlg:grid-cols-2 gap-7 2xl:gap-10 mt-6">
      <latest-blocks :blockData="blockData"/>
      <latest-transactions :transactions="transactionsData" />
    </div>

    <div class="mt-6">
      <total-nec-burned  />
    </div>
  </div>
</template>

<script>
import LatestBlocks from "@/components/dashboard/LatestBlocks.vue";
import LatestTransactions from "@/components/dashboard/LatestTransactions.vue";
import TotalNecBurned from "@/components/dashboard/TotalNECBurned.vue";
// import AnimatedNumber from "animated-number-vue";
import gql from "graphql-tag";
import {  timestampToDate, formatHash, numToFixed, formatNumberByLocale, formatHexToInt } from "@/filters";
import { WEIToNEC } from '@/utils/transactions'

const GET_NEC_LATEST_BLOCK_BURN_LIST = gql`
  query GetNecLatestBlockBurnList($count: Int = 5) {
    necLatestBlockBurnList(count: $count) {
      blockNumber
      timestamp
      necValue
    }
  }
`;

const GET_TRANSACTIONS_LIST = gql`
  query TransactionList($cursor: Cursor, $count: Int!) {
    transactions(cursor: $cursor, count: $count) {
      pageInfo {
        first
        last
        hasNext
        hasPrevious
      }
      totalCount
      edges {
        cursor
        transaction {
          hash
          from
          to
          value
          gasUsed
          block {
            number
            timestamp
          }
        }
      }
    }
  }
`;

const GET_BLOCK_LIST = gql`
  query BlockList($cursor: Cursor, $count: Int!) {
    blocks(cursor: $cursor, count: $count) {
      totalCount
      pageInfo {
        first
        last
        hasNext
        hasPrevious
      }
      edges {
        block {
          hash
          number
          timestamp
          transactionCount
          gasUsed
        }
        cursor
      }
    }
  }
`;

const GET_TX_VOLUMES = gql`
  query TxVolumes($from: String, $to: String) {
    trxVolume(from: $from, to: $to) {
      day
      amount
      volume
    }
  }
`;

const STATE_QUERY = gql`
  query State {
    state {
      blocks
      transactions
      accounts
      validators
      sfcLockingEnabled
      sealedEpoch {
        id
        totalSupply
        baseRewardPerSecond
        __typename
      }
      __typename
    }
  }
`;
export default {
  name: "dashboard-page",
  components: { LatestBlocks, LatestTransactions, TotalNecBurned },
  data() {
    return {
      series: [
        // {
        //   name: "series1",
        //   data: [31, 40, 28, 51, 42, 109, 100],
        // },
        // {
        //   name: "series2",
        //   data: [11, 32, 45, 32, 34, 52, 41],
        // },
      ],
      chartOptions: {
        legend: {
          show: false,
        },
        chart: {
          height: "270px",
          type: "area",
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
        },
        xaxis: {
          type: "datetime",
          categories: [
            "2018-09-19T00:00:00.000Z",
            "2018-09-19T01:30:00.000Z",
            "2018-09-19T02:30:00.000Z",
            "2018-09-19T03:30:00.000Z",
            "2018-09-19T04:30:00.000Z",
            "2018-09-19T05:30:00.000Z",
            "2018-09-19T06:30:00.000Z",
          ],
        },
        tooltip: {
          x: {
            format: "dd/MM/yy HH:mm",
          },
        },
      },
      transactionsData: [],
      blockData: [],
      trxVolumesData: [],
      stateData: [],
    };
  },
  apollo: {
    latestBlockBurnList: {
      query: GET_NEC_LATEST_BLOCK_BURN_LIST,
      variables() {
        return {
          count: 5,
        };
      },
    },
    transactionList: {
      query: GET_TRANSACTIONS_LIST,
      variables: {
        cursor: null,
        count: 10,
      },
      fetchPolicy: "network-only",
      result({ data }) {
        if (data && data.transactions && data.transactions.edges) {
          this.transactionsData = data.transactions.edges;
        }
      },
    },
    blockList: {
      query: GET_BLOCK_LIST,
      variables: {
        cursor: null,
        count: 10,
      },
      fetchPolicy: "network-only",
      result({ data }) {
        if (data && data.blocks && data.blocks.edges) {
          this.blockData = data.blocks.edges;
        }
      },
    },
    states : {
      query: STATE_QUERY,
      fetchPolicy: "network-only",
      result({ data }) {
        if (data && data.state) {
          this.stateData = data.state;
        }
      },
    },
    trxVolumes: {
      query: GET_TX_VOLUMES,
      variables() {
        return {
          from: "2023-04-23",
          to: null,
        };
      },
      result({ data }) {
        if (data && data.trxVolume) {
          this.trxVolumesData = data.trxVolume;
          const xAxisData = [];
          const yAxisData = [];
          data.trxVolume.forEach((element) => {
            xAxisData.push(element.day);
            yAxisData.push(element.volume);
          });
          this.chartOptions.xaxis.categories = xAxisData;
          this.series[0] = { name: "trxVolume", data: yAxisData };
        }
      },
    },
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

<style lang="scss" scoped>
.my_ads_block {
  height: 116px;
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 4px 206px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  font-size: 32px;
  line-height: 41px;
  color: #d7d7d7;
}

@media screen and (max-width: 1500px) {
  .my_ads_block {
    font-size: 26px;
  }
}
</style>
