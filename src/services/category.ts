import request from '@/utils/request';

interface addUpdateParams {
  id?: Number;
  name: string;
  status?: Number;
  parentId?: Number;
}
export async function getCategoryList(): Promise<any> {
  return request('/cms/category/getList.do');
}

export async function addUpdateCategory(params: addUpdateParams): Promise<any> {
  console.log('params', params);
  return request('/cms/category/addOrUpdate.do', {
    data: params,
  });
}
