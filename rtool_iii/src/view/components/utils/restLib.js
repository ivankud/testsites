import { validateFilter } from '../utils';

export class RESTSearchParams {
  constructor() {
    if (typeof arguments[0] === 'string') {
      this.searchParams = new URLSearchParams(arguments[0]);
    } else {
      this.searchParams = new URLSearchParams();
      this.setFilter(arguments[0], arguments[1]);
      this.setSort(arguments[2]);
      this.setPage(arguments[3]);
      this.setPageSize(arguments[4] || 10000);
    }
  }

  setFilter(filter, filterPrefix) {
    if (Array.isArray(filter)) this.filter = validateFilter(filter, filterPrefix);
    else delete this.filter;
  }

  addFilter(filter, filterPrefix) {
    if (!this.filter) this.setFilter(filter, filterPrefix);
    else if (Array.isArray(filter)) {
      const validFilter = validateFilter(filter, filterPrefix);
      this.filter = this.filter.filter((item) => !validFilter.find((x) => x.name === item.name));
      this.filter = this.filter.concat(validFilter);
    }
  }

  setSort(sort) {
    if (Array.isArray(sort)) this.sort = sort.filter((item) => item.dataField);
    else delete this.sort;
  }

  addSort(sort) {
    if (!this.sort) this.setSort(sort);
    else if (Array.isArray(sort)) {
      this.sort = this.sort.filter((item) => !sort.find((x) => x.dataField === item.dataField));
      this.sort = this.sort.concat(sort);
    }
  }

  setPage(page) {
    this.page = page;
  }

  setPageSize(pageSize) {
    this.pageSize = pageSize;
  }

  set(name, value) {
    if (value !== undefined) this.searchParams.set(name, value);
    else this.searchParams.delete(name);
  }

  setSearch(search) {
    // TODO: сделать разбор строки параметров в filter, sort, page, pageSize и остальное
  }

  getSearch() {
    const searchParams = new URLSearchParams(this.searchParams);
    if (this.pageSize > 0) searchParams.set('size', this.pageSize);
    if (this.page >= 0) searchParams.set('page', this.page);
    if (this.sort)
      this.sort.forEach((item) => searchParams.append('sort', item.dataField + ',' + (item.sortType || 'asc')));
    if (this.filter && this.filter.length > 0) searchParams.set('filter', JSON.stringify(this.filter));
    return searchParams.toString();
  }

  getUrl(pathname) {
    let search = this.getSearch();
    if (search.length > 0) search = '?' + search;
    return pathname + search;
  }
}
