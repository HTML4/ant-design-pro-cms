import React, { Component } from 'react';
import { Button } from 'antd';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import E from 'wangeditor';
import { ArticleDetail } from '@/data/article';
import { ConnectState } from '@/models/connect';

interface SignlePageProps {
  dispatch: Dispatch<AnyAction>;
  categoryId: Number;
  articleDetail: ArticleDetail;
  loadingDetail: boolean;
  loadingSub: boolean;
}
class SignlePage extends Component<SignlePageProps, {}> {
  state = {
    editorContent: '',
  };

  editorElem: any = undefined;

  editor: any = undefined;

  componentDidMount() {
    this.getArticleDetail();
    const elem = this.editorElem;
    this.editor = new E(elem);
    this.editor.customConfig.uploadImgServer = '/cms/common/upload_edit.do';
    this.editor.customConfig.uploadFileName = 'upload_file';
    // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
    this.editor.customConfig.onchange = (html: any) => {
      this.setState({
        editorContent: html,
      });
    };
    this.editor.create();
  }

  componentDidUpdate(preProps: SignlePageProps) {
    const { loadingDetail, articleDetail, categoryId } = this.props;
    if (categoryId !== preProps.categoryId) {
      this.getArticleDetail();
    }
    if (!loadingDetail && preProps.loadingDetail) {
      this.editor.txt.html(articleDetail.content || '');
    }
  }

  getArticleDetail() {
    const { dispatch, categoryId } = this.props;
    dispatch({
      type: 'article/getArticleDetail',
      payload: {
        categoryId,
      },
    });
  }

  handleSubmit = () => {
    const { dispatch, articleDetail } = this.props;

    dispatch({
      type: 'article/addUpdateArticle',
      payload: {
        id: articleDetail.id,
        content: this.state.editorContent,
      },
    });
  };

  render() {
    return (
      <div>
        <div
          ref={e => {
            this.editorElem = e;
          }}
          style={{ width: '100%' }}
        />
        <Button
          className="f-mt20"
          type="primary"
          onClick={this.handleSubmit}
          loading={this.props.loadingSub}
        >
          提交
        </Button>
      </div>
    );
  }
}

export default connect(({ loading, article }: ConnectState) => ({
  loadingSub: loading.effects['article/addUpdateArticle'],
  loadingDetail: loading.effects['article/getArticleDetail'],
  articleDetail: article.articleDetail,
}))(SignlePage);
