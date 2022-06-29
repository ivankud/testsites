import _ from 'lodash';

import { treeNodeHeight } from '../models/TreeTable.model';

const newTreeList = (tree, sortCondition) => {
  // const newTree = tree;
  const newTree = _.orderBy(
    tree,
    [
      (item) => {
        return item.idworkcenterleveltype;
      },
      (item) => {
        return Boolean(item.idparent) ? item.idparent : 0;
      },
      sortCondition[0].dataField,
    ],
    ['asc', 'asc', sortCondition[0].sortType]
  );

  // const addNode = (tree, idparent, child) => {
  //   tree.forEach((item) => {
  //     if (item.id === idparent) {

  //       tree.push(child);

  //       return;
  //     } else {
  //       if (item.children) {
  //         addNode(item.children, idparent, child);
  //       }

  //       return;
  //     }
  //   });
  // };

  const resultTree = [];
  newTree.forEach((item) => {
    if (!Boolean(item.idparent)) {
      resultTree.push({
        id: item.id,
        scaption: item.scaption,
        smnemocode: item.smnemocode,
        swclevelcaption: item.swclevelcaption,
        swclevelmnemocode: item.swclevelmnemocode,
        sdepartleveltypeHL: item.sdepartleveltypeHL,
        sworkcenterhl: item.sworkcenterhl,
      });
    } else {
      const find = item.idparent;

      const idx = resultTree.findIndex((item) => item.id === find);

      if (idx !== -1) {
        // let otstup = '-';
        // let otstup = '-'.repeat(Number(item.idworkcenterleveltype) - 2);
        const spaceChar = String.fromCharCode(160);
        const searchPattern = new RegExp(spaceChar, 'g');
        let otstup = String.fromCharCode(160).repeat((Number(item.idworkcenterleveltype) - 2) * 2);
        // console.log('otstup=', otstup, '==', item.scaption);
        // otstup = '.' + otstup;
        //  const otstup ='<i className='fa fa-fw fa-null '></i>'
        let suffix = '';
        if (Number(item.idworkcenterleveltype) <= 4) {
          suffix = ` (${resultTree[idx].scaption})`.replace(searchPattern, '');
        }
        resultTree.splice(idx + 1, 0, {
          id: item.id,
          scaption: otstup + item.scaption + suffix,
          smnemocode: item.smnemocode,
          swclevelcaption: item.swclevelcaption,
          swclevelmnemocode: item.swclevelmnemocode,
          sdepartleveltypeHL: item.sdepartleveltypeHL,
          sworkcenterhl: item.sworkcenterhl,
        });
      } else {
        resultTree.push({
          id: item.id,
          scaption: item.scaption,
          smnemocode: item.smnemocode,
          swclevelcaption: item.swclevelcaption,
          swclevelmnemocode: item.swclevelmnemocode,
          sdepartleveltypeHL: item.sdepartleveltypeHL,
          sworkcenterhl: item.sworkcenterhl,
        });
      }
      // addNode(resultTree, item.idparent, {
      //   id: item.id,
      //   scaption: item.scaption,
      //   smnemocode: item.smnemocode,
      //   swclevelcaption: item.swclevelcaption,
      //   swclevelmnemocode: item.swclevelmnemocode,
      //   sdepartleveltypeHL: item.sdepartleveltypeHL,
      //   sworkcenterhl: item.sworkcenterhl,
      // });
    }
  });

  return resultTree;
};

const newTree = (tree, sortCondition) => {
  // const newTree = tree;
  let newTree = [];
  if (sortCondition && sortCondition.length > 0)
    newTree = _.orderBy(
      tree,
      [
        (item) => {
          return Boolean(item.idparent) ? item.idparent : 0;
        },
        sortCondition[0].dataField,
      ],
      ['asc', sortCondition[0].sortType]
    );
  else newTree = tree;

  const addNode = (tree, idparent, child) => {
    tree.forEach((item) => {
      if (item.data.id === idparent) {
        if (!item.children) {
          item.children = [];
        }
        item.children.push(child);

        return;
      } else {
        if (item.children) {
          addNode(item.children, idparent, child);
        }

        return;
      }
    });
  };

  const resultTree = { data: [] };
  newTree.forEach((item) => {
    let node = { data: {}, height: treeNodeHeight };
    Object.assign(node.data, item);
    if (!Boolean(item.idparent)) {
      resultTree.data.push(node);
    } else {
      addNode(resultTree.data, item.idparent, node);
    }
  });

  return resultTree;
};

