export const commonTree = function commonTree({ data, keys }: any) {
  const newTreeData: any = {
    key: (keys && data[keys.key]) || data.id,
    title: (keys && data[keys.label]) || data.name,
    value: (keys && data[keys.value]) || data.id,
  };
  if (data.children) {
    newTreeData.children = data.children.map((d: any) =>
      commonTree({
        data: d,
        keys,
      }),
    );
  }
  return newTreeData;
};
