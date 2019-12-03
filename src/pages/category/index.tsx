import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Table, Button, Switch } from 'antd';
import { Dispatch, AnyAction } from 'redux';
import Link from 'umi/link';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { CategoryModelState } from '@/models/category';
import { CATEGORY_STATUS } from '@/utils/Const';

interface indexProps {
  category: CategoryModelState;
  listLoading: boolean;
  dispatch: Dispatch<AnyAction>;
}

class index extends Component<indexProps, {}> {
  componentDidMount() {
    this.getCategoryList();
  }

  getCategoryList() {
    this.props.dispatch({
      type: 'category/getCategoryList',
    });
  }

  statusChange(id: Number, checked: boolean) {
    this.props.dispatch({
      type: 'category/addUpdateCategory',
      payload: {
        id,
        status: checked ? CATEGORY_STATUS.OPEN : CATEGORY_STATUS.CLOSE,
      },
      callback: this.getCategoryList.bind(this),
    });
  }

  render() {
    const { category, listLoading } = this.props;
    const TableProps = {
      className: 'f-mt20',
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
          align: 'center',
          render: (data: Number, row: any) => (
            <Switch
              checkedChildren="启用"
              unCheckedChildren="关闭"
              defaultChecked={data === CATEGORY_STATUS.OPEN}
              onChange={checked => this.statusChange(row.id, checked)}
            />
          ),
        },
        {
          title: '操作',
          dataIndex: 'operate',
          render: (data: string, row: any) => (
            <div className="btnGroup">
              <Button size="small">
                <Link to={`/category/add?id=${row.id}&page=edit`}>编辑</Link>
              </Button>
              <Button size="small">
                <Link to={`/category/add?id=${row.id}&page=addChildren`}>增加子栏目</Link>
              </Button>
            </div>
          ),
        },
      ],
      dataSource: (category && category.categoryList) || [],
      pagination: {
        hideOnSinglePage: true,
        pageSize: 100,
      },
      rowKey: (row: any) => row.id,
      loading: listLoading,
    }; // const TableProps = {
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
          <div className="f-tar">
            <Button type="primary">
              <Link to="/category/add?page=add">增加顶级栏目</Link>
            </Button>
          </div>
          <Table {...TableProps} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ category, loading }: ConnectState) => ({
  category,
  listLoading: loading.models.category, // loading: loading.models.user,
}))(index);
