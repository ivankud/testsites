import _ from 'lodash';
import moment from 'moment';

import { restFieldsName } from '../components/DataParams2/DataParams2';
import { toNumber } from 'reactstrap/lib/utils';
// добавляет определенное количество символов к строке слева

function lpad(str, symb, numb) {
  while (str.length < numb) {
    str = symb.concat(str);
  }
  return str;
}

// возвращает разницу в днях между двумя датами

const MSEC_PER_DAY = 86400000;

const daysBetween = (start, end) => {
  let res = (end.valueOf() - start.valueOf()) / MSEC_PER_DAY + 1;
  return res;
};

// добавляет days дней к дате date

const daysAdd = (date, days) => {
  let res = new Date(date.valueOf() + (days - 1) * MSEC_PER_DAY);
  // res.setDate(res.getDate() + days);
  return res;
};

// добавляет month месяцев к дате date

const monthAdd = (date, month) => {
  let newDate = moment();
  newDate(month, 'month');
  return newDate;
};

// форматирует строку по допустимому формату JS даты либо ISO либо yyyy-mm-dd
// на выходе строка yyyy-mm-dd

function formatDate(str) {
  let newDate = '';
  if (str) {
    let d = new Date(str);
    let dd = d.getDate();
    let mm = d.getMonth() + 1;
    let yyyy = d.getFullYear();
    newDate = lpad(dd.toString(), '0', 2) + '.' + lpad(mm.toString(), '0', 2) + '.' + yyyy;
  }
  return newDate;
}

// переводит дату в строку REST сервера в формате dd.mm.yyyy

function datetoRestDate(date) {
  let restDate = '';
  if (date) {
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    let yyyy = date.getFullYear();
    restDate = lpad(dd.toString(), '0', 2) + '.' + lpad(mm.toString(), '0', 2) + '.' + yyyy;
  }
  return restDate;
}

function restDateToDate2(str) {
  let result = new Date();
  if (str && str.length === 10) {
    let dateArray = str.split('.');
    // console.log('--', dateArray);
    if (dateArray.length === 3) result = new Date(Number(dateArray[2]), Number(dateArray[1] - 1), Number(dateArray[0]));
    // console.log('trtrt', result);
  }
  return new Date(result.setHours(4));
}

// переводит строку REST сервера в формате dd.mm.yyyy в дату

function restDateToDate(str) {
  // const date = moment(str, "DD.MM.YYYY");
  // return date.isValid() ? date.toDate() : new Date();
  let date = new Date();
  if (typeof str === 'string') {
    const a = str.split('.');
    for (let i = 0; i < a.length; i++) {
      let n = Number(a[i]);
      if (!isNaN(n)) {
        if (i === 0) date.setDate(n);
        else if (i === 1) date.setMonth(n - 1);
        else if (i === 2) date.setFullYear(n);
      }
    }
  }
  return date;
}

// переводит дату в строку в формате ISO yyyy-mm-dd

function datetoHtmlDate(date) {
  let htmlDate = '';
  if (date) {
    htmlDate = date.toISOString().split('T')[0];
  }
  return htmlDate;
}

// переводитв строку в формате ISO yyyy-mm-dd в дату

function htmlDateToDate(str) {
  let newDate = '';
  if (str) {
    newDate = new Date(str);
  }
  return newDate;
}

// функция устарела, используйте htmlDateToDate()

function htmltoDate(str) {
  return htmlDateToDate(str);
}

// функция устарела, используйте restDateToDate()

function strtoDate(str) {
  return restDateToDate(str);
}

// группирует массив объектов по ключу - property
// массив должен быть отсортирован по ключу property
//н а выходе [{property:value,group:[{}]},..]

function groupBy(objectArray, property) {
  return objectArray.reduce(
    function(acc, obj, idx, arr) {
      let newObj = {};

      if (idx === 0) {
        newObj[property] = obj[property];
        newObj.group = [];
        acc[idx] = newObj;
        acc[idx].group.push(obj);
      } else {
        if (obj[property] !== arr[idx - 1][property]) {
          newObj[property] = obj[property];
          newObj.group = [];
          acc[idx] = newObj;
          acc[idx].group.push(obj);
        } else {
          let n = idx - 1;
          while (acc[n] === undefined) {
            n = n - 1;
          }
          //const element = array[index];
          acc[n].group.push(obj);
        }
      }
      return acc;
    },
    [{}]
  );
}

