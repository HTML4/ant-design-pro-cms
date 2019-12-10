import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Button, Input, Select } from 'antd';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import E from 'wangeditor';
import { FormComponentProps } from 'antd/es/form';
import { ConnectState } from '@/models/connect';
import UploadFiles from '@/components/UploadFiles';
import { CategoryDetail } from '@/data/category';

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
      page?: 'edit';
    };
  };
  categoryList: CategoryDetail[];
}
class Add extends Component<addProps, {}> {
  state = {
    editorContent: '',
  };

  editorElem: any = undefined;

  componentDidMount() {
    this.getCategoryList();
    const elem = this.editorElem;
    const editor = new E(elem);
    editor.customConfig.uploadImgServer = '/cms/common/upload_edit.do';
    editor.customConfig.uploadFileName = 'upload_file';
    // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
    editor.customConfig.onchange = (html: any) => {
      this.setState({
        editorContent: html,
      });
    };
    editor.create();
  }

  getCategoryList() {
    this.props.dispatch({
      type: 'category/getCategoryList',
    });
  }

  handleSubmit = () => {
    const { form, dispatch, location } = this.props;
    const { page, id } = location.query;
    const isEdit = page === 'edit';
    form.validateFields((err, values) => {
      if (!err) {
        const payload = {
          ...values,
          id: isEdit ? id : undefined,
          content: this.state.editorContent,
        };
        dispatch({
          type: 'article/addUpdateArticle',
          payload,
          page,
        });
      }
    });
  };

  renderCategory(data: any, index: number) {
    const option = (
      <Select.Option value={data.id} key={data.id}>
        <span>{data.name}</span>
      </Select.Option>
    );
    if (data.children) {
      const childrenOption = data.children.map((d: any) => this.renderCategory(d, index + 1));
    }
    console.log('option', option);
    return option;
  }

  render() {
    const { form, categoryList } = this.props;

    return (
      <PageHeaderWrapper>
        <Card>
          <Form {...formItemLayout}>
            <Form.Item label="标题">
              {form.getFieldDecorator('title', {
                initialValue: undefined,
                rules: [
                  {
                    required: true,
                    message: '标题不能为空!',
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="描述">
              {form.getFieldDecorator('desc', {
                initialValue: undefined,
                rules: [
                  {
                    required: true,
                    message: '描述不能为空!',
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="所属栏目">
              {form.getFieldDecorator('categoryId', {
                initialValue: undefined,
                rules: [
                  {
                    required: true,
                    message: '栏目不能为空!',
                  },
                ],
              })(<Select>{categoryList.map(category => this.renderCategory(category, 0))}</Select>)}
            </Form.Item>
            <UploadFiles
              size="default"
              formKey="uploadFile"
              listType="picture-card"
              formItemProps={{
                label: '缩略图',
              }}
              form={this.props.form}
              maxFile={1}
            />
            <Form.Item label="内容详情">
              <div
                ref={e => {
                  this.editorElem = e;
                }}
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 12, offset: 4 }}>
              <Button type="primary" onClick={this.handleSubmit}>
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

export default connect(({ loading, article, category }: ConnectState) => ({
  loading: loading.effects['article/addUpdateArticle'],
  categoryList: category.categoryList,
  // categoryDetail: category.categoryDetail,
}))(AddForm);
