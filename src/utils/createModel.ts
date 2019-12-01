import router from 'umi/router';

// utils/model-extend.js
const enhanceClear = (param: any) => {
  const { reg, clearReducer } = param;
  if (reg && clearReducer) {
    const clearWrapped = (subscriber: any) => {
      // 包装clearWrapped
      return (props: any) => {
        const { dispatch, history } = props;
        console.log('props', props, history);
        history.listen((pathname: any) => {
          console.log('router', router);
          console.log('pathname', pathname);
          // 监听跳转前的动作
          // const isout = reg.test(history.getCurrentLocation().pathname) && !reg.test(pathname);
          const isout = reg.test(pathname);
          isout && dispatch(clearReducer);
        });
        subscriber({ ...props });
      };
    };
    return (model: any) => {
      if (!model.subscriptions) model.subscriptions = { setup() {} };
      model.subscriptions.setup = clearWrapped(model.subscriptions.setup || (() => {}));
      return model;
    };
  }
  return (model: any) => model; // 若没有相应参数，则返回原数据函数
};

const enhanceItems = {
  enhanceClear,
};
export const enhanceModel = (param: any) => {
  const enhanceFuns: any[] = [];
  Object.keys(param).forEach(key => {
    enhanceItems[key] && enhanceFuns.push(enhanceItems[key](param[key]));
  });
  return (model: any) => {
    if (enhanceFuns.length === 0) return model;
    return enhanceFuns.reduce((newModel, fun) => {
      return typeof fun === 'function' ? fun(newModel) : newModel;
    }, model);
  };
};
