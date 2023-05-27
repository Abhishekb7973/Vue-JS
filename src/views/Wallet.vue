<template>
  <div class="wallet">
    <div class="content-box pt-[18px] pb-[18px] xl:px-[41px] px-[31px]">
      <block-header>
        <template v-slot:title>
          <div class="flex items-center">
            <h2>Address</h2>
            <div class="copy-address lg:!flex !hidden">
              <div class="mr-6 overflow-wrap">
                0x0000000000000000000000000000000000000000
              </div>
              <div>
                <img src="../assets/icons/copy.svg" alt="" />
                Copy
              </div>
            </div>
          </div>
        </template>
        <template v-slot:actions>
          <div class="breadcrumb">
            Dashboard
            <img src="../assets/icons/chevron-right.svg" alt="" /> Address
          </div>
        </template>
      </block-header>
      <div class="copy-address lg:!hidden flex justify-between mt-2 !mx-0">
        <div class="overflow-wrap gap-2">
          0x0000000000000000000000000000000000000000
        </div>
        <div>
          <img src="../assets/icons/copy.svg" alt="" />
          Copy
        </div>
      </div>
    </div>

    <div class="grid mlg:grid-cols-11 :grid-cols-2 mt-10 gap-3">
      <div class="mlg:col-span-4 md:col-span-1 col-span-2">
        <div class="content-box pt-[30px] pb-[30px] px-7 2xl:px-[40px]">
          <h4
            class="flex items-center text-[#1C1F37] font-bold text-lg 2xl:text-2xl gap-4 mb-9"
          >
            <img
              src="../assets/icons/balance_icon.svg"
              alt=""
              class="block-icon"
            />
            Total Balance
          </h4>

          <div
            class="sm:flex items-center justify-center md:flex-nowrap flex-wrap mlg:justify-start gap-9"
          >
            <radial-progress-bar class="mx-auto" id="GradientColor" />
            <div>
              <h2
                class="text-[#000] font-bold text-3xl 2xl:text-4xl mb-2 text-nunito"
              >
                500
              </h2>
              <h5 class="text-[#B9B9B9] text-lg 2xl:text-xl text-roboto">
                NEC
              </h5>
            </div>
          </div>
        </div>
      </div>
      <div class="mlg:col-span-4 md:col-span-1 col-span-2">
        <div class="content-box pt-[30px] pb-[30px] px-7 2xl:px-[40px]">
          <h4
            class="flex items-center text-[#1C1F37] font-bold text-lg 2xl:text-2xl gap-4 mb-9"
          >
            <img src="../assets/icons/avalible.svg" class="block-icon" />
            Available
          </h4>
          <div
            class="sm:flex items-center justify-center md:flex-nowrap flex-wrap mlg:justify-start gap-9"
          >
            <radial-progress-bar
              class="mx-auto"
              id="GradientColor2"
              :colors="{ start: '#30E330', end: '#85ee85' }"
            />
            <div>
              <h2
                class="text-[#000] font-bold text-3xl 2xl:text-4xl mb-2 text-nunito"
              >
                1000
              </h2>
              <h5 class="text-[#B9B9B9] text-lg 2xl:text-xl text-roboto">
                NEC
              </h5>
            </div>
          </div>
        </div>
      </div>
      <div class="mlg:col-span-3 col-span-2">
        <div
          class="content-box pt-[30px] pb-[12px] px-7 2xl:px-[40px] h-full flex flex-col justify-between"
        >
          <h4
            class="flex items-center text-[#1C1F37] font-bold text-lg 2xl:text-2xl gap-4 mb-9"
          >
            <img src="../assets/icons/stacking.svg" class="block-icon" />
            Staking
          </h4>

          <ul>
            <li
              class="flex justify-between items-center text-[#313131] text-sm 2xl:text-base mb-4"
              v-for="(i, idx) in stacking"
              :key="idx"
            >
              <div class="font-medium">
                {{ i.name }}
              </div>
              <div class="font-bold">{{ i.value }}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="content-box pt-[36px] pb-[30px] px-[23px] mt-10">
      <div class="tabs mlg:!flex !hidden">
        <div
          class="tab"
          @click="currentTab = i.slug"
          v-for="(i, idx) in tabs"
          :key="idx"
          :class="{ active: currentTab === i.slug }"
        >
          {{ i.name }}
        </div>
      </div>

      <div class="drop-down mlg:!hidden">
        <div class="selected" @click="dropDown = !dropDown">
          {{ selected }}
          <img src="../assets/icons/chevronDown.svg" alt="" />
        </div>

        <ul class="options" :class="{ '!block': dropDown }">
          <li
            :class="{ selected: i.slug === currentTab }"
            @click="select(i)"
            v-for="(i, idx) in tabs"
            :key="idx"
          >
            {{ i.name }}
          </li>
        </ul>
      </div>

      <transaction-table v-if="currentTab === 'transaction'" />
      <erc-20-txn-table v-if="currentTab === 'erc20'" />
      <erc-21-txns-table
        v-if="currentTab === 'erc721' || currentTab === 'erc722'"
      />
      <erc-1155-txns-table v-if="currentTab === 'erc1155'" />
      <assets-table v-if="currentTab === 'assets'" />
      <delegations-table v-if="currentTab === 'delegations'" />
    </div>
  </div>
</template>

<script>
import BlockHeader from "@/components/common/BlockHeader.vue";
import RadialProgressBar from "@/components/common/RadialProgressBar.vue";
import TransactionTable from "@/components/wallet/TransactionTable.vue";
import Erc20TxnTable from "@/components/wallet/Erc20TxnTable.vue";
import Erc21TxnsTable from "@/components/wallet/Erc21TxnsTable.vue";
import Erc1155TxnsTable from "@/components/wallet/Erc1155TxnsTable.vue";
import AssetsTable from "@/components/wallet/AssetsTable.vue";
import DelegationsTable from "@/components/wallet/DelegationsTable.vue";
export default {
  components: {
    BlockHeader,
    RadialProgressBar,
    TransactionTable,
    Erc20TxnTable,
    Erc21TxnsTable,
    Erc1155TxnsTable,
    AssetsTable,
    DelegationsTable,
  },
  name: "wallet-page",
  data() {
    return {
      currentTab: "transaction",
      selected: "Transactions",
      dropDown: false,
      tabs: [
        {
          name: "Transactions",
          slug: "transaction",
        },
        {
          name: "ERC20 Txns",
          slug: "erc20",
        },
        {
          name: "ERC721 Txns",
          slug: "erc721",
        },
        {
          name: "ERC721 Txns",
          slug: "erc722",
        },
        {
          name: "ERC1155 Txns",
          slug: "erc1155",
        },
        {
          name: "Assets",
          slug: "assets",
        },
        {
          name: "Delegations",
          slug: "delegations",
        },
      ],
      stacking: [
        {
          name: "Delegated",
          value: "0 NEC",
        },
        {
          name: "Pending Rewards",
          value: "0 NEC",
        },
        {
          name: "Stashed Rewards",
          value: "-",
        },
        {
          name: "Claimed Rewards",
          value: "-",
        },
        {
          name: "Validators",
          value: "-",
        },
      ],
    };
  },

  created() {},

  methods: {
    select(e) {
      this.currentTab = e.slug;
      this.selected = e.name;
      this.dropDown = false;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>