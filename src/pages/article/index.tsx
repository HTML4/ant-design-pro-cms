import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Tree, Table, Button, Popconfirm } from 'antd';
import { Dispatch, AnyAction } from 'redux';
import Link from 'umi/link';
import { ConnectState } from '@/models/connect';
import { CategoryDetail } from '@/data/category';
import { ArticleList } from '@/data/article';
import { commonTree } from '@/utils/common';
import { displayDate } from '@/utils/time';
import { ARTICLE_STATUS, CONTENT_MODEL_STATUS } from '@/utils/Const';
import { getListParams } from '@/services/article';
import SignlePage from './components/SignlePage';
import styles from './index.less';

interface indexProps {
  categoryList: CategoryDetail[];
  listLoading: boolean;
  dispatch: Dispatch<AnyAction>;
  articleList: ArticleList;
  articleLoading: boolean;
}

interface IndexState {
  isHideCategory: boolean;
  checkedCategoryId: string | undefined;
  selectContentModel: Number | undefined;
}

class index extends Component<indexProps, IndexState> {
  state: IndexState = {
    isHideCategory: false,
    checkedCategoryId: undefined,
    selectContentModel: undefined,
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'category/getCategoryList',
    });
    this.getArticleList();
  }

  onSelectTree(value: string[], info) {
    const checkedCategoryId = info.selectedNodes.length > 0 ? info.selectedNodes[0].key : null;
    const selectContentModel =
      info.selectedNodes.length > 0 ? info.selectedNodes[0].props.value : null;
    this.setState({
      checkedCategoryId,
      selectContentModel,
    });
    if (selectContentModel !== 1) {
      this.getArticleList({
        categoryId: Number(checkedCategoryId) || undefined,
      });
    }
  }

  onDelete(id) {
    const { dispatch, articleList } = this.props;
    dispatch({
      type: 'article/deleteArticle',
      payload: id,
      callback: () =>
        this.getArticleList({
          pageNum: articleList.pageNum,
        }),
    });
  }

  getArticleList(payload?: getListParams) {
    this.props.dispatch({
      type: 'article/getArticleList',
      payload,
    });
  }

  render() {
    const { isHideCategory, checkedCategoryId, selectContentModel } = this.state;
    const { categoryList, articleList, articleLoading } = this.props;
    const treeData = (categoryList || []).map(c =>
      commonTree({ data: c, keys: { value: 'contentModel' } }),
    );
    const TableProps = {
      className: 'f-mt10',
      rowKey: (row: any) => row.id,
      loading: articleLoading,
      pagination: {
        showQuickJumper: true,
        showTotal: total => `共 ${total} 条`,
        current: articleList && articleList.pageNum,
        total: articleList.total,
      },
      onChange: page => {
        this.getArticleList({
          pageNum: page.current,
        });
      },
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
        },
        {
          title: '标题',
          dataIndex: 'title',
        },
        {
          title: '所属栏目',
          dataIndex: 'categoryId',
        },
        {
          title: '审核',
          dataIndex: 'status',
          render: (text: number) => ARTICLE_STATUS[text],
        },
        {
          title: '浏览量',
          dataIndex: 'pageViews',
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          render: (text: string) => displayDate(text),
        },
        {
          title: '操作',
          render: (text: string, row: any) => (
            <div className="btnGroup f-wsn">
              <Button size="small">
                <Link to={`/article/add?id=${row.id}&page=edit`}>编辑</Link>
              </Button>
              <Popconfirm
                title="此操作不可恢复，确定删除？"
                placement="bottom"
                onConfirm={() => this.onDelete(row.id)}
              >
                <Button size="small">删除</Button>
              </Popconfirm>
            </div>
          ),
        },
        {
          title: '排序',
        },
      ],
      dataSource: articleList && articleList.list,
    };

    return (
      <Card className={styles.articleIndex}>
        {!isHideCategory ? (
          <div className={styles.leftMenu}>
            {treeData.length && (
              <Tree
                showLine
                treeData={treeData}
                defaultExpandAll
                onSelect={(key, info) => this.onSelectTree(key, info)}
              />
            )}
          </div>
        ) : null}
        <div className={styles.leftLine} style={isHideCategory ? { left: 0 } : {}}>
          <div
            className={styles.lineBlock}
            onClick={() =>
              this.setState(pre => ({
                isHideCategory: !pre.isHideCategory,
              }))
            }
            title={isHideCategory ? '打开' : '关闭'}
          />
        </div>
        <div className={styles.rightList} style={isHideCategory ? { left: 5 } : {}}>
          <div className="pageHeader f-mt20">
            <div className="title">
              <h3>内容管理</h3>
            </div>
            {CONTENT_MODEL_STATUS.PAGE !== selectContentModel ? (
              <div className="right">
                <Button type="primary" size="small">
                  <Link
                    to={`/article/add?page=add${
                      checkedCategoryId ? `&categoryId=${checkedCategoryId}` : ''
                    }`}
                  >
                    添加文章
                  </Link>
                </Button>
              </div>
            ) : null}
          </div>
          {CONTENT_MODEL_STATUS.PAGE === selectContentModel ? (
            <SignlePage categoryId={checkedCategoryId} />
          ) : (
            <Table {...TableProps} />
          )}
        </div>
      </Card>
    );
  }
}
export default connect(({ category, article, loading }: ConnectState) => ({
  categoryList: category.categoryList,
  categoryLoading: loading.models.category, // loading: loading.models.user,
  articleList: article.articleList,
  articleLoading: loading.models.article,
}))(index);
