// import router from 'umi/router';
import Cookies from 'js-cookie';

// utils/model-extend.js
const enhanceClear = (urls: any[]) => {
  // const { reg, clearReducer } = param;
  // if (reg && clearReducer) {
  const clearWrapped = (subscriber: any) =>
    // 包装clearWrapped
    (props: any) => {
      const { dispatch, history } = props;
      history.listen(({ pathname }: any) => {
        const historyUrl: any = Cookies.get('historyUrl');
        console.log('historyUrl', historyUrl, urls);
        const clears: string[] = urls.filter(url => {
          const reg = new RegExp(url);
          return reg.test(historyUrl);
        });
        // 监听跳转前的动作
        // const isout = reg.test(history.getCurrentLocation().pathname) && !reg.test(pathname);
        // const isout = reg.test(pathname);
        if (clears && clears.length > 0) {
          dispatch({
            type: `${clears[0]}/clear`,
          });
        }
        Cookies.set('historyUrl', pathname);
      });
      subscriber({ ...props });
    };
  return (model: any) => {
    if (!model.subscriptions) {
      model.subscriptions = { setup() {} };
    }
    model.subscriptions.setup = clearWrapped(model.subscriptions.setup || (() => {}));
    return model;
  };
  // }
  // return (model: any) => model; // 若没有相应参数，则返回原数据函数
};

const enhanceItems = {
  enhanceClear,
};
export const enhanceModel = (param: any) => {
  const enhanceFuns: any[] = [];
  Object.keys(param).forEach(key => {
    if (enhanceItems[key]) {
      enhanceFuns.push(enhanceItems[key](param[key]));
    }
  });
  return (model: any) => {
    if (enhanceFuns.length === 0) return model;
    return enhanceFuns.reduce(
      (newModel, fun) => (typeof fun === 'function' ? fun(newModel) : newModel),
      model,
    );
  };
};
