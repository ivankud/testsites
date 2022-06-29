import React from 'react';
import { contextMenu, Menu, Item } from 'react-contexify';

class CustomHeader extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickSort = this.handleClickSort.bind(this);
    this.handleShowMenu = this.handleShowMenu.bind(this);
  }

  handleClickSort(event) {
    // let { activeSort } = this.props.activeSort;
    let activeSort = [];
    if (this.props.frameworkComponentWrapper)
      activeSort = this.props.frameworkComponentWrapper.agGridReact.props.activeSort;

    let columnId = this.props.column.colId;
    if (this.props.column.colDef.sortField) columnId = this.props.column.colDef.sortField;

    const sort = this.mathSortColumn(columnId, activeSort);
    let newSort = sort;
    if (sort === 'none') newSort = 'asc';
    if (sort === 'asc') newSort = 'desc';
    if (sort === 'desc') newSort = 'none';
    const sortAttr = [];
    if (newSort !== 'none') sortAttr.push({ dataField: columnId, sortType: newSort });
    this.props.onChangeParam(sortAttr);
  }

  mathSortColumn(columnId, activeSort) {
    let sort = 'none';
    if (activeSort && activeSort.length > 0) {
      activeSort.forEach((item) => {
        if (item.dataField === columnId) sort = item.sortType;
      });
    }
    return sort;
  }

  handleShowMenu(event) {
    // console.log('-------------------')
    let columnId = this.props.column.colId;
    if (this.props.column.colDef.sortField) columnId = this.props.column.colDef.sortField;
    contextMenu.show({ event: event, id: 'menuId' + columnId });
  }
  render() {
    // console.log('props====', this.props);
    // let { activeSort } = this.props.activeSort;
    // let activeSortTable = [];
    // if (activeSort && activeSort.length > 0) activeSortTable = activeSort;
    let activeSort = [];
    if (this.props.frameworkComponentWrapper)
      activeSort = this.props.frameworkComponentWrapper.agGridReact.props.activeSort;
    let columnId = this.props.column.colId;
    if (this.props.column.colDef.sortField) columnId = this.props.column.colDef.sortField;
    let enabledSort = true;
    let sortProps = true;
    if (!this.props.onChangeParam) sortProps = false;
    if (this.props.column.colDef.notSorted || !sortProps) enabledSort = false;
    const visibledSortColumn = this.mathSortColumn(columnId, activeSort);
    return (
      <React.Fragment>
        {enabledSort ? (
          <React.Fragment>
            <div
              onClick={this.handleClickSort}
              className="d-flex flex-row cp_tree-icon"
              // onContextMenu={this.handleShowMenu}
            >
              <div className="text-truncate ">{this.props.displayName}</div>
              {visibledSortColumn === 'asc' && (
                <span id="asc" className="ml-auto ag-icon ag-icon-asc cp_tree-icon align-self-center"></span>
              )}
              {visibledSortColumn === 'desc' && (
                <span id="asc" className="ml-auto ag-icon ag-icon-desc cp_tree-icon align-self-center"></span>
              )}
            </div>
          </React.Fragment>
        ) : (
          <div className="d-flex flex-row">
            <div className="text-truncate ">{this.props.displayName}</div>
          </div>
        )}

        <Menu id={'menuId' + columnId}>
          <Item>1</Item>
          <Item>2</Item>
        </Menu>
      </React.Fragment>
    );
  }
}

export { CustomHeader };
