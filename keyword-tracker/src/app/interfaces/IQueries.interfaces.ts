import { IPage } from './IPages.interfaces';

export interface IQuery {
  id: number;
  name: string;
  queries: IQueryData[];
  designated: IPage;
}

export interface IQueryData {
  id: number;
  date_start: string;
  date_end: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  created_at: number;
  suchvolumen: number;
  typ: string;
  query: IQuery;
}
