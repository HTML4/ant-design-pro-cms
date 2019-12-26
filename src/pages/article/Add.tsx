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
import { ArticleDetail } from '@/data/article';

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
  dispatch: Dispatch<AnyAction>;
  location: {
    query: {
      id: string;
      page?: 'edit';
      categoryId?: string;
    };
  };
  loadingSub: boolean;
  loadingDetail: boolean;
  categoryList: CategoryDetail[];
  articleDetail: ArticleDetail;
}
class Add extends Component<addProps, {}> {
  state = {
    editorContent: '',
  };

  editorElem: any = undefined;

  editor: any = undefined;

  componentDidMount() {
    const { location, dispatch } = this.props;
    if (location.query && location.query.id) {
      dispatch({
        type: 'article/getArticleDetail',
        payload: {
          id: location.query.id,
        },
      });
    }

    this.getCategoryList();

    const elem = this.editorElem;
    this.editor = new E(elem);
    this.editor.customConfig.uploadImgServer = '/cms/common/upload_edit.do';
    this.editor.customConfig.uploadFileName = 'upload_file';
    // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
    this.editor.customConfig.onchange = (html: any) => {
      this.setState({
        editorContent: html,
      });
    };
    this.editor.create();
  }

  componentDidUpdate(preProps: addProps) {
    const { loadingDetail, articleDetail } = this.props;
    if (!loadingDetail && preProps.loadingDetail && articleDetail.id) {
      this.editor.txt.html(articleDetail.content);
    }
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
      const thumbnail = values.uploadFile ? values.uploadFile[0].subUrl : undefined;
      if (!err) {
        const payload = {
          ...values,
          uploadFile: undefined,
          id: isEdit ? id : undefined,
          content: this.state.editorContent,
          thumbnail,
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
    let arr: any = [];
    for (let i = 0; i < data.length; i++) {
      arr.push(
        <Select.Option value={data[i].id} key={data[i].id} label={data[i].name}>
          <span style={{ marginLeft: index * 15 }}>{data[i].name}</span>
        </Select.Option>,
      );
      if (data[i].children) {
        arr = arr.concat(this.renderCategory(data[i].children, index + 1));
      }
    }

    return arr;
  }

  render() {
    const { form, categoryList, loadingSub, articleDetail, location } = this.props;
    const { query } = location;
    const defaultFileList: any = [];
    if (articleDetail.thumbnail) {
      defaultFileList.push({
        tempDir: articleDetail.thumbnail,
        originFilename: articleDetail.thumbnail,
      });
    }

    return (
      <PageHeaderWrapper>
        <Card>
          <Form {...formItemLayout}>
            <Form.Item label="标题">
              {form.getFieldDecorator('title', {
                initialValue: articleDetail.title,
                rules: [
                  {
                    required: true,
                    message: '标题不能为空!',
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="描述">
              {form.getFieldDecorator('description', {
                initialValue: articleDetail.description,
                rules: [
                  {
                    required: true,
                    message: '描述不能为空!',
                  },
                ],
              })(<Input.TextArea />)}
            </Form.Item>
            <Form.Item label="所属栏目">
              {form.getFieldDecorator('categoryId', {
                initialValue: articleDetail.categoryId || Number(query.categoryId) || undefined,
                rules: [
                  {
                    required: true,
                    message: '栏目不能为空!',
                  },
                ],
              })(<Select optionLabelProp="label">{this.renderCategory(categoryList, 0)}</Select>)}
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
              defaultFileList={defaultFileList}
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
              <Button type="primary" onClick={this.handleSubmit} loading={loadingSub}>
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

export default connect(({ loading, category, article }: ConnectState) => ({
  loadingSub: loading.effects['article/addUpdateArticle'],
  loadingDetail: loading.effects['article/getArticleDetail'],
  categoryList: category.categoryList,
  articleDetail: article.articleDetail,
}))(AddForm);
