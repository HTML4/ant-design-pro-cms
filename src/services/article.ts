import request from '@/utils/request';

export async function getArticleList(): Promise<any> {
  return request('/cms/artcle/getList.do');
}
