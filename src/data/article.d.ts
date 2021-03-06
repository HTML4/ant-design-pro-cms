export interface ArticleDetail {
  id: Number;
  categoryId: Number;
  author: String;
  title: string;
  desc: string;
  thumbnail?: string;
  content: string;
  status: Number;
  description: string;
  createTime: Date;
  updateTime: Date;
}

export interface ArticleList {
  pageNum: number;
  pageSize: number;
  total: number;
  list: ArticleDetail[];
}
