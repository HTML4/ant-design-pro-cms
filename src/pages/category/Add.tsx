import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Button, Input, Switch } from 'antd';
import { Dispatch, AnyAction } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';

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
}

class Add extends Component<addProps, {}> {
  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const payload = {
          ...values,
          status: values.status ? 2 : 1,
        };
        this.props.dispatch({
          type: 'category/addUpdateCategory',
          payload,
        });
      }
    });
  };

  render() {
    const { form, loading } = this.props;
    return (
      <PageHeaderWrapper>
        <Card>
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="栏目名称">
              {form.getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '栏目名称不能为空!',
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="隐藏栏目">
              {form.getFieldDecorator('status', {
                valuePropName: 'checked',
                initialValue: false,
              })(<Switch checkedChildren="是" unCheckedChildren="否" />)}
            </Form.Item>
            <Form.Item wrapperCol={{ span: 12, offset: 4 }}>
              <Button type="primary" htmlType="submit" loading={loading}>
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

export default connect(({ loading }: ConnectState) => ({
  loading: loading.effects['category/addUpdateCategory'],
  // loading: loading.models.user,
}))(AddForm);
