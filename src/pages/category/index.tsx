import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Table } from 'antd';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { CategoryModelState } from '@/models/category';

interface indexProps {
  category: CategoryModelState;
  listLoading: boolean;
  dispatch: Dispatch<AnyAction>;
}

class index extends Component<indexProps, {}> {
  componentDidMount() {
    this.props.dispatch({
      type: 'category/getCategoryList',
    });
  }

  render() {
    const { category, listLoading } = this.props;
    const TableProps = {
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
        },
        {
          title: 'ID',
          dataIndex: 'id',
        },
        {
          title: '状态',
          dataIndex: 'status',
          render: (data: Number) => (data === 1 ? '启用' : '关闭'),
        },
      ],
      dataSource: (category && category.categoryList) || [],
      pagination: { hideOnSinglePage: true, pageSize: 100 },
      rowKey: (row: any) => row.id,
      loading: listLoading,
    };
    // const TableProps = {
    //   columns: [
    //     {
    //       title: 'Name',
    //       dataIndex: 'name',
    //       key: 'name',
    //     },
    //     {
    //       title: 'Age',
    //       dataIndex: 'age',
    //       key: 'age',
    //       width: '12%',
    //     },
    //     {
    //       title: 'Address',
    //       dataIndex: 'address',
    //       width: '30%',
    //       key: 'address',
    //     },
    //   ],
    //   dataSource: [
    //     {
    //       key: 1,
    //       name: 'John Brown sr.',
    //       age: 60,
    //       address: 'New York No. 1 Lake Park',
    //       children: [
    //         {
    //           key: 11,
    //           name: 'John Brown',
    //           age: 42,
    //           address: 'New York No. 2 Lake Park',
    //         },
    //       ],
    //     },

    //   ],
    // };

    return (
      <PageHeaderWrapper>
        <Card>
          <Table {...TableProps} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ category, loading }: ConnectState) => ({
  category,
  listLoading: loading.effects['category/getCategoryList'],
  // loading: loading.models.user,
}))(index);
