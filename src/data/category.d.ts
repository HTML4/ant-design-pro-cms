export interface CategoryDetail {
  id: Number;
  name: string;
  parentId: Number;
  status: Number;
  contentModel: Number;
  createTime: Date;
  children: any;
}
