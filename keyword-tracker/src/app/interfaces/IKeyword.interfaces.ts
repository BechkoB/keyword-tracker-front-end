export interface IKeyword {
  id: string;
  name: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  created_at: number;
  suchvolumen: number;
  typ: string;
  urls: IUrl[];
  designated: string;
  tracken: boolean;
}

export interface IUrl {
  id: string;
  name: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  created_at: number;
  typ: string;
  keyword: IKeyword;
}
