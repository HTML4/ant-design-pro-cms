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
  pageNum?: Number;
  pageSize?: Number;
  categoryId?: Number;
}
export async function getArticleList(params: getListParams): Promise<any> {
  return request('/cms/artcle/getArtcleList.do', {
    data: params,
  });
}

export async function getArticleDetail(params: { id: Number }): Promise<any> {
  return request('/cms/artcle/getArtcleDetail.do', {
    data: { id: params.id },
  });
}

export async function addUpdateArticle(params: addUpdateParams): Promise<any> {
  return request('/cms/artcle/a/addOrUpdateArtcle.do', {
    data: params,
  });
}

export async function deleteArticle(id: Number): Promise<any> {
  return request('/cms/artcle/a/deleteArtcle.do', {
    data: { id },
  });
}