const newTreeReport = (tree) => {
  // const newTree = tree;
  const newTree = tree;

  const addNode = (tree, idparent, child) => {
    tree.forEach((item) => {
      if (item.data.idwc === idparent) {
        if (!item.children) {
          item.children = [];
        }
        item.children.push(child);

        return;
      } else {
        if (item.children) {
          addNode(item.children, idparent, child);
        }

        return;
      }
    });
  };

  const resultTree = { data: [] };
  newTree.forEach((item) => {
    let node = { data: {}, height: treeNodeHeight };
    Object.assign(node.data, item);
    if (!Boolean(item.idwcparent)) {
      resultTree.data.push(node);
    } else {
      addNode(resultTree.data, item.idwcparent, node);
    }
  });

  return resultTree;
};

const findNodes = (tree, filter) => {
  let deleteNode = 1;
  let deleteDownNode = 1;

  if (tree.data) {
    let foundedCount = 0;
    filter.forEach((item) => {
      if (tree.data.hasOwnProperty(item.name)) {
        if (item.operator === 'equal') {
          if (tree.data[item.name].toString().toUpperCase() === item.val.toString().toUpperCase()) {
            foundedCount = foundedCount + 1;
          }
        } else {
          if (item.operator === 'contain') {
            if (tree.data[item.name].toString().toUpperCase().includes(item.val.toString().toUpperCase())) {
              foundedCount = foundedCount + 1;
            }
          }
        }
      }
    });
    if (foundedCount === filter.length) {
      tree.data.find = 1;
      deleteNode = 0;
    } else {
      deleteNode = 1;
    }
  }
  if (tree.children) {
    let deleteParent = 1;
    tree.children.forEach((item) => {
      deleteDownNode = findNodes(item, filter);
      if (deleteDownNode === 0) deleteParent = 0;
    });

    if (deleteParent === 0) {
      tree.data.find = 1;
      deleteNode = 0;
    } else {
      // if (deleteNode === 1) {
      delete tree['children'];
      // } else {
      //   tree.children.forEach((item) => {
      //     item.data.find = 1;
      //   });
      // }
    }
    // console.log(tree,'====');

    return deleteNode;
  } else {
    return deleteNode;
  }
};

const delNodesWithoutFind = (tree) => {
  if (tree.children) {
    tree.children = tree.children.filter((item) => item.data.find === 1);

    tree.children.forEach((item) => {
      delNodesWithoutFind(item);
    });
  } else return;
};

function getMaxDepth(treeValue) {
  let depth = 0;
  treeValue.data.forEach((item) => {
    if (item.metadata.depth > depth) depth = item.metadata.depth;
  });
  return depth;
}

function getTreeValue(treeValue, depth) {
  let height = 0;
  let top = 0;
  // const newArray = treeValue//JSON.parse(JSON.stringify(treeValue))
  treeValue.data.forEach((item) => {
    if (item.metadata.depth < depth) {
      item.$state.isExpanded = true;
      item.$state.isVisible = true;
      height = height + item.metadata.height;
      item.$state.top = height - item.metadata.height;
    }
    if (item.metadata.depth === depth) {
      item.$state.isVisible = true;
      height = height + item.metadata.height;
      item.$state.top = height - item.metadata.height;
      top = item.$state.top;
    }
    if (item.metadata.depth > depth) {
      item.$state.top = top + item.metadata.height;
    }
  });
  treeValue.height = height;

  return treeValue;
}

//дерево для новых таблиц, создание - при создании всегда level=0
function createTree(preTree, sortName) {
  const createNode = (item, level = 0) => {
    // if (notFiltered) item.filtered = false;
    item.level = level++;

    //найдем детей
    const child = preTree.filter((itemData) => itemData.idparent === item.id);
    if (child.length > 0) {
      item.childrens = [];
      child.forEach((itemCh) => {
        item.childrens.push(itemCh);
        const index = item.childrens.length - 1;
        createNode(item.childrens[index], level);
      });
    }
    return item;
  };
  let newArray = [];
  newArray = preTree.filter((item) => item.idparent === null).map((item) => createNode(item));
  if (newArray.length > 0)
    newArray.sort((a, b) => {
      if (a[sortName] > b[sortName]) return 1;
      else return -1;
    });
  return newArray;
}

