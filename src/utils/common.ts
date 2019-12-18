export const commonTree = ({ data, keys }: any) => {
  const newTreeData: any = {
    key: keys && keys.key ? data[keys.key] : data.id,
    title: keys && keys.label ? data[keys.label] : data.name,
    value: keys && keys.value ? data[keys.value] : data.id,
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
