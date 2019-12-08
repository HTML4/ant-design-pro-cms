import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Button, Input, Select } from 'antd';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
import { ConnectState } from '@/models/connect';
import UploadFiles from '@/components/UploadFiles';
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
}
class Add extends Component<addProps, {}> {
  render() {
    const { form } = this.props;
    return (
      <PageHeaderWrapper>
        <Card>
          <Form {...formItemLayout}>
            <Form.Item label="标题">
              {form.getFieldDecorator('name', {
                initialValue: undefined,
                rules: [
                  {
                    required: true,
                    message: '标题不能为空!',
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="所属栏目">
              {form.getFieldDecorator('category', {
                initialValue: undefined,
                rules: [
                  {
                    required: true,
                    message: '标题不能为空!',
                  },
                ],
              })(<Select />)}
            </Form.Item>
            <UploadFiles
              size="default"
              formKey="uploadFile"
              listType="picture-card"
              formItemProps={{
                label: '附件',
              }}
              form={this.props.form}
            />
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
