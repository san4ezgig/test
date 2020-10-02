export const setToLS = (name: string, data: any) => {
  window.localStorage.setItem(name, JSON.stringify(data));
};

export const getItemFromLS = (name: string, defaultData?: any) => {
  const data = window.localStorage.getItem(name) || '';

  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultData;
  }
};