// функция сортировки элементов массива по полю типа Date
function mySort(a, b) {
  if (!Boolean(a.doutso)) return -1;
  if (!Boolean(b.doutso)) return 1;
  if (strtoDate(a.doutso) > strtoDate(b.doutso)) return -1;
  if (strtoDate(a.doutso) < strtoDate(b.doutso)) return 1;
  return 0;
}

// количество элементов со статусом в массиве

function countEl(arrEl, status) {
  let n = 0;
  n = arrEl.filter((item) => item.status === status).length;
  return n;
}

function getCaption(key, dataCaption) {
  const newArr = dataCaption.filter((item) => item.dataField === key);
  let result = '';
  if (newArr.length > 0) {
    result = newArr[0].name;
  }
  return result;
}

const sortSeparator = '-';
const filterSeparator = '-';
const otherSeparator = '-';
const prefixSeparator = '.';
const filterGRPSeparator = '.';

function getValue(fullName, prefixName) {
  let result = fullName;
  if (prefixName && fullName.startsWith(prefixName)) {
    result = fullName.substr(fullName.indexOf(prefixSeparator) + 1);
  }
  return result;
}

function getFilterValue(fullName, prefixName, grpFilter) {
  let result = fullName;
  if (prefixName && fullName.startsWith(prefixName)) {
    result = fullName.substr(fullName.indexOf(prefixSeparator) + 1);
  }
  result = result.substr(result.indexOf(filterGRPSeparator) + 1);
  return result;
}

function getNumberFilter(fullName, prefixName) {
  let result = '';
  let resultWithoutPrefix = fullName;
  if (prefixName && fullName.startsWith(prefixName)) {
    resultWithoutPrefix = fullName.substr(fullName.indexOf(prefixSeparator) + 1);
  }
  // console.log('====-prf====', resultWithoutPrefix)
  result = resultWithoutPrefix.substring(0, resultWithoutPrefix.indexOf(filterGRPSeparator));
  return result;
}

function getPageParam(search, prefix) {
  let query = new URLSearchParams(search);
  let prefixName = '';
  if (prefix) {
    prefixName = prefix + prefixSeparator;
  }
  let page = '';
  for (let item of query.entries()) {
    if (item[0] === prefixName + 'page') {
      page = getValue(item[1], prefixName);
    }
  }
  return page;
}

function getOtherParam(search, prefix) {
  let query = new URLSearchParams(search);
  let prefixName = '';
  if (prefix) {
    prefixName = prefix + prefixSeparator;
  }
  let other = [];
  for (let item of query.entries()) {
    if (item[0] === prefixName + 'other') {
      const otherArr = item[1].split(otherSeparator);
      otherArr.forEach((item) => other.push(item));
    }
  }
  return other;
}

// const sortFieldName = 'dataField';
// const sortTypeFieldName = 'sortType';
function getSortParam(search, prefix) {
  let query = new URLSearchParams(search);
  let prefixName = '';
  if (prefix) {
    prefixName = prefix + prefixSeparator;
  }
  let sort = [];
  for (let item of query.entries()) {
    if (item[0] === prefixName + 'sort') {
      const sortArr = item[1].split(sortSeparator);
      let sortType = 'asc';
      if (sortArr[1]) {
        sortType = sortArr[1];
      }
      sort.push({ [restFieldsName.sortFieldName]: sortArr[0], sortType: sortType });
    }
  }
  return sort;
}

function getOptionsParam(search, prefix) {
  let query = new URLSearchParams(search);
  let options = {};
  let prefixName = '';
  if (prefix) {
    prefixName = prefix + '.';
  }
  for (let item of query.entries()) {
    if (
      item[0].startsWith(prefixName) &&
      !item[0].includes('sort') &&
      !item[0].startsWith(prefixName + 'page') &&
      !item[0].includes('other') &&
      !item[0].includes('f0.') &&
      !item[0].includes('f1.') &&
      !item[0].includes('f2.')
    ) {
      const value = item[1];
      let start = 0;
      if (start === 0) start = prefixName.length;
      let key = item[0].substr(start);
      options[key] = value;
    }
  }
  return options;
}

