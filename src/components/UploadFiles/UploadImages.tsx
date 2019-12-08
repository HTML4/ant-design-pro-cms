import React from 'react';
import { Upload, Icon, Modal } from 'antd';

// 图片弹窗
class ModalImg extends React.Component {
  previewVisible = true;

  // 关闭弹窗
  handleCancel() {
    const { id } = this.props;
    const ModalId = document.getElementById(id);
    this.setState({
      previewVisible: false,
    });
    if (ModalId) {
      // document.body.removeChild(ModalId.nextSibling);
      document.body.removeChild(ModalId);
    }
  }

  render() {
    const { previewVisible } = this.state;
    const { previewImage, name } = this.props;
    return (
      <Modal
        id="preview-img-modal"
        visible={previewVisible}
        footer={null}
        onCancel={() => this.handleCancel()}
      >
        <img title={name} alt={name} style={{ width: '100%' }} src={previewImage} />
      </Modal>
    );
  }
}

interface UploadImagesProps {
  disabled?: boolean;
  className?: string;
  fileList?: any[];
  label?: string;
  max: Number;
  accept: string;
  action: string;
  listType: string;
  multiple?: boolean;
  beforeUpload: any;
  data: object;
}
// 上传图片组件
export default class UploadImages extends React.Component<UploadImagesProps, {}> {
  state = {
    previewVisible: false,
    previewImage: '',
  };

  timeID = new Date().getTime();

  // componentDidMount() {
  // const that = this
  // this.updateTitle(this.props.fileList)
  // document.querySelector(`._${this.timeID}`).addEventListener("click", function(event) {
  //   const pics = [...document.querySelectorAll("div.ant-upload-list-item-info")],
  //         index = pics.indexOf(event.target), {fileList} = that.props
  //   if(pics.length && pics.some(el => el === event.target) && fileList && fileList.length > 0 && fileList[index].thumbUrl){
  //     const time = new Date().getTime()
  //     const div = document.createElement("div")
  //     div.id = time
  //     document.body.appendChild(div)
  //     ReactDom.render(<ModalImg id={time+'_modal'} previewImage={fileList[index].thumbUrl} name={fileList[index].name} />, document.getElementById(time))
  //   }
  // }, false)
  // }

  // componentWillReceiveProps(nextProps) {
  // const fileList = nextProps.fileList
  // this.updateTitle(fileList)
  // fileList && fileList.length && this.setState({fileList})
  // //bind active actions
  // const el = [...document.querySelectorAll('.ant-upload-list-item-actions')]
  // el.length && el.map( v => v.addEventListener('click', e => {
  //   const index = [...document.querySelectorAll('i.anticon.anticon-eye-o')].indexOf(e.target)
  //   nextProps.handleReupload(index)
  // }, false))
  // }

  onClickUpload() {
    const span = document.querySelector(`._${this.timeID} .ant-upload-select-picture-card span`);
    if (span) {
      span.click();
    }
  }

  handlePreview = (file: any) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  // handleChange = ({ fileList }: any) => this.setState({ fileList });

  // 修改编辑icon标题
  updateTitle(fileList: []) {
    if (fileList && fileList.length > 0) {
      const btn: any = [
        ...document.querySelectorAll(`._${this.timeID} .ant-upload-list-item-actions a`),
      ];
      setTimeout(() => {
        if (btn.length) {
          btn.forEach(el => {
            el.title = '重新选择';
          });
        }
      }, 300);
    }
  }

  render() {
    return (
      <div>
        <Upload
          onPreview={this.handlePreview}
          onRemove={() => !this.props.disabled}
          {...this.props}
          className={`uploadImg _${this.timeID} ${this.props.className}`}
        >
          {this.props.fileList && this.props.fileList.length >= this.props.max ? null : (
            <div className="uploadImgWrap">
              <Icon type="plus" />
              <div className="ant-upload-text f-mt5">{this.props.label}</div>
            </div>
          )}
        </Upload>
        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
        </Modal>
      </div>
    );
  }
}
