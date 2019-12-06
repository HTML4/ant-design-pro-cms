import React, { Component } from 'react';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import Link from 'umi/link';
import { Card, Tree, Table, Button } from 'antd';
import { CategoryDetail } from '@/data/category';
import { commonTree } from '@/utils/common';
import styles from './index.less';

const { TreeNode } = Tree;

interface indexProps {
  categoryList: CategoryDetail[];
  listLoading: boolean;
  dispatch: Dispatch<AnyAction>;
}

interface IndexState {
  isHideCategory: boolean;
}

class index extends Component<indexProps, IndexState> {
  state: IndexState = {
    isHideCategory: false,
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'category/getCategoryList',
    });
    this.getArticleList();
  }

  onSelectTree(key, event) {
    console.log(key, event);
  }

  getArticleList() {
    this.props.dispatch({
      type: 'article/getArticleList',
    });
  }

  render() {
    const { isHideCategory } = this.state;
    const { categoryList } = this.props;
    const treeData = (categoryList || []).map(c => commonTree({ data: c }));

    const TableProps = {
      className: 'f-mt10',
      columns: [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Age',
          dataIndex: 'age',
          key: 'age',
          width: '12%',
        },
        {
          title: 'Address',
          dataIndex: 'address',
          width: '30%',
          key: 'address',
        },
      ],
      dataSource: [
        {
          key: 1,
          name: 'John Brown sr.',
          age: 60,
          address: 'New York No. 1 Lake Park',
        },
        {
          key: 2,
          name: 'Joe Black',
          age: 32,
          address: 'Sidney No. 1 Lake Park',
        },
      ],
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
                onSelect={(key, info) => this.onSelectTree(key, event)}
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
                <Link to="/article/add?page=add">添加文章</Link>
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