function getFilterParam(search, prefix, filterPrefix) {
  let query = new URLSearchParams(search);
  let prefixName = '';
  if (prefix) {
    prefixName = prefix + prefixSeparator;
  }
  if (filterPrefix) {
    prefixName += filterPrefix + filterGRPSeparator;
  }
  let filter = [];
  for (let item of query.entries()) {
    if (item[0].startsWith(prefixName)) {
      //определим тип переменной фильтра
      let dataType = 'numeric';
      // let start = item[0].indexOf('_') + 1;
      let start = 0;
      if (start === 0) start = prefixName.length;
      if (item[0][start] === 's') {
        dataType = 'string';
      } else {
        if (item[0][start] === 'd') {
          dataType = 'date';
        }
      }
      //определим оператор
      const filterArr = item[0].split(filterSeparator);
      let operator = 'equal';
      if (filterArr[1]) {
        operator = filterArr[1];
      }
      //определим name
      const name = filterArr[0].substr(prefixName.length);

      //определим значение
      let val = item[1];
      if (operator === 'in' || operator === 'notin' || operator === 'between') {
        let arr = [];
        if (item[1]) arr = item[1].split('~');
        if (dataType === 'numeric') {
          arr = arr.map((item) => Number(item));
        }
        val = arr;
      } else if (dataType === 'numeric' && item[1]) val = Number(item[1]);

      filter.push({
        name: name,
        datatype: dataType,
        operator: operator,
        val: val,
      });
    }
  }
  return filter;
}

function getDatatypeByFieldName(fieldName) {
  let dataType = 'numeric';
  // let start = fieldName.indexOf('_') + 1;
  let start = 0;
  if (fieldName[start] === 's') {
    dataType = 'string';
  } else {
    if (fieldName[start] === 'd') {
      dataType = 'date';
    }
  }
  return dataType;
}

function getQueryParams(search, prefix) {
  let query = new URLSearchParams(search);
  let prefixName = '';
  let startNameIdx = 0;
  if (prefix) {
    prefixName = prefix + prefixSeparator;
    startNameIdx = prefixName.length;
  }
  //console.log(query)
  let page = '';
  let sort = [];
  const filter = [];
  const filter1 = [];
  const filter2 = [];
  let other = [];

  for (let item of query.entries()) {
    if (item[0] === prefixName + 'page') {
      page = getValue(item[1], prefixName);
    } else {
      if (item[0] === prefixName + 'sort') {
        const sortArr = item[1].split(sortSeparator);
        let sortType = 'asc';
        if (sortArr[1]) {
          sortType = sortArr[1];
        }
        sort.push({ dataField: sortArr[0], sortType: sortType });
      } else {
        if (item[0] === prefixName + 'other') {
          const otherArr = item[1].split(otherSeparator);
          otherArr.forEach((item) => other.push(item));
        } else {
          //найдем свои фильтры
          //определим тип переменной фильтра

          if (item[0].startsWith(prefixName)) {
            let dataType = 'numeric';
            // let start = item[0].indexOf('_') + 1;
            let start = 0;
            if (start === 0) start = 3 + startNameIdx;
            if (item[0][start] === 's') {
              dataType = 'string';
            } else {
              if (item[0][start] === 'd') {
                dataType = 'date';
              }
            }

            //определим оператор
            const filterArr = item[0].split(filterSeparator);
            let operator = 'equal';
            if (filterArr[1]) {
              operator = filterArr[1];
            }

            const grpFilter = getNumberFilter(filterArr[0], prefixName);

            if (operator === 'in' || operator === 'between' || operator === 'notin') {
              let arr = [];
              if (item[1]) arr = item[1].split('~');
              if (dataType === 'numeric') {
                arr = arr.map((item) => Number(item));
              }

              if ((prefix && filterArr[0].startsWith(prefixName)) || !prefix) {
                if (grpFilter === 'f0') {
                  filter.push({
                    name: getFilterValue(filterArr[0], prefixName, grpFilter),
                    datatype: dataType,
                    operator: operator,
                    val: arr,
                  });
                } else {
                  if (grpFilter === 'f1') {
                    filter1.push({
                      name: getFilterValue(filterArr[0], prefixName, grpFilter),
                      datatype: dataType,
                      operator: operator,
                      val: arr,
                    });
                  } else {
                    if (grpFilter === 'f2') {
                      filter2.push({
                        name: getFilterValue(filterArr[0], prefixName, grpFilter),
                        datatype: dataType,
                        operator: operator,
                        val: arr,
                      });
                    }
                  }
                }
              }
              // else {
              //   if (!prefix) {
              //     arrSave.push({
              //       name: getFilterValue(filterArr[0], prefixName, grpFilter),
              //       datatype: dataType,
              //       operator: operator,
              //       val: arr,
              //     });
              //   }
              // }
            } else {
              if ((prefix && filterArr[0].startsWith(prefixName)) || !prefix) {
                if (grpFilter === 'f0') {
                  filter.push({
                    name: getFilterValue(filterArr[0], prefixName, grpFilter),
                    datatype: dataType,
                    operator: operator,
                    val: item[1],
                  });
                } else {
                  if (grpFilter === 'f1') {
                    filter1.push({
                      name: getFilterValue(filterArr[0], prefixName, grpFilter),
                      datatype: dataType,
                      operator: operator,
                      val: item[1],
                    });
                  } else {
                    if (grpFilter === 'f2') {
                      filter2.push({
                        name: getFilterValue(filterArr[0], prefixName, grpFilter),
                        datatype: dataType,
                        operator: operator,
                        val: item[1],
                      });
                    }
                  }
                }
              }
              // else {
              //   if (!prefix) {
              //     arrSave.push({
              //       name: getFilterValue(filterArr[0], prefixName, grpFilter),
              //       datatype: dataType,
              //       operator: operator,
              //       val: item[1],
              //     });
              //   }
              // }
            }
          }
        }
      }
    }
  }

  return { page: page, filter: filter, sort: sort, other: other, filter1: filter1, filter2: filter2 };
}

