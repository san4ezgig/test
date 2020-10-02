export const getCityListByName = (name: string) => {
  return fetch(`https://api.teleport.org/api/cities/?search=${name}&limit=6`);
};
