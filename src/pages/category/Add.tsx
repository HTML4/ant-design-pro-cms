import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Button, Input, Switch, Select } from 'antd';
import { Dispatch, AnyAction } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { CategoryDetail } from '@/data/category';
import { CATEGORY_STATUS, CONTENT_MODEL } from '@/utils/Const';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

interface addProps {
  form: FormComponentProps['form'];
  loading: boolean;
  dispatch: Dispatch<AnyAction>;
  location: {
    query: {
      id: string;
      page?: 'edit' | 'addChildren';
    };
  };
  categoryDetail: CategoryDetail;
}

class Add extends Component<addProps, {}> {
  componentDidMount() {
    const { location, dispatch } = this.props;
    if (location.query && location.query.id) {
      dispatch({
        type: 'category/getCategoryDetail',
        payload: {
          id: location.query.id,
        },
      });
    }
  }

  handleSubmit = (e: any) => {
    e.preventDefault();
    const { form, dispatch, location } = this.props;
    const { page, id } = location.query;
    const isAddChildren = page === 'addChildren';
    form.validateFields((err, values) => {
      if (!err) {
        const payload = {
          ...values,
          status: values.status ? CATEGORY_STATUS.CLOSE : CATEGORY_STATUS.OPEN,
          id: isAddChildren ? undefined : id,
          parentId: isAddChildren ? id : undefined,
        };
        dispatch({
          type: 'category/addUpdateCategory',
          payload,
          page,
        });
      }
    });
  };

  render() {
    const { form, loading, categoryDetail, location } = this.props;
    const { query } = location;
    const isEdit = query.page === 'edit';
    const isAddChildren = query.page === 'addChildren';
    let title;
    if (isAddChildren) {
      title = '增加子栏目';
    } else if (isEdit) {
      title = '编辑栏目';
    }
    return (
      <PageHeaderWrapper title={title}>
        <Card>
          <Form {...formItemLayout}>
            <Form.Item label="栏目名称">
              {form.getFieldDecorator('name', {
                initialValue: isEdit && categoryDetail ? categoryDetail.name : undefined,
                rules: [
                  {
                    required: true,
                    message: '栏目名称不能为空!',
                  },
                ],
              })(<Input />)}
            </Form.Item>
            {categoryDetail ? (
              <Form.Item label="所属栏目">
                {categoryDetail && categoryDetail.parentId === 0 && isEdit
                  ? '顶级栏目'
                  : categoryDetail && categoryDetail.name}
              </Form.Item>
            ) : null}

            <Form.Item label="内容模型">
              {form.getFieldDecorator('contentModel', {
                initialValue: categoryDetail && String(categoryDetail.contentModel),
                rules: [
                  {
                    required: true,
                    message: '内容模型不能为空!',
                  },
                ],
              })(
                <Select style={{ width: 100 }}>
                  {Object.keys(CONTENT_MODEL).map(key => (
                    <Select.Option value={key} key={key}>
                      {CONTENT_MODEL[key]}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>

            <Form.Item label="隐藏栏目">
              {form.getFieldDecorator('status', {
                valuePropName: 'checked',
                initialValue: false,
              })(<Switch checkedChildren="是" unCheckedChildren="否" />)}
            </Form.Item>
            <Form.Item wrapperCol={{ span: 12, offset: 4 }}>
              <Button type="primary" onClick={this.handleSubmit} loading={loading}>
                提交
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

const AddForm = Form.create({ name: 'add' })(Add);

export default connect(({ loading, category }: ConnectState) => ({
  loading: loading.effects['category/addUpdateCategory'],
  categoryDetail: category.categoryDetail,
}))(AddForm);
