/**
 * 栏目状态
 */
export const CATEGORY_STATUS = {
  OPEN: 1,
  CLOSE: 2,
  DELETE: 3,
};
/**
 * 文章状态
 */
export const ARTICLE_STATUS = {
  0: '待审核',
  1: '启用',
  2: '关闭',
};

/**
 * 内容模型
 */
export const CONTENT_MODEL_STATUS = {
  ARTICLE: 0,
  PAGE: 1,
  IMAGES: 2,
  MESSAGE: 3,
  JOB: 4,
};
export const CONTENT_MODEL = {
  [CONTENT_MODEL_STATUS.ARTICLE]: '文章模型',
  [CONTENT_MODEL_STATUS.PAGE]: '单页模型',
  [CONTENT_MODEL_STATUS.IMAGES]: '图集模型',
  [CONTENT_MODEL_STATUS.MESSAGE]: '留言模型',
  [CONTENT_MODEL_STATUS.JOB]: '招聘模型',
};
