import React, { Component } from 'react';
import { Upload, Button, Icon, Form } from 'antd';
import UploadImages from './UploadImages';

const FormItem = Form.Item;

export default class UploadFiles extends Component {
  uploadCount = 0;

  newFileList: any[] = null;

  // 上传附件
  onChangeUpload(e, maxFile) {
    if (Array.isArray(e)) {
      return e;
    }
    // max
    const serverUrl = config.api.imgServer;
    const fileList: any[] = [];
    if (e && e.file.status === 'removed') {
      this.uploadCount = this.uploadCount - 1;
    }
    if (e && e.file.status && e.fileList) {
      e.fileList.map(file => {
        if (maxFile === 1) {
          if (e.file.uid !== file.uid) {
            return;
          }
        }
        if (file.status === 'done' && file.response && file.response.data) {
          file.url = serverUrl + file.response.data.url;
          file.name = file.name;
          file.subId = file.response.data.id;
          file.subUrl = file.response.data.url;
        } else if (file.status === 'error') {
          file.response = '上传失败！';
          this.uploadCount = this.uploadCount - 1;
        }
        fileList.push(file);
      });
    }

    if (e && e.fileList && e.fileList.length >= 0 && e.fileList.length <= maxFile) {
      this.newFileList = fileList;
      return fileList;
    }
    return this.newFileList;
    // if(fileList && fileList.length > 0) {

    // } else if(this.newFileList) {
    //   return this.newFileList
    // }
  }

  //上传附件-限制文件的大小
  beforeUpload(file, form, formKey, fileType, maxSize, maxFile) {
    this.uploadCount = this.uploadCount + 1;
    let isType = true;
    if (fileType && file.type.indexOf(fileType) < 0) {
      isType = false;
      messageAlert({
        status: 'error',
        message: `只能上传 ${fileType} 格式的文件！`,
      });
    }
    let isMaxLength = true;
    if (this.uploadCount > maxFile) {
      this.uploadCount = this.uploadCount - 1;
      isMaxLength = false;
      messageAlert({
        status: 'error',
        message: `不能超过${maxFile}个文件!`,
      });
    }
    const isLt10M = file.size / 1024 / 1024 < maxSize;
    if (!isLt10M) {
      messageAlert({
        status: 'error',
        message: `请上传小于${maxSize}M的附件!`,
      });
    }
    return isMaxLength && isLt10M && isType;
  }

  render() {
    const {
      form,
      formItemProps = {},
      required = false,
      formKey = 'uploadfile',
      listType = 'text',
      size = 'small',
      maxFile = 10,
      multiple = true,
      disabled = false,
      uploadClass = '',
      actionsURL,
      fileType,
      accept,
      maxSize = 10,
    } = this.props;
    let { data, defaultFileList, message } = this.props;
    // 获取上传文件数目
    data = {
      filedir: 'contract',
      width: 640, // 默认缩略图宽高
      height: 640,
      ...data,
    };

    defaultFileList = (defaultFileList || []).map((file, index) => ({
      url: file.tempDir,
      name: file.originFilename,
      subUrl: file.tempDir,
      subId: file.fileId,
      uid: index,
      status: 'done',
    }));
    // init
    const formKeyValue = form.getFieldValue(formKey);
    this.uploadCount = formKeyValue ? formKeyValue.length : 0;
    this.newFileList = formKeyValue || [];
    return (
      <FormItem {...formItemProps}>
        {form.getFieldDecorator(formKey, {
          valuePropName: 'fileList',
          initialValue: defaultFileList,
          rules: required
            ? [
                {
                  required: true,
                  type: 'array',
                  message: message
                    ? message
                    : typeof required === 'string'
                    ? required
                    : `请上传${listType === 'text' ? '附件' : '图片'}`,
                },
              ]
            : [],
          getValueFromEvent: value => this.onChangeUpload(value, maxFile),
        })(
          // 附件类型为纯文件
          listType === 'text' ? (
            <Upload
              accept={accept || '*'}
              className={'uploadFiles f-cb' + uploadClass}
              disabled={disabled}
              action={actionsURL ? actionsURL : config.api.uploadFile}
              multiple={multiple}
              beforeUpload={file =>
                this.beforeUpload(file, form, formKey, fileType, maxSize, maxFile)
              }
              data={data}
            >
              <Button
                className="upload-btn f-mw80"
                style={{ fontSize: 14 }}
                type="dashed"
                size={size}
                disabled={disabled}
              >
                <Icon type="upload" /> 上传
              </Button>
            </Upload>
          ) : (
            // 附件类型为图片
            <UploadImages
              accept="image/*"
              disabled={disabled}
              action={actionsURL ? actionsURL : config.api.uploadFile}
              listType={listType}
              max={maxFile}
              multiple={multiple}
              beforeUpload={file =>
                this.beforeUpload(file, form, formKey, fileType, maxSize, maxFile)
              }
              data={data}
              handleReupload={i => (indexChange = i)}
            />
          ),
        )}
      </FormItem>
    );
  }
}
