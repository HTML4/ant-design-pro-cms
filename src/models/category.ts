import { Effect } from 'dva';
import { Reducer } from 'redux';
import { routerRedux } from 'dva/router';
import { getCategoryList, addUpdateCategory } from '@/services/category';
import { message } from 'antd';

export interface CategoryModelState {
  categoryList: Array<{
    id: Number;
    name: string;
    parentId: Number;
    status: Number;
    createTime: Date;
    children: any;
  }>;
}

export interface CategoryModelType {
  namespace: string;
  state: CategoryModelState;
  effects: {
    getCategoryList: Effect;
    addUpdateCategory: Effect;
  };
  reducers: {
    saveCategoryList: Reducer<CategoryModelState>;
  };
}

const CategoryModel: CategoryModelType = {
  namespace: 'category',

  state: {
    categoryList: [],
  },

  effects: {
    *getCategoryList(_, { call, put }) {
      const response = yield call(getCategoryList);
      yield put({
        type: 'saveCategoryList',
        payload: response,
      });
    },
    *addUpdateCategory({ payload }, { call, put }) {
      const response = yield call(addUpdateCategory, payload);
      let msg = {
        message: '添加失败！',
        status: 'error',
      };
      if (response.code === 0) {
        yield put(routerRedux.replace('/category'));
        msg = {
          message: '添加成功！',
          status: 'success',
        };
      }
      message[msg.status](msg.message);
    },
  },

  reducers: {
    saveCategoryList(state, action) {
      return {
        ...state,
        categoryList: (action.payload && action.payload.data) || [],
      };
    },
  },
};

export default CategoryModel;