function getQuerySearch(page, filter, sort) {
  let search = new URLSearchParams();
  if (page) {
    search.set('page', page);
  }
  if (filter) {
    if (filter.length > 0) {
      filter.forEach((item) => search.append(item.name + filterSeparator + item.operator, item.val));
    }
  }
  if (sort) {
    if (sort.length > 0) {
      sort.forEach((item) => search.append('sort', item.sortField + sortSeparator + item.sortType));
    }
  }
  return search.toString();
}

function setSearchParam(searchString, inputName, paramValue1, prefix, grpFilter = 'f2') {
  let search = new URLSearchParams(searchString);
  const paramValue = _.cloneDeep(paramValue1);
  let paramName = inputName;

  let prefixName = '';
  if (prefix) {
    paramName = prefix + prefixSeparator + inputName;
    prefixName = prefix + prefixSeparator;
  }
  const grpFilterName = (grpFilter === 'f2' ? 'f2' : grpFilter === 'f0' ? 'f0' : 'f1') + filterGRPSeparator;
  // console.log('param=', prefix);
  if (inputName === 'page') {
    search.set(paramName, paramValue);
  } else if (inputName === 'sort') {
    if (paramValue.length > 0) {
      search.delete(paramName);
      paramValue.forEach((item) =>
        search.append(paramName, item[restFieldsName.sortFieldName] + sortSeparator + item.sortType)
      );
    }
  } else if (inputName === 'other') {
    if (paramValue.length > 0) {
      search.delete(paramName);
      let val = '';
      paramValue.forEach((item) => {
        if (val !== '') {
          val = val + otherSeparator + item;
        } else {
          val = item;
        }
      });
      search.append(paramName, val);
    }
  } else if (paramValue.length > 0) {
    const delKeys = [];
    search.forEach((value, key) => {
      if (key !== prefixName + 'page' && key !== prefixName + 'sort' && key !== prefixName + 'other') {
        // console.log('key==', key, ' value');
        // console.log('paramValue', paramValue);
        if (!prefix && key.startsWith(grpFilterName)) {
          delKeys.push(key);
        } else {
          if (key.startsWith(prefixName + grpFilterName)) {
            delKeys.push(key);
          }
        }
      }
    });
    delKeys.forEach((item) => search.delete(item));
    // console.log('searchDel=', search.toString());
    paramValue.forEach((item) => {
      // if (item.val) {
      let val = '';
      if (item.operator === 'between') {
        val = item.val[0] + '~' + item.val[1];
      } else if (item.operator === 'in' || item.operator === 'notin') {
        item.val.forEach((x) => (val = val + '~' + x));
        val = val.substr(1);
      } else {
        if (item.val === 0 || item.val) val = item.val;
      }
      const param = prefixName + grpFilterName + item[restFieldsName.filterFieldName] + filterSeparator + item.operator;
      search.append(param, val);
      // }
    });
  }

  return search.toString();
}

