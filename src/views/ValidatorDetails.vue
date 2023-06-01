<template>
  <div class="validator-details">
    <div class="content-box pt-[40px] pb-[30px] px-[48px]">
      <block-header>
        <template v-slot:title>
          <h2>Validator Details</h2>
        </template>
        <template v-slot:actions>
          <div class="breadcrumb">
            Home <img src="../assets/icons/chevron-right.svg" alt="" /> Stacking
            <img src="../assets/icons/chevron-right.svg" alt="" /> Validator
            Details
          </div>
        </template>
      </block-header>

      <ul class="strip-list mt-20">
        <li>
          <div>Name</div>
          <div class="imp flex items-center">
            <div class="validator-img">
              <div class="validator-img">
                  <img v-if="cStakerLogoUrl"  :src="cStakerLogoUrl" :alt="cStakerName" class="not-fluid">
                  <img v-else src="../assets/img/ncog-token-with-bevel.png" alt="ncogearthchain logo" class="not-fluid">
              </div>

              {{ cStakerName }}
          </div>
          </div>
        </li>
        <li>
          <div>Validator</div>
          <div v-show="'id' in cStaker">
              {{ cStaker.id | formatHexToInt }}
          </div>
        </li>
        <li>
          <div>Delegate Address</div>
          <div>{{ id}}</div>
        </li>
        <li>
          <div>Staking start epoch</div>
          <div>0</div>
        </li>
        <li>
          <div>Staking start time</div>
          <div>Jan 19, 2022, 06:35 PM GMT+6</div>
        </li>
        <li>
          <div>Amount staked</div>
          <div>10,000,000.00 NEC</div>
        </li>
        <li>
          <div>Amount delegated</div>
          <div>0.00 NEC</div>
        </li>
        <li>
          <div>Staking total</div>
          <div>10,000,000.00 NEC</div>
        </li>
        <li>
          <div>Active</div>
          <div>Yes</div>
        </li>
        <li>
          <div>Online</div>
          <div>Yes</div>
        </li>
        <li>
          <div>Downtime</div>
          <div>0 s</div>
        </li>
        <li>
          <div>Locked Until</div>
          <div>2 transactions in block</div>
        </li>
        <li>
          <div>Lock (Days)</div>
          <div>-</div>
        </li>
      </ul>
    </div>

    <div class="content-box pt-[30px] pb-[30px] px-[48px] mt-8">
      <block-header>
        <template v-slot:title>
          <h2>Delegations <span class="data-count">1</span></h2>
        </template>
      </block-header>

      <table class="block-details-table with-header">
        <tr>
          <td
            class="thead"
            :data-th="th.value"
            v-for="(th, idx) in theadData2"
            :key="'th-' + idx"
          >
            {{ th.value }}
          </td>
        </tr>
        <tr v-for="(item, idx) in tableData2" :key="idx">
          <td
            :data-th="theadData2[idx2].value"
            v-for="(i, idx2) in item"
            :key="'td-' + idx2"
          >
            {{ i.value }}
          </td>
        </tr>
        <tr v-if="tableData2.length < 1" class="mlg:hidden">
          <td
            :data-th="th.value"
            v-for="(th, idx) in theadData2"
            :key="'noItem-' + idx"
            class="!text-[#1E1E1E]"
          >
            no items
          </td>
        </tr>
      </table>
      <div class="no-items" v-if="tableData2.length < 1">No items</div>
    </div>
  </div>
</template>

<script>
import BlockHeader from "@/components/common/BlockHeader.vue";
import gql from "graphql-tag";
const dayS = 60 * 60 * 24;
import {
  timestampToDate,
  formatHash,
  numToFixed,
  formatNumberByLocale,
  formatHexToInt,
  prepareTimestamp
} from "@/filters";
import { WEIToNEC } from "@/utils/transactions";
export default {
  components: { BlockHeader },
  name: "validator-details",
  data() {
    return {
      bold: true,
      theadData2: [
        { value: "Address" },
        { value: "Created On" },
        { value: "Amount (NEC)" },
      ],
      tableData2: [
        [
          { value: "0x1836d1 ... 4ec43e" },
          { value: "Jan 19, 2022, 06:35 PM GMT+6" },
          { value: "10,000,000.00" },
        ],
      ],
      stakerData: {},
    };
  },
  apollo: {
    staker: {
      query: gql`
        query StakerByAddress($address: Address!) {
          staker(address: $address) {
            id
            stakerAddress
            totalStake
            stake
            delegatedMe
            createdEpoch
            createdTime
            downtime
            lockedUntil
            isActive
            isOffline
            stakerInfo {
              name
              website
              contact
              logoUrl
            }
          }
        }
      `,
      variables() {
        return {
          address: this.id,
        };
      },
      result({ data }) {
        this.stakerData = data.staker;
      },
    },
  },
  computed: {
    id() {
      return this.$route.query.id;
    },
    cStaker() {
      return this.staker || {};
    },

    cStakerName() {
      const { stakerData } = this;

      return stakerData && stakerData.stakerInfo && stakerData.stakerInfo.name
        ? stakerData.stakerInfo.name
        : 'Unknown';
    },

    cStakerWebsite() {
      const { stakerData } = this;

      return stakerData && stakerData.stakerInfo
        ? stakerData.stakerInfo.website || stakerData.stakerInfo.contact
        : "";
    },

    cStakerLogoUrl() {
      const { stakerData } = this;

      return stakerData && stakerData.stakerInfo && stakerData.stakerInfo.logoUrl
        ? stakerData.stakerInfo.logoUrl
        : "";
    },

    cDelegationItems() {
      const { cStaker } = this;
      let items = [];

      if (cStaker && cStaker.delegations) {
        items = cStaker.delegations;
      }

      return items;
    },

    cLoading() {
      return this.$apollo.queries.staker.loading;
    },

    cLockDays() {
      const { cStaker } = this;
      const ts =
        cStaker && cStaker.lockedUntil
          ? prepareTimestamp(cStaker.lockedUntil)
          : 0;

      return ts > 0 ? parseInt((ts - Date.now()) / (dayS * 1000), 10) : "-";
    },
  },
  methods: {
    timestampToDate,
    formatHash,
    numToFixed,
    formatNumberByLocale,
    formatHexToInt,
    WEIToNEC,
    prepareTimestamp
  },
};
</script>
