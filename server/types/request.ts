export interface IItemsQuery {
  pageNo?: number;
  limit?: number;
}

export interface IPagination {
  take?: number;
  skip?: number;
}

export interface IItemParams {
  id?: number;
}
