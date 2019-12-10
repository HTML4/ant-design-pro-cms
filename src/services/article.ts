import request from '@/utils/request';

interface addUpdateParams {
  id?: string;
  title: string;
  desc: string;
  thumbnail?: string;
  content: string;
  status?: string;
}

export async function getArticleList(): Promise<any> {
  return request('/cms/artcle/getList.do');
}

export async function addUpdateArticle(params: addUpdateParams): Promise<any> {
  return request('/cms/artcle/a/addOrUpdate.do', {
    data: params,
  });
}
