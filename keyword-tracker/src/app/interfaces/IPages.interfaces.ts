import { IQuery } from './IQueries.interfaces';

export interface IPage {
  checked: boolean;
  id: number;
  name: string;
  created_at: number;
  pages: IPagesData[];
  totalClicks: number;
  totalImpressions: number;
  avgPosition: number;
  avgCtr: number;
}

export interface IPagesData {
  id: number;
  date_start: string;
  date_end: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  suchvolumen: number;
  typ: string;
  page: IPage;
  query: IQuery;
  created_at: number;
}
