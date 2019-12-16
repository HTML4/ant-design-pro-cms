import request from '@/utils/request';

interface addUpdateParams {
  id?: string;
  title: string;
  desc: string;
  thumbnail?: string;
  content: string;
  status?: string;
}

export interface getListParams {
  pageNum?: number;
  pageSize?: number;
  categoryId?: number;
}
export async function getArticleList(params: getListParams): Promise<any> {
  return request('/cms/artcle/getList.do', {
    data: params,
  });
}

export async function getArticleDetail(params: { id: Number }): Promise<any> {
  return request('/cms/artcle/getDetail.do', {
    data: { id: params.id },
  });
}

export async function addUpdateArticle(params: addUpdateParams): Promise<any> {
  return request('/cms/artcle/a/addOrUpdate.do', {
    data: params,
  });
}
