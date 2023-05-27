<template>
  <table
    class="w-transaction-table mt-10"
    :class="{ 'with-header': `${bold}` }"
  >
    <tr
      v-for="(row, x) in tableData2"
      :key="x"
      :class="{ bold: bold && x === 0 }"
    >
      <td v-for="(col, y) in row" :key="y" :data-th="tableData2[0][y].value">
        {{ tableData2[x][y].value }}
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  name: "transaction-table",
  data() {
    return {
      bold: true,
      tableData2: [
        [
          { value: "TX Hash" },
          { value: "Time" },
          { value: "Address" },
          { value: "Gas Used" },
          { value: "Amount (NEC)" },
        ],
        [
          { value: "0x183 ... 43e" },
          { value: "about 3 hours ago" },
          { value: "0x183 ... 43e" },
          { value: "156629" },
          { value: "0" },
        ],
        [
          { value: "0x183 ... 43e" },
          { value: "about 3 hours ago" },
          { value: "0x183 ... 43e" },
          { value: "156629" },
          { value: "0" },
        ],
        [
          { value: "0x183 ... 43e" },
          { value: "about 3 hours ago" },
          { value: "0x183 ... 43e" },
          { value: "156629" },
          { value: "0" },
        ],
        [
          { value: "0x183 ... 43e" },
          { value: "about 3 hours ago" },
          { value: "0x183 ... 43e" },
          { value: "156629" },
          { value: "0" },
        ],
        [
          { value: "0x183 ... 43e" },
          { value: "about 3 hours ago" },
          { value: "0x183 ... 43e" },
          { value: "156629" },
          { value: "0" },
        ],
        [
          { value: "0x183 ... 43e" },
          { value: "about 3 hours ago" },
          { value: "0x183 ... 43e" },
          { value: "156629" },
          { value: "0" },
        ],
        [
          { value: "0x183 ... 43e" },
          { value: "about 3 hours ago" },
          { value: "0x183 ... 43e" },
          { value: "156629" },
          { value: "0" },
        ],
      ],
    };
  },
};
</script>