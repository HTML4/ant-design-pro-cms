import React, { Component } from 'react';
import { Card, Tree, Table } from 'antd';
import styles from './index.less';

const { TreeNode } = Tree;

interface IndexState {
  isHideCategory: boolean;
}

class index extends Component<{}, IndexState> {
  state: IndexState = {
    isHideCategory: false,
  };

  render() {
    const { isHideCategory } = this.state;
    const TableProps = {
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
            <Tree showLine defaultExpandedKeys={['0-0-0']}>
              <TreeNode title="parent 1" key="0-0">
                <TreeNode title="parent 1-0" key="0-0-0">
                  <TreeNode title="leaf" key="0-0-0-0" />
                  <TreeNode title="leaf" key="0-0-0-1" />
                  <TreeNode title="leaf" key="0-0-0-2" />
                </TreeNode>
                <TreeNode title="parent 1-1" key="0-0-1">
                  <TreeNode title="leaf" key="0-0-1-0" />
                </TreeNode>
                <TreeNode title="parent 1-2" key="0-0-2">
                  <TreeNode title="leaf" key="0-0-2-0" />
                  <TreeNode title="leaf" key="0-0-2-1" />
                </TreeNode>
              </TreeNode>
            </Tree>
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
          <Table {...TableProps} />
        </div>
      </Card>
    );
  }
}
export default index;
