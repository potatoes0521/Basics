/*
 * @LastEditTime: 2022-12-05 16:03:00
 * @Description: xlsx导出
 * @Date: 2022-12-01 17:58:15
 * @Author: liu yang
 * @LastEditors: liu yang
 */
import { utils, writeFileXLSX } from 'xlsx';

export default function useXlsx() {
  const exportXlsx = (name, dataList, hashMap) => {
    name = name || 'qishi_xlsx';

    const data = dataList.map((v) => {
      let obj = {};
      Object.keys(hashMap).map((key) => {
        obj[hashMap[key]] = v[key];
      });
      return obj;
    });

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Sheet');
    // utils.sheet_add_aoa(ws, [Object.values(hashMap)], { origin: 'A1' });
    writeFileXLSX(wb, `${name}.xlsx`);
  };

  return {
    exportXlsx
  };
}
