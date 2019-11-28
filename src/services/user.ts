import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  // return request('/api/currentUser');
  return request('/cms/user/get_user_info.do');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}
