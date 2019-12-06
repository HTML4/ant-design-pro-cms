import { Effect } from 'dva';
import { Reducer } from 'redux';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { getArticleList } from '@/services/article';
import { ArticleDetail } from '@/data/article';

export interface ArticleModelState {
  articleList?: ArticleDetail[];
}

export interface ArticleModelType {
  namespace: string;
  state: ArticleModelState;
  effects: {
    getArticleList: Effect;
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
