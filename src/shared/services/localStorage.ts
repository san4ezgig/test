export const setToLS = (name: string, data: any) => {
  window.localStorage.setItem(name, JSON.stringify(data));
};

export const getItemFromLS = (name: string) => {
  const data = window.localStorage.getItem(name) || '';

  return JSON.parse(data);
};
