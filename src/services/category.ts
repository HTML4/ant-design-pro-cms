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

export async function getCategoryDetail(params: { id: Number }): Promise<any> {
  return request('/cms/category/getDetail.do', {
    data: { id: params.id },
  });
}

export async function addUpdateCategory(params: addUpdateParams): Promise<any> {
  return request('/cms/category/a/addOrUpdate.do', {
    data: params,
  });
}
