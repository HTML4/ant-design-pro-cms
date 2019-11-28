import { Effect } from 'dva';
import { Reducer } from 'redux';

import { getCategoryList } from '@/services/category';

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