//дерево для новых таблиц, раскрытие узлов
function getOpenTree(tree, open, treeField) {
  let result = [];
  if (tree && tree.length > 0)
    tree.forEach((item) => {
      const addRecord = (row) => {
        result.push(row);
        if (row.childrens && row.childrens.length > 0) {
          if (!open) {
            row.isExpanded = true;
            row[treeField] = row[treeField].trim() + ' ';
          } else {
            row.isExpanded = false;
            row[treeField] = row[treeField].trim();
          }
          row.childrens.forEach((child) => addRecord(child));
        }
      };
      addRecord(item);
    });
  return result;
}

//на входе последние значения дерева, и последняя открытая структура
function setValueToOpenTree(tree, etalonTree, treeField) {
  let result = getOpenTree(tree, true, treeField);
  let newTree = [];

  if (etalonTree && etalonTree.length > 0) {
    newTree = etalonTree.map((item) => {
      let findedRow = result.filter((itemRes) => itemRes.id === item.id);
      if (findedRow.length > 0) {
        //крышки раскрытий надо оставить
        if (item.childrens && item.isExpanded) {
          findedRow[0].isExpanded = item.isExpanded;
          findedRow[0][treeField] = findedRow[0][treeField].trim() + ' ';
        }
        item = findedRow[0];
      }
      return item;
    });
  }

  return newTree;
}

function treeNodeMatch(filter, row) {
  let foundedCount = 0;
  // console.log('row', row)
  filter.forEach((item) => {
    if (row.hasOwnProperty(item.name)) {
      if (item.operator === 'equal') {
        if (row[item.name].toString().toUpperCase() === item.val.toString().toUpperCase()) {
          foundedCount = foundedCount + 1;
        }
      } else if (item.operator === 'contain') {
        if (row[item.name].toString().toUpperCase().includes(item.val.toString().toUpperCase())) {
          foundedCount = foundedCount + 1;
        }
      } else if (item.operator === 'notequal') {
        if (row[item.name].toString().toUpperCase() !== item.val.toString().toUpperCase()) {
          foundedCount = foundedCount + 1;
        }
      }
    }
  });
  let result = false;
  if (foundedCount === filter.length) {
    // row.filtered = true;
    result = true;
  }
  return result;
}

function setFilterTree(tree, filter, treeField) {
  let result = [];
  if (tree && tree.length > 0 && filter && filter.length > 0) {
    tree.forEach((item) => {
      const addRecord = (row) => {
        result.push(row);
        if (row.childrens && row.childrens.length > 0) {
          row.isExpanded = true;
          row[treeField] = row[treeField].trim() + ' ';
          //проверка узла на соотвествие фильтру
          // let foundedCount = 0;
          // // console.log('row', row)
          // filter.forEach((item) => {
          //   if (row.hasOwnProperty(item.name)) {
          //     if (item.operator === 'equal') {
          //       if (row[item.name].toString().toUpperCase() === item.val.toString().toUpperCase()) {
          //         foundedCount = foundedCount + 1;
          //       }
          //     } else if (item.operator === 'contain') {
          //       if (row[item.name].toString().toUpperCase().includes(item.val.toString().toUpperCase())) {
          //         foundedCount = foundedCount + 1;
          //       }
          //     } else if (item.operator === 'notequal') {
          //       if (row[item.name].toString().toUpperCase() !== item.val.toString().toUpperCase()) {
          //         foundedCount = foundedCount + 1;
          //       }
          //     }
          //   }
          // });
          // if (foundedCount === filter.length) {
          //   row.filtered = true;
          // }
          if (treeNodeMatch(filter, row)) row.filtered = true;
          row.childrens.forEach((child) => addRecord(child));
        } else if (treeNodeMatch(filter, row)) row.filtered = true;
      };
      addRecord(item);
    });
  }

  return result;
}

export {
  newTree,
  newTreeReport,
  newTreeList,
  getTreeValue,
  findNodes,
  delNodesWithoutFind,
  getMaxDepth,
  getOpenTree,
  createTree,
  setFilterTree,
  setValueToOpenTree,
};
