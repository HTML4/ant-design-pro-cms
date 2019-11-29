import { Effect } from 'dva';
import { Reducer } from 'redux';
import { routerRedux } from 'dva/router';
import { getCategoryList, addUpdateCategory, getCategoryDetail } from '@/services/category';
import { message } from 'antd';

interface CategoryState {
  id: Number;
  name: string;
  parentId: Number;
  status: Number;
  createTime: Date;
  children: any;
}

export interface CategoryModelState {
  categoryList?: Array<CategoryState>;
  categoryDetail?: CategoryState;
}

// export interface CategoryDetailModelState {
//   categoryDetail: {
//     code: Number;
//     data: CategoryState;
//   };
// }

export interface CategoryModelType {
  namespace: string;
  state: CategoryModelState;
  effects: {
    getCategoryList: Effect;
    addUpdateCategory: Effect;
    getCategoryDetail: Effect;
  };
  reducers: {
    saveCategoryList: Reducer<CategoryModelState>;
    saveCategoryDetail: Reducer<CategoryModelState>;
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
    *getCategoryDetail({ payload }, { call, put }) {
      const response = yield call(getCategoryDetail, payload);
      yield put({
        type: 'saveCategoryDetail',
        payload: response,
      });
    },
    *addUpdateCategory({ payload, callback }, { call, put }) {
      const response = yield call(addUpdateCategory, payload);
      let msg = {
        message: '添加失败！',
        status: 'error',
      };
      if (response.code === 0 && !callback) {
        yield put(routerRedux.replace('/category'));
        msg = {
          message: '添加成功！',
          status: 'success',
        };
      }
      if (callback) {
        callback();
        msg = {
          message: '修改成功！',
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
    saveCategoryDetail(state, action) {
      return {
        ...state,
        categoryDetail: (action.payload && action.payload.data) || [],
      };
    },
  },
};

export default CategoryModel;
