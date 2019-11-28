import request from '@/utils/request';

export async function getCategoryList(): Promise<any> {
  return request('/cms/category/getList.do');
}
