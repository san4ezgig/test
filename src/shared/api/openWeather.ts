const weatherGetReq = (url: string) => {
  return fetch(`http://api.openweathermap.org/data/2.5/${url}&appid=${process.env.REACT_APP_OPENWEATHER_KEY}&units=metric`);
};

export const getSingleCityWeather = (cityName: string) => {
  return weatherGetReq(`weather?q=${cityName}`);
};

export const getCityGroupWeather = (citiesIds: Array<string>) => {
  return weatherGetReq(`group?id=${citiesIds.join(',')}`);
};
