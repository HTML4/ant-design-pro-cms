import React, { Component } from 'react';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import Link from 'umi/link';
import { Card, Tree, Table, Button } from 'antd';
import { CategoryDetail } from '@/data/category';
import { ArticleList } from '@/data/article';
import { commonTree } from '@/utils/common';
import { displayDate } from '@/utils/time';
import { ARTICLE_STATUS } from '@/utils/Const';
import { getListParams } from '@/services/article';
import styles from './index.less';

const { TreeNode } = Tree;

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
}

class index extends Component<indexProps, IndexState> {
  state: IndexState = {
    isHideCategory: false,
    checkedCategoryId: undefined,
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'category/getCategoryList',
    });
    this.getArticleList();
  }

  onSelectTree(key: string[]) {
    this.setState({
      checkedCategoryId: key[0],
    });
    this.getArticleList({
      categoryId: Number(key[0]) || undefined,
    });
  }

  getArticleList(payload?: getListParams) {
    this.props.dispatch({
      type: 'article/getArticleList',
      payload,
    });
  }

  render() {
    const { isHideCategory, checkedCategoryId } = this.state;
    const { categoryList, articleList, articleLoading } = this.props;
    const treeData = (categoryList || []).map(c => commonTree({ data: c }));

    const TableProps = {
      className: 'f-mt10',
      rowKey: (row: any) => row.id,
      loading: articleLoading,
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
          render: (data: string, row: any) => (
            <div className="btnGroup">
              <Button size="small">
                <Link to={`/article/add?id=${row.id}&page=edit`}>编辑</Link>
              </Button>
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
                onSelect={key => this.onSelectTree(key)}
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
          </div>

          <Table {...TableProps} />
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
