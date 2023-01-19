import { IQuery } from './IQueries.interfaces';

export interface IClusters {
  queriesCount: number;
  esv: string;
  id: number;
  name: string;
  parent: IClusters | null;
  children: IClusters[];
  queries: IQuery[];
  created_at: string;
  totalClicks: number;
  totalImpressions: number;
  avgPosition: number;
  avgCtr: number;
}
