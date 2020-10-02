import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import Autocomplete from './shared/components/Autocomplete';
import Cities, { City } from './shared/components/Citites';
import { Alert, Col, Container } from 'react-bootstrap';
import { useAsynchronousTimeout } from './shared/hooks/useAsynchronousTimeout';
import { getCityGroupWeather, getSingleCityWeather } from './shared/api/openWeather';
import { getItemFromLS, setToLS } from './shared/services/localStorage';

const CITIES_LIST_KEY = 'cities_list_key';
const WEATHER_DATA_KEY = 'weather_data_key';

// @ts-ignore
const dataReloadDelay: number = process.env.REACT_APP_DATA_RELOAD_DELAY;

const getNames = (arr: Array<City>) => arr.map(item => item.name);

const setCitiesToLC = (cities: Array<City>) => {
  const citiesList = cities.map(({ name, id }) => ({ name, id }));
  const weatherData = cities.reduce((acc, city) => {
    return { ...acc, [city.id]: city };
  }, {});
  setToLS(CITIES_LIST_KEY, citiesList);
  setToLS(WEATHER_DATA_KEY, weatherData);
};

function App() {
  const [cities, setCities] = useState<Array<City>>([]);
  const [alertMessage, setAlertMessage] = useState('');

  const updateCitiesData = useCallback((newCitiesArr) => {
    setCitiesToLC(newCitiesArr);
    setCities(newCitiesArr);
  }, []);

  useAsynchronousTimeout(async () => {
    if (!cities.length) {
      return;
    }

    try {
      const citiesShape = cities.reduce((acc, { id, name }) => ({ ...acc, [id]: name }), {});
      const response = await getCityGroupWeather(Object.keys(citiesShape));
      const newData = await response.json();
      const newCitiesArr = newData.list.map((city: City) => ({
        ...city,
        // @ts-ignore
        name: citiesShape[city.id],
        updatedAt: new Date().toString()
      }));
      updateCitiesData(newCitiesArr);
    } catch (e) {
      setAlertMessage(e.toString());
    }
  }, dataReloadDelay, [cities, updateCitiesData]);

  useEffect(() => {
    const citiesList = getItemFromLS(CITIES_LIST_KEY, []);

    if (!cities.length && citiesList.length) {
      const weatherData = getItemFromLS(WEATHER_DATA_KEY, {});
      setCities(Object.values(weatherData));
    }
  }, [cities.length]);

  const addNewCity = useCallback(async (newCityName: string) => {
    if (!getNames(cities).includes(newCityName)) {
      try {
        const response = await getSingleCityWeather(newCityName.split(',')[0]);
        if (!response.ok) {
          return setAlertMessage(`${newCityName} ${response.statusText}`);
        }
        const data = await response.json();
        const newCitiesArr = [...cities, {
          ...data,
          updatedAt: new Date().toString(),
          name: newCityName,
        }];

        updateCitiesData(newCitiesArr);
        setAlertMessage('');
      } catch (e) {
        setAlertMessage(e.toString());
      }
    } else {
      setAlertMessage('This city is already tracked');
    }
  }, [cities, updateCitiesData]);

  const handleRemoveCity = (cityName: string) => {
    const newCitiesArr = cities.filter(({ name }) => name !== cityName);

    updateCitiesData(newCitiesArr);
  };

  return (
    <Container>
      <Col>
        <Autocomplete onSelect={addNewCity}/>
        <Alert show={!!alertMessage} variant="danger">
          {alertMessage}
        </Alert>
      </Col>
      <Col>
        <div>
          Selected cities:
        </div>
        <div>
          <Cities cities={cities} handleRemoveCity={handleRemoveCity}/>
        </div>
      </Col>
    </Container>
  );
}

export default App;
