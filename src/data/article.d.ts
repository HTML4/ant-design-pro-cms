export interface ArticleDetail {
  id: Number;
  categoryId: Number;
  author: String;
  title: string;
  desc: string;
  thumbnail?: string;
  status: Number;
  createTime: Date;
  updateTime: Date;
}
