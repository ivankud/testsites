import React from 'react';
import { AgGridReact } from 'ag-grid-react';
// import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
  contextMenu,
  Menu,
  Item,
  // , Separator
} from 'react-contexify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { CustomHeader } from './CustomHeader';
import { MultiFilterService, userProfileStorage } from '../../services';
import { getOpenTree } from '../../utils';
// import { Button } from '../index';

// import { addPage } from '../../redux/actions/AddPage';

function setColumnDefault(props) {
  //попробуем найти в storage
  let columnState = [];
  const location = getLocation();
  if (location) {
    const pathName = location.pathname;
    let tableName = '';
    if (props.tableName) {
      tableName = props.tableName;
    }
    let fullTableName = pathName + '/' + tableName;
    let columnStateStorage = JSON.parse(sessionStorage.getItem(fullTableName));
    if (columnStateStorage) columnState = columnStateStorage;
  }
  let newColumnDefs = [];
  if (columnState.length > 0) {
    //пройдем по storage, чтобы считать сохраненные state и width

    columnState.forEach((storageItem) => {
      props.columnDefs.forEach((modelItem) => {
        if (modelItem.field === storageItem.colId) {
          if (!modelItem.pinned) modelItem.width = storageItem.width;
          if (!modelItem.serviceField) modelItem.hide = storageItem.hide;
          // modelItem.pinned = storageItem.pinned;
          newColumnDefs.push(modelItem);
        }
      });
    });
    //теперь надо пройти по модели, чтобы добавить новые столбцы
    //которых нет в storage
    props.columnDefs.forEach((modelItem, index) => {
      let find = false;
      columnState.forEach((storageItem) => {
        if (storageItem.colId === modelItem.field) find = true;
      });
      if (!find) newColumnDefs.splice(index, 0, modelItem);
    });
  } else {
    newColumnDefs = props.columnDefs;
  }

  //найдем последний flex
  setFlexLastColumn(newColumnDefs);

  return newColumnDefs;
}

function getLocation() {
  let location = window.location.hash;
  let end = location.indexOf('?');
  // if (end===-1)
  if (end !== -1) location = location.substring(1, end - 1);
  else location = location.substr(1);
  return { pathname: location };
}

const setFlexLastColumn = (columns) => {
  // console.log('columns', columns);
  columns.forEach((item, idx) => {
    if (!item.lockPinned) item.flex = 0;
  });
  if (columns && columns.length > 0) {
    const lastFlex = _.findLastIndex(columns, (item) => item.flex === 0 && !item.hide);
    // console.log('last', lastFlex);
    if (lastFlex >= 0) {
      columns[lastFlex].flex = 1;
      columns[lastFlex].minWidth = 70;
    }
  }
};

class BootstrapTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allNodeOpen: false,
      columnsEtalon: _.cloneDeep(this.props.columnDefs),
      columnsDefault: setColumnDefault(this.props),
      menuVisible: false,
      cancelSetEnable: false,
      cancelExecute: false,
      // refreshTable: this.props.refreshTable,
    };
    this.handleGridReady = this.handleGridReady.bind(this);
    this.handleModelUpdated = this.handleModelUpdated.bind(this);
    this.getScreenSize = this.getScreenSize.bind(this);
    this.handleChangeParam = this.handleChangeParam.bind(this);
    this.saveColumnsState = this.saveColumnsState.bind(this);
    // this.handleScroll = this.handleScroll.bind(this);
    this.handleShowMenu = this.handleShowMenu.bind(this);
    this.handleCloseMenu = this.handleCloseMenu.bind(this);
    this.handleClickItem = this.handleClickItem.bind(this);
    this.handleClickCancel = this.handleClickCancel.bind(this);
    this.handleOpenNodes = this.handleOpenNodes.bind(this);
    this.toggleChildren = this.toggleChildren.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.refreshId && this.props.refreshId !== prevProps.refreshId) {
      if (this.gridApi) {
        // console.log('data', this.props.rowData);
        this.gridApi.forEachNode((node) => {
          let row = this.props.rowData.filter((item) => item.id === node.data.id);
          if (row.length > 0) node.data = row[0];
        });
        // console.log('------------1');
        this.gridApi.redrawRows();
      }
    }

    if (prevProps.selected && !_.isEqual(prevProps.selected, this.props.selected)) {
      const { selected } = this.props;
      if (this.props.selected && this.props.selected.length > 0) {
        let lastNode = '';
        this.gridApi.forEachNode((node) => {
          const check = selected.filter((item) => item.id === node.data.id);
          if (check.length > 0) {
            node.selected = true;
            lastNode = node;
          } else node.selected = false;
        });
        if (lastNode) lastNode.setSelected(true);
        this.gridApi.redrawRows();
      }
    }
    if (this.props.selected && this.props.selected.length === 0) {
      if (this.gridApi) {
        // let nodeFirst = undefined;
        this.gridApi.forEachNode((node) => {
          node.selected = false;
          // nodeFirst = node;
        });
        // if (nodeFirst) nodeFirst.setSelected(false);
        this.gridApi.redrawRows();
      }
    }
    if (this.props.selRow !== prevProps.selRow) {
      if (this.gridApi && !this.props.tree) {
        const row = this.gridApi.getRowNode(prevProps.selRow);

        this.gridApi.redrawRows({ rowNodes: [row] });
      }
    }
  }

  handleGridReady({ api, columnApi }) {
    this.gridApi = api;
    this.colApi = columnApi;

    //лучше перерисовать все строки при инициализации.
    this.gridApi.redrawRows();
    //перерисуем строку 0 на которую устанавливается при инициализации
    // const row0 = this.gridApi.getRowNode(0);
    // this.gridApi.redrawRows({ rowNodes: [row0] });

    //перерисуем строку this.props.selRow
    const rowN = this.gridApi.getRowNode(this.props.selRow);
    this.gridApi.redrawRows({ rowNodes: [rowN] });

    // console.log('fullname===', this.getFullTableName())

    // console.log('col=',this.colApi)
    // this.gridApi.node.setRowIndex(1)

    this.getScreenSize();

    // console.log('===selRow===', this.props.selRow)
    // console.log('props========',this.props)
    // if (this.props.selRow !== null && this.props.selRow !== undefined) {

    let firstCol = this.colApi.getAllDisplayedColumns()[0].colId;
    if (this.props.selColumn) firstCol = this.props.selColumn;
    let row = this.props.selRow ? this.props.selRow : 0;

    //считаем позиции для скроллинга если есть
    // let fullTableName = this.getFullTableName();
    // const arrPage = this.props.pages.filter((item) => item.name === fullTableName);
    // if (arrPage.length > 0) {
    //   if (arrPage[0].dataParams.position) {
    //     firstCol = arrPage[0].dataParams.position.column.colId;
    //     row = arrPage[0].dataParams.position.rowIndex;
    //   }
    // }

    const node = this.gridApi.getRowNode(row); //проверим есть ли такая строка
    if (!node) row = 0;
    let column = this.colApi.getColumn(firstCol); //проверим есть ли такой столбец
    if (!column) firstCol = this.colApi.getAllDisplayedColumns()[0].colId;
    //смещение скроллинга
    this.gridApi.ensureIndexVisible(row);
    this.gridApi.ensureColumnVisible(firstCol);

    if (this.props.focusStop) this.gridApi.setFocusedCell(row, firstCol);

    const { selected } = this.props;

    if (this.props.selected && this.props.selected.length > 0) {
      this.gridApi.forEachNode((node) => {
        const check = selected.filter((item) => item.id === node.data.id);
        node.setSelected(check.length > 0);
      });
    }
  }

  handleModelUpdated(prop) {
    if (prop.api && this.props.selRow && this.props.selRow > 0 && !this.props.tree) {
      // console.log('name=', this.getFullTableName())
      // console.log('------------------------',this.props.selRow);
      let firstCol = prop.columnApi.getAllDisplayedColumns()[1].colId;
      if (this.props.selColumn) firstCol = this.props.selColumn;
      let row = this.props.selRow ? this.props.selRow : 0;
      const node = prop.api.getRowNode(row); //проверим есть ли такая строка
      if (!node) row = 0;
      let column = prop.columnApi.getColumn(firstCol); //проверим есть ли такой столбец
      if (!column) firstCol = prop.columnApi.getAllDisplayedColumns()[1].colId;
      //смещение скроллинга
      prop.api.ensureIndexVisible(row);
      prop.api.ensureColumnVisible(firstCol);
    }
  }

  getScreenSize() {
    if (this.gridApi) {
      // this.props.columnDefs.forEach((item) => {
      //   if (item.minScreenSize && window.outerWidth < item.minScreenSize) {
      //     item.hide = true;
      //   } else {
      //     item.hide = false;
      //   }
      // });
      // console.log(this.state.columnsDefault);
      this.gridApi.setColumnDefs(this.state.columnsDefault);
    }
  }

  // componentDidMount() {
  //   if (typeof window !== 'undefined') {
  //     window.addEventListener('resize', this.getScreenSize);
  //   }
  // }

  getFullTableName() {
    let fullTableName = '';
    const location = getLocation();
    if (location) {
      const pathName = location.pathname;
      let tableName = '';
      if (this.props.tableName) {
        tableName = this.props.tableName;
      }
      fullTableName = pathName + '/' + tableName;
    }
    return fullTableName;
  }

  saveColumnsState() {
    const location = getLocation();
    if (location) {
      let fullTableName = this.getFullTableName();
      let columnsState = this.colApi.getColumnState();
      //заменим state после изменения ширины или порядка
      let newCols = [];
      columnsState.forEach((item) => {
        let row = this.state.columnsDefault.filter((itemS) => itemS.field === item.colId);
        if (row.length > 0) {
          row[0].width = item.width;
          newCols.push(row[0]);
        }
      });

      this.setState({ columnsDefault: newCols });
      sessionStorage.setItem(fullTableName, JSON.stringify(columnsState));

      let recordId = '';
      recordId = sessionStorage.getItem(fullTableName + '/baseid');

      //если ИД есть, то надо делать патч
      if (recordId) {
        MultiFilterService.patchUserFilter(
          recordId,
          JSON.stringify({
            // iduser: this.props.user.userid,
            sname: fullTableName,
            soptions: JSON.stringify({
              value: JSON.stringify(columnsState),
              version: userProfileStorage.USER_PROFILE_VERSION,
            }),
          })
        )

          .then(() => {})
          .catch((err) => {
            console.error(err);
          });
      }
      //Если ИД нет, значит по этой таблице ранее не сохраняли фильтры, нужен пост
      else {
        MultiFilterService.postUserFilter(
          JSON.stringify({
            iduser: this.props.user.userid,
            sname: fullTableName,
            soptions: JSON.stringify({
              value: JSON.stringify(columnsState),
              version: userProfileStorage.USER_PROFILE_VERSION,
            }),
          })
        )

          .then((json) => {
            if (json.id) sessionStorage.setItem(fullTableName + '/baseid', json.id);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  }

  // componentWillUnmount() {
  //   // let fullTableName = this.getFullTableName();
  //   // const position = this.gridApi.getFocusedCell();
  //   // this.props.dispatch(
  //   //   addPage({
  //   //     name: fullTableName,
  //   //     dataParams: { position: position },
  //   //   })
  //   // );
  //   if (typeof window !== 'undefined') {
  //     window.removeEventListener('resize', this.getScreenSize);
  //   }
  // }

  handleChangeParam(sort) {
    this.gridApi.refreshHeader();
    this.props.onChangeParam(sort);
  }

  // handleScroll(event) {
  //   this.scrollPosition = event.top;
  //   this.scrollPositionH = event.left;
  //   console.log('posit', this.scrollPositionH);
  // }
  handleShowMenu(event) {
    // console.log('-------------------')
    let cancelSetEnable = false;
    if (event.ctrlKey) cancelSetEnable = true;
    if (!this.state.menuVisible) contextMenu.show({ event: event, id: 'menuId' + this.getFullTableName() });
    this.setState({ menuVisible: !this.state.menuVisible, cancelSetEnable: cancelSetEnable });
  }

  handleCloseMenu() {
    if (this.state.menuVisible) this.setState({ menuVisible: !this.state.menuVisible, cancelSetEnable: false });
    // console.log('close========');
    // if (this.gridApi) {
    //   this.gridApi.setColumnDefs(this.state.columnsDefault);
    //   this.saveColumnsState();
    // }
  }

  handleClickItem(e) {
    // console.log('stop==========', e);
    e.event.stopPropagation();
    // console.log('ee===', e);
    const newCols = [...this.state.columnsDefault];
    newCols.forEach((item) => {
      // console.log('iii=',item)
      if (item.field === e.data) item.hide = !item.hide;
    });
    if (this.gridApi) {
      setFlexLastColumn(newCols);
      this.gridApi.setColumnDefs(newCols);
      this.saveColumnsState();
    }
    this.setState({ columnsDefault: newCols });
  }

  handleClickCancel(e) {
    e.event.stopPropagation();

    // setTimeout(() => this.setState({ cancelExecute: false }), 3000);
    let fullTableName = this.getFullTableName();
    let recordId = '';
    recordId = sessionStorage.getItem(fullTableName + '/baseid');

    //если ИД есть, то надо делать патч
    if (recordId) {
      this.setState({ cancelExecute: true });
      MultiFilterService.deleteUserFilter(recordId)
        .then(() => {
          sessionStorage.removeItem(fullTableName);
          sessionStorage.removeItem(fullTableName + '/baseid');
          if (this.gridApi) {
            // console.log('etalon', this.state.columnsEtalon);
            this.gridApi.setColumnDefs(); //иначе после изменения порядка не возвращает
            // setFlexLastColumn(this.state.columnsEtalon);
            this.gridApi.setColumnDefs(this.state.columnsEtalon);
          }

          this.setState({ cancelExecute: false, columnsDefault: _.cloneDeep(this.state.columnsEtalon) });
        })
        .catch((err) => {
          console.error(err);
          this.setState({ cancelExecute: false });
        });
    }
  }

  handleOpenNodes() {
    let result = getOpenTree(
      this.props.rowData.filter((item) => item.level === 0),
      this.state.allNodeOpen,
      this.props.treeField
    );
    if (this.state.allNodeOpen) result = this.props.rowData.filter((item) => item.level === 0);

    // this.setState({
    //   allNodeOpen: !this.state.allNodeOpen,
    // });
    if (this.gridApi) this.gridApi.setRowData(result);
    // this.props.changeOpenNodes(!this.props.allNodeOpen);
    this.setState({ allNodeOpen: !this.state.allNodeOpen });
  }

  toggleChildren(row) {
    const focusedCell = this.gridApi.getFocusedCell();
    const { treeField } = this.props;

    // вставка
    if (!row.isExpanded) {
      row.isExpanded = true;
      row[treeField] = row[treeField].trim() + ' ';

      this.gridApi.applyTransaction(
        { add: row.childrens, addIndex: focusedCell.rowIndex + 1 },

        { update: [row] }
      );
      this.gridApi.ensureIndexVisible(focusedCell.rowIndex);
    } else {
      row.isExpanded = false;
      row[treeField] = row[treeField].trim();
      const deletedNode = [];
      const updatedNode = [];
      updatedNode.push(row);
      const deleteNode = (item) => {
        if (item.childrens)
          item.childrens.forEach((itemD) => {
            if (itemD.isExpanded) {
              itemD.isExpanded = false;
              itemD[treeField] = itemD[treeField].trim();
              updatedNode.push(itemD);
              deleteNode(itemD);
            }
            deletedNode.push(itemD);
          });
      };
      deleteNode(row);
      this.gridApi.applyTransaction({ remove: deletedNode }, { update: updatedNode });
      this.gridApi.ensureIndexVisible(focusedCell.rowIndex);
      // this.props.changeOpenNodes(false);
      this.setState({ allNodeOpen: false });
    }
  }

  render() {
    let { className, onChangeParam, activeSort, columnDefs, innerRef, ...otherProps } = this.props;
    let activeSortTable = [];
    if (activeSort && activeSort.length > 0) activeSortTable = activeSort;
    const { columnsDefault } = this.state;
    let allColumns = columnsDefault.filter((item) => !item.serviceField);
    className = 'ag-theme-fresh';
    let headerComponentParams = {};
    if (onChangeParam) headerComponentParams = { onChangeParam: this.handleChangeParam, activeSort: activeSort };
    return (
      <React.Fragment>
        <div className="d-flex flex-row h-100 w-100">
          <div>
            <div onClick={this.handleShowMenu} className="align-self-center border-0 pl-1 py-1">
              <FontAwesomeIcon icon="columns" fixedWidth className="text-gray-500" />
            </div>
            {this.props.tree && (
              <div>
                <div onClick={this.handleOpenNodes} className="align-self-center border-0 pl-1 py-1 cursor-pointer">
                  {this.state.allNodeOpen ? (
                    <FontAwesomeIcon icon="angle-double-up" fixedWidth className="text-gray-500" />
                  ) : (
                    <FontAwesomeIcon icon="angle-double-right" fixedWidth className="text-gray-500" />
                  )}
                </div>
              </div>
            )}
          </div>
          <div
            className={className}
            style={{ height: '100%', width: '100%' }}
            // onContextMenu={this.handleShowMenu}
          >
            <AgGridReact
              {...otherProps}
              ref={innerRef}
              rowHeight={33}
              headerHeight={30}
              suppressRowTransform
              singleClickEdit
              rowDeselection={false}
              enableCellTextSelection
              tooltipShowDelay={750}
              suppressDragLeaveHidesColumns
              columnDefs={columnsDefault}
              onDragStopped={this.saveColumnsState}
              suppressPropertyNamesCheck
              activeSort={activeSortTable}
              // rowBuffer={20}
              defaultColDef={{
                resizable: true,

                headerComponentParams: headerComponentParams,
              }}
              frameworkComponents={{ agColumnHeader: CustomHeader }}
              onFirstDataRendered={this.handleGridReady}
              // onGridReady={this.handleReady}
              onModelUpdated={this.handleModelUpdated}
              // onBodyScroll={this.handleScroll}
              // onGridReady={this.handleGridReady}
            />
          </div>
        </div>
        <Menu onHidden={this.handleCloseMenu} id={'menuId' + this.getFullTableName()} className="table-menu">
          {this.state.cancelSetEnable && (
            <Item data="cancelSet" onClick={this.handleClickCancel}>
              {this.state.cancelExecute ? (
                <FontAwesomeIcon icon="circle-notch" spin fixedWidth className="align-self-center mr-1" />
              ) : (
                <FontAwesomeIcon icon="circle" fixedWidth color="transparent" className="mr-1" />
              )}
              <span>Столбцы по умолчанию </span>
            </Item>
          )}
          {allColumns.map((item) => (
            <Item onClick={this.handleClickItem} key={item.field} data={item.field}>
              {!item.hide || (item.hide && item.hide === false) ? (
                <FontAwesomeIcon icon="check" fixedWidth className="mr-1" />
              ) : (
                <FontAwesomeIcon icon="circle" fixedWidth color="transparent" className="mr-1" />
              )}
              <span>{item.headerName}</span>
            </Item>
          ))}
          {/* <Item>2</Item>

          <Item>4</Item>
          <Item>5</Item>
          <Item>6</Item>
          <Item>7</Item>
          <Item>8</Item> */}
        </Menu>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    pages: store.pages,
    user: store.user,
  };
};

const RoutedDataBootstrapTable = connect(mapStateToProps, null, null, { forwardRef: true })(BootstrapTable);
export { RoutedDataBootstrapTable as BootstrapTable };
