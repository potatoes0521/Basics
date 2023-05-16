/*
 * @Author: liuYang
 * @Description: 各种转换数据格式的方法
 * @Path: 引入路径
 * @Date: 2021-03-20 16:37:05
 * @LastEditors: liu yang
 * @LastEditTime: 2023-05-16 10:13:45
 * @MustParam: 必传参数
 * @OptionalParam: 选传参数
 * @EmitFunction: 函数
 * @Slot/Props.children: 提供的插槽或render
 * @Examples: 使用示例
 */

import _orderBy from 'lodash/orderBy';
import _cloneDeep from 'lodash/cloneDeep';
import { isNullOrUnDef } from './typeOf';

/**
 *  线性数据转换成树形数据
 * @param {Array} list tree数据
 * @param {String} pDefaultValue 默认父级节点名称
 * @param {String} key id的key
 * @param {String} Pkey 父级ID的key
 * @param {String} orderBy 按照哪个字段排序
 * @param {String} orderType 排序类型  desc 降序, asc升序
 * @param {Boolean} needParentData 是否需要父级节点数据  不推荐需要 容易造成数据臃肿
 * @return void
 */
export const listToTree = ({
  list,
  key = 'menuId',
  Pkey = 'menuPid',
  orderBy = 'order',
  orderType = ['asc'],
  needParentData = false,
  pDefaultValue = 0,
  childrenKey = 'children',
  childrenDefaultValue = null
}) => {
  let root = {};
  root[key] = pDefaultValue;
  root[Pkey] = pDefaultValue;
  root[childrenKey] = [];
  const group = {};
  for (let index = 0; index < list.length; index += 1) {
    if (!list[index][Pkey]) list[index][Pkey] = pDefaultValue || 0;
    if (list[index][Pkey] !== null && list[index][Pkey] !== undefined) {
      if (!group[list[index][Pkey]]) {
        group[list[index][Pkey]] = [];
      }
      group[list[index][Pkey]].push(list[index]);
    }
  }
  const queue = [];
  queue.push(root);
  while (queue.length) {
    const node = queue.shift();
    node[childrenKey] = group[node[key]] && group[node[key]].length ? group[node[key]] : childrenDefaultValue;
    if (node[childrenKey]) {
      node[childrenKey] = _orderBy(node[childrenKey], orderBy, orderType).map((item, index) => ({
        ...item,
        index, // 当前下标
        parent: needParentData ? node : null, // 父级节点
        parentChildrenLength: node.length // 父级节点
      }));
      queue.push(...node[childrenKey]);
    }
  }
  return root[childrenKey];
};
/**
 * 同步选中
 * 一般应用于处理根据部分数据选中tree里面的某一部分数据
 * @param {Array[Object]} needCleanData 需要处理的树形数据
 * @param {Array[Object]} checkedData 需要参照处理的属性数据
 * @param {String} statusKey='checked'需要处理的属性
 * @param {String} idKey='id'} 关键字
 * @return void
 */
export const SyncSelection = ({ needCleanData, checkedData, statusKey = 'checked', idKey = 'id' }) => {
  if (!needCleanData || !needCleanData.length) {
    return;
  }
  const mapData = checkedData.reduce(
    (res, item) => ({
      ...res,
      [item[idKey]]: item
    }),
    {}
  );
  dfs({
    needCleanData,
    mapData,
    statusKey,
    idKey
  });
};
/**
 * 递归处理
 * @param {Array[Object]} arr 要处理的数据
 * @param {Map} mapData map类型的参照数据
 * @param {String} statusKey='checked' 需要处理的属性
 * @param {String} idKey='id'} 关键字
 * @return void
 */
const dfs = ({ needCleanData, mapData, statusKey = 'checked', idKey = 'id' }) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const item of needCleanData) {
    if (item.children) {
      dfs({
        needCleanData: item.children,
        mapData,
        statusKey,
        idKey
      });
    }
    if (item[idKey] in mapData) {
      item[statusKey] = true;
    } else {
      item[statusKey] = false;
    }
  }
};

/**
 * 将一个数组转化为map类型
 * @param {Array[Object]} arrayData
 * @param {String} idKey='id' 关键字
 * @return {Map} map类型的数据
 */
export const arrayToMapBy = ({ arrayData, idKey = 'id' }) => {
  const mapData = arrayData.reduce(
    (res, item) => ({
      ...res,
      [item[idKey]]: item
    }),
    {}
  );
  return mapData;
};

/**
 * 根据目标查找tree里面所有路径
 * @param {Array[Object]} tree 参数描述
 * @param {Number | String} idNum 参数描述
 * @param {String} idKey='id' 参数描述
 * @return {Object}
 *  path = [path1, path2, path3, ...]
 *  pathList = [...path1, ...path2, ...path3, ...xxx]
 */