function delSearchParam(searchString, paramName) {
  let search = new URLSearchParams(searchString);

  if (typeof paramName === 'object') {
    search.delete(paramName.name + filterSeparator + paramName.operator);
  } else {
    search.delete(paramName);
  }

  return search.toString();
}

function getSortFromOptions(options, sortName) {
  let result = [];
  if (typeof options === 'object')
    for (const key in options) {
      if (key === sortName) {
        let arrSort = options[key].split('-');
        if (arrSort && arrSort.length === 2) {
          result.push({ dataField: arrSort[0], sortType: arrSort[1] });
        }
      }
    }
  return result;
}

function getFilterArray(filterFields) {
  const filterArray = [];

  if (filterFields.length > 0) {
    filterFields.forEach((item) => {
      //определим тип переменной фильтра
      let dataType = item.datatype;
      if (!dataType) {
        // const start = item.dataField.indexOf('_') + 1;
        const start = 0;
        if (item.dataField[start] === 's') {
          dataType = 'string';
        } else if (item.dataField[start] === 'd') {
          dataType = 'date';
        } else {
          dataType = 'numeric';
        }
      }

      // определим оператор, если он не задан явно
      let operator = item.operator;
      if (!operator) {
        operator = dataType === 'numeric' || dataType === 'date' ? 'equal' : 'contain';
      }

      if (operator === 'in' || operator === 'between' || operator === 'notin') {
        // let n = [];
        // // eslint-disable-next-line no-eval
        // n = eval(item[1]);
        filterArray.push({ name: item.dataField, datatype: dataType, operator: operator, val: '' });
      } else {
        filterArray.push({ name: item.dataField, datatype: dataType, operator: operator, val: '' });
      }
    });
  }
  return filterArray;
}

function validateFilter(filter, prefix) {
  let filterArr = JSON.parse(JSON.stringify(filter));
  let resultArr = [];
  filterArr.forEach((item) => {
    if (item.val === 0 || Boolean(item.val)) {
      if (item.datatype === 'string' && (item.operator === 'contain' || item.operator === 'equal'))
        item.val = item.val.trim();
      if (item.datatype === 'string' && (item.operator === 'in' || item.operator === 'notin')) {
        item.val.forEach((itemVal, idx) => {
          itemVal = itemVal.replace(/^"|"$/gm, '');
          itemVal = itemVal.trim();
          // console.log(itemVal);
          item.val[idx] = itemVal;
        });
      }
      if (prefix) item.name = prefix + item.name;
      // console.log(item.val)
      if (Array.isArray(item.val)) item.val = item.val.filter((x) => x === 0 || Boolean(x));
      if (!Array.isArray(item.val) || item.val.length > 0) resultArr.push(item);
    }
  });
  return resultArr;
}

function decimalFormat(item) {
  let newItem = 0;
  let value = Math.abs(Number(item));
  if (value <= 10) {
    newItem = value.toFixed(2);
  } else if (value <= 1000) {
    newItem = value.toFixed(1);
  } else {
    newItem = value.toFixed(0);
  }
  return newItem;
}

function replaceInArrayById(objectsArray, searchingObject) {
  if (searchingObject.id) {
    let rowIndex = -1;
    objectsArray.forEach((item, index) => {
      if (item.id === searchingObject.id) {
        rowIndex = index;
      }
    });
    if (rowIndex !== -1) {
      objectsArray.splice(rowIndex, 1, searchingObject);
    }
  }
}

// преобраование данных  {id: valueid, number:valuenumber ...}
// в читаемый вариант для запросов post, patch

const makeRequestBody = (data) => {
  return JSON.stringify(data);
};

