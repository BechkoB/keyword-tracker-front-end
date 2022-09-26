export interface IFilters {
  suchvolumen: {
    from: number | null;
    to: number | null;
  };
  position: {
    from: number | null;
    to: number | null;
  };
  impressions: {
    from: number | null;
    to: number | null;
  };
  dates: {
    start: string | null;
    end: string | null;
  };
  keywordTyp: string;
  keyword: string;
}