export const findPathById = (tree, idNum, idKey = 'id') => {
  // eslint-disable-next-line no-restricted-globals
  if (!tree || !tree.length || isNaN(idNum)) {
    return {
      path: [],
      pathList: []
    };
  }
  let path = [];
  let pathList = [];
  const findPath = (tree2, idNum2, arr) => {
    for (let i = 0; i < tree2.length; i++) {
      let tempPath = [...arr];
      tempPath.push(tree2[i][idKey]);
      if (tree2[i][idKey] === idNum2) {
        return tempPath;
      }
      if (tree2[i].children) {
        let result = findPath(tree2[i].children, idNum2, tempPath);
        if (result) {
          path.push(result);
          pathList = [...pathList, ...result];
        }
      }
    }
  };
  findPath(tree, idNum, []);
  return {
    path,
    pathList
  };
};
/**
 * 根据目标查找tree里面单条路径
 * @param {Array[Object]} tree 参数描述
 * @param {Number | String} idNum 要查找的值
 * @param {String} idKey='id' 参数描述
 * @return {Array} [xxx, xxx, xxx, id]
 */
export const findOnePathById = ({ tree, idNum, idKey = 'id', arr = [], allData = false }) => {
  if (!tree || !tree.length || isNullOrUnDef(idNum)) {
    return [];
  }
  for (let i = 0; i < tree.length; i++) {
    let tempPath = [...arr];
    if (allData) {
      tempPath.push(tree[i]);
    } else {
      tempPath.push(tree[i][idKey]);
    }
    if (tree[i][idKey] === idNum) {
      return tempPath;
    }
    if (tree[i].children) {
      let result = findOnePathById({
        tree: tree[i].children,
        idNum,
        idKey,
        arr: tempPath,
        allData
      });
      if (result) {
        return result;
      }
    }
  }
};

/**
 * 数组扁平化
 * @param {Array[Object]} arr 要处理的数据
 * @param {String} key 关键字
 * @return void
 */
export const flatten = (arr, key = 'children') => {
  if (!arr || !arr.length) return [];
  return (
    arr.reduce((result, item) => {
      return result.concat(Array.isArray(item[key]) ? flatten(item[key]) : item);
    }, []) || []
  );
};
/**
 * 树形数据转为线性数据
 * @param {Array[Object]} arr 参数描述
 * @param {String} key='children' 参数描述
 * @return void
 */
export const treeToList = (arr, key = 'children', pkey = 'id') => {
  let queen = [];
  let result = [];
  queen = _cloneDeep(arr);
  while (queen.length) {
    const item = { ...queen.shift() };

    if (item[key]) {
      if (pkey) {
        item[key] = item[key].map((ite) => ({
          ...ite,
          [`p${pkey}`]: item[pkey]
        }));
      }
      if (item.id) {
        item[key] = item[key].map((ite) => ({
          ...ite,
          pid: item.id || 0
        }));
      }
      queen = queen.concat(item[key]);
      delete item[key];
    }

    result.push(item);
  }
  return result;
};

/**
 * 处理el-tree显示子节点数量，输入树结构节点，获取节点下所有子节点数量
 * @param {Object[Node]} node el-tree树结构节点
 * @return {Number}
 */
export const childNodesNum = (node) => {
  if (!(node && node.data)) return 0;
  if (node.data.length <= 0) return 0;
  let nums = 0;
  let queue = [{ ...node }];
  while (queue.length) {
    let item = { ...queue.shift() };
    if (item.childNodes && [...item.childNodes].length > 0) {
      queue.push(...item.childNodes);
    }
    if ([...item.childNodes].length === 0) {
      if (item.visible) {
        nums++;
      }
    }
  }
  return nums;
};

/**
 * @Author: liu yang
 * @Date: 2021-11-20 10:55:16
 * @description: 根据ID  删除当前树节点和他的子节点
 * @param {*}
 * @return {*}
 */
export const deleteLikeIdInTree = (treeData, id) => {
  let newData = treeData.filter((x) => x.id !== id);
  newData.forEach((x) => x.children && (x.children = deleteLikeIdInTree(x.children, id)));
  return newData;
};

/**
 * @Author: liu yang
 * @Date: 2021-11-20 10:55:40
 * @description: 删除所有空数组的节点
 * @param {*}
 * @return {*}
 */
export const deleteEmptyChildren = (treeData, childrenKey = 'children') => {
  if (treeData.length) {
    treeData.forEach((ele) => {
      if (Array.isArray(ele[childrenKey]) && ele[childrenKey].length) {
        deleteEmptyChildren(ele[childrenKey]);
      } else {
        delete ele[childrenKey];
      }
    });
  }
  return treeData;
};

/**
 * @Author: liu yang
 * @Date: 2022-11-17 14:10:28
 * @description: 在树形数据中找到某个节点
 * @param {*} tree
 * @param {*} func
 * @return {*}
 */
export function findNode(tree, func) {
  let curTree = _cloneDeep(tree);
  for (let i = 0; i < curTree.length; i++) {
    if (func(curTree[i])) {
      return curTree[i];
    }
    if (curTree[i].children) {
      curTree.splice(i + 1, 0, ...curTree[i].children);
    }
  }
}

/**
 * @Author: liu yang
 * @Date: 2022-11-17 14:10:44
 * @description: 找到树种某个叶子节点
 * @param {*} tree
 * @return {*}
 */
export function firstNoChildrenNode(tree) {
  return findNode(tree, (node) => {
    return !node.children;
  });
}