function validateDate(myDate) {
  return (
    moment(myDate)
      .format('dddd')
      .toString()
      .toUpperCase() !== 'INVALID DATE'
  );
}

function withColumnsTitle(model) {
  if (Array.isArray(model)) {
    model.forEach((item) => {
      if (!item.headerTitle) item.headerTitle = item.text;
    });
  }
  return model;
}

function withColumnsTitle2(model) {
  if (Array.isArray(model)) {
    model.forEach((item) => {
      if (!item.headerTooltip && item.headerName) item.headerTooltip = item.headerName;
    });
  }
  return model;
}

function delSearchFilter(searchString, prefix, filterPrefix) {
  let search = new URLSearchParams(searchString);
  const delKeys = [];
  let prefixName = '';
  if (prefix) {
    prefixName = prefix + prefixSeparator;
  }
  search.forEach((value, key) => {
    if (key.startsWith(prefixName + filterPrefix)) {
      delKeys.push(key);
    }
  });
  delKeys.forEach((item) => search.delete(item));

  return search.toString();
}

function delSearchOptions(searchString, prefix) {
  // console.log('=================');
  let search = new URLSearchParams(searchString);
  const delKeys = [];
  let prefixName = '';
  if (prefix) {
    prefixName = prefix + prefixSeparator;
  }

  search.forEach((value, key) => {
    if (
      key.startsWith(prefixName) &&
      !(key.startsWith(prefixName + 'f0') || key.includes('.f0')) &&
      !(key.startsWith(prefixName + 'f1') || key.includes('.f1')) &&
      !(key.startsWith(prefixName + 'f2') || key.includes('.f2')) &&
      !(key.startsWith(prefixName + 'other') || key.includes('.other')) &&
      !(key.startsWith(prefixName + 'page') || key.includes('.page')) &&
      !(key.startsWith(prefixName + 'sort') || key.includes('.sort'))
    ) {
      delKeys.push(key);
    }
  });
  // console.log('delkeys=', delKeys);
  delKeys.forEach((item) => search.delete(item));

  return search.toString();
}

// возвращает true, если хотябы одна роль из строки role содержится в массиве ролей grants

function isAccessGranted(role, grants) {
  if (typeof role !== 'string') return true;
  const roles = role.split(' ').filter((x) => x.length > 0);
  if (roles.length === 0) return true;
  if (!Array.isArray(grants) || grants.length === 0) return false;
  const grantList = (grants || []).filter((x) => roles.includes(x));
  return grantList.length > 0;
}

function isAccessDenied(role, grants) {
  return !isAccessGranted(role, grants);
}

function StrToNum(value) {
  //заменяет запятую на точку и переводит строку в число
  if (typeof value === 'string') {
    let newValue = value.replace(',', '.');
    newValue = toNumber(newValue);
    return newValue;
  } else return value;
}

function NumToStr(value) {
  //заменяет  точку  на и запятую переводит  число в  строку
  if (typeof value === 'number') {
    let newValue = value.toString();
    newValue = newValue.replace('.', ',');
    return newValue;
  } else return value;
}

//программный вызов клик на элементе divId
function divClick(divId) {
  var elem = document.getElementById(divId);
  if (elem && document.createEvent) {
    var evt = document.createEvent('MouseEvents');
    evt.initEvent('click', true, false);
    elem.dispatchEvent(evt);
  }
}

export {
  withColumnsTitle,
  withColumnsTitle2,
  daysBetween,
  daysAdd,
  delSearchFilter,
  delSearchOptions,
  divClick,
  formatDate,
  countEl,
  mySort,
  groupBy,
  getCaption,
  getQueryParams,
  getQuerySearch,
  getDatatypeByFieldName,
  getSortFromOptions,
  setSearchParam,
  delSearchParam,
  getFilterArray,
  validateFilter,
  decimalFormat,
  datetoHtmlDate,
  htmlDateToDate,
  datetoRestDate,
  restDateToDate,
  restDateToDate2,
  replaceInArrayById,
  makeRequestBody,
  monthAdd,
  validateDate,
  // obsolete functions
  strtoDate,
  htmltoDate,
  getPageParam,
  getOtherParam,
  getSortParam,
  getFilterParam,
  getOptionsParam,
  isAccessGranted,
  isAccessDenied,
  StrToNum,
  NumToStr,
};
