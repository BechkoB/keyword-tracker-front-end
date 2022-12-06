export interface IFilters {
  esv: {
    from: number;
    to: number;
  };
  position: {
    from: number;
    to: number;
  };
  impressions: {
    from: number;
    to: number;
  };
  dates: {
    start: string;
    end: string;
  };
  queryTyp: string;
  relevant: boolean | null;
  query: string;
}
