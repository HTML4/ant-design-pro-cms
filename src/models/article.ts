import { Effect } from 'dva';
import { Reducer } from 'redux';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  getArticleList,
  addUpdateArticle,
  getArticleDetail,
  deleteArticle,
} from '@/services/article';
import { ArticleDetail, ArticleList } from '@/data/article';

export interface ArticleModelState {
  articleList?: ArticleList | {};
  articleDetail?: ArticleDetail | object;
}

export interface ArticleModelType {
  namespace: string;
  state: ArticleModelState;
  effects: {
    getArticleList: Effect;
    addUpdateArticle: Effect;
    getArticleDetail: Effect;
  };
  reducers: {
    saveArticleList: Reducer<ArticleModelState>;
    saveArticleDetail: Reducer<ArticleModelState>;
    clear: Reducer<ArticleModelState>;
  };
}

export default {
  namespace: 'article',
  state: {
    articleList: {},
    articleDetail: {},
  },

  effects: {
    *getArticleList({ payload }, { call, put }) {
      const response = yield call(getArticleList, payload);
      yield put({
        type: 'saveArticleList',
        payload: response,
      });
    },
    *getArticleDetail({ payload }, { call, put }) {
      const response = yield call(getArticleDetail, payload);
      yield put({
        type: 'saveArticleDetail',
        payload: response,
      });
    },
    *addUpdateArticle({ payload, callback, page }, { call, put }) {
      const response = yield call(addUpdateArticle, payload);
      let msg = {
        message: '添加失败！',
        status: 'error',
      };
      if (response.code === 0) {
        if (payload.id) {
          msg = {
            message: '修改成功！',
            status: 'success',
          };
        } else {
          msg = {
            message: '添加成功！',
            status: 'success',
          };
        }
        if (page) {
          yield put(routerRedux.replace('/article'));
        }
        if (callback) {
          callback();
        }
      }
      message[msg.status](msg.message);
    },
    *deleteArticle({ payload, callback }, { call }) {
      const response = yield call(deleteArticle, payload);
      if (response.code === 0) {
        message.success('删除成功');
        if (callback) {
          callback();
        }
      }
    },
  },

  reducers: {
    saveArticleList(state, action) {
      return {
        ...state,
        articleList: (action.payload && action.payload.data) || {},
      };
    },
    saveArticleDetail(state, action) {
      return {
        ...state,
        articleDetail: (action.payload && action.payload.data) || [],
      };
    },
    clear(state) {
      return {
        ...state,
        articleDetail: {},
      };
    },
  },
};

// export default ArticleModel;
