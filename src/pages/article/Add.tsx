import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Button, Input, Select } from 'antd';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import E from 'wangeditor';
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
  state = {
    editorContent: '',
  };

  editorElem: any = undefined;

  componentDidMount() {
    const elem = this.editorElem;
    const editor = new E(elem);
    // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
    editor.customConfig.onchange = (html: any) => {
      this.setState({
        editorContent: html,
      });
    };

    editor.create();
  }

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
                label: '缩略图',
              }}
              form={this.props.form}
            />
            <Form.Item label="内容详情">
              <div
                ref={e => {
                  this.editorElem = e;
                }}
                style={{ width: '100%' }}
              />
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
