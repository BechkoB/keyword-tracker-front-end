export interface IClusters {
  id: number;
  name: string;
  parent: IClusters | null;
  children: IClusters[];
  created_at: string;
}
