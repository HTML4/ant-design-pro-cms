import { Effect } from 'dva';
import { Reducer } from 'redux';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { getArticleList, addUpdateArticle } from '@/services/article';
import { ArticleDetail } from '@/data/article';

export interface ArticleModelState {
  articleList?: ArticleDetail[];
}

export interface ArticleModelType {
  namespace: string;
  state: ArticleModelState;
  effects: {
    getArticleList: Effect;
    addUpdateArticle: Effect;
  };
  reducers: {
    saveArticleList: Reducer<ArticleModelState>;
    clear: Reducer<ArticleModelState>;
  };
}

const ArticleModel: ArticleModelType = {
  namespace: 'article',
  state: {
    articleList: [],
  },

  effects: {
    *getArticleList(_, { call, put }) {
      const response = yield call(getArticleList);
      yield put({
        type: 'saveArticleList',
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
  },

  reducers: {
    saveArticleList(state, action) {
      return {
        ...state,
        articleList: (action.payload && action.payload.data) || [],
      };
    },
    clear(state) {
      return {
        ...state,
      };
    },
  },
};

export default ArticleModel;
