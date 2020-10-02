import React, { FunctionComponent } from 'react';
import { Row } from 'react-bootstrap';
import { City } from '../index';

const getCitiesWithMinAndMaxTemp = (cities: Array<City>) => {
  const { name, main: { temp } } = cities[0];
  const newRecords = cities.reduce((acc, city) => {
    const { name: currName, main: { temp: currTemp } } = city;
    if (acc.maxTemp.temp < currTemp) {
      acc.maxTemp = {
        name: currName,
        temp: currTemp,
      };
    }

    if (acc.minTemp.temp > currTemp) {
      acc.minTemp = {
        name: currName,
        temp: currTemp,
      };
    }

    return acc;
  }, {
    maxTemp: {
      name,
      temp,
    },
    minTemp: {
      name,
      temp,
    }
  });

  return {
    maxTempCity: newRecords?.maxTemp?.name,
    minTempCity: newRecords?.minTemp?.name,
  };
};

const Records: FunctionComponent<ICity> = ({cities}) => {
  if (!cities.length) {
    return null;
  }

  const {maxTempCity, minTempCity} = getCitiesWithMinAndMaxTemp(cities);
  return (
    <>
      <Row>
        <b>City with maximum temperature</b> - {maxTempCity}
      </Row>
      <Row>
        <b>City with minimum temperature</b> - {minTempCity}
      </Row>
    </>
  );
};

interface ICity {
  cities: Array<City>,
}

Records.defaultProps = {
  cities: [],
};

export default Records;
