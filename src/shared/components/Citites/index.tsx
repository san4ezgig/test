import React, { FunctionComponent, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardColumns, Container, Row } from 'react-bootstrap';
import { ReactComponent as CloseIcon } from './close.svg';
import './style.css';

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

const Cities: FunctionComponent<ICities> = ({ cities, handleRemoveCity }) => {
  const [records, setRecords] = useState<{
    maxTempCity: string,
    minTempCity: string,
  } | null>(null);

  useEffect(() => {
    if (cities.length) {
      setRecords(getCitiesWithMinAndMaxTemp(cities));
    }
  }, [cities]);

  return (
    <Container>
      {records && (
        <>
          <Row>
            City with maximum temperature - {records.maxTempCity}
          </Row>
          <Row>
            City with minimum temperature - {records.minTempCity}
          </Row>
        </>
      )}
      <CardColumns>
        {cities.map((city) => {
          const {
            name,
            main: { temp, humidity, pressure },
            wind: {
              deg,
              gust,
              speed,
            },
            updatedAt,
          } = city;

          return <Card key={city.name}>
            <CloseIcon className="icon" onClick={() => handleRemoveCity(name)}/>
            <Card.Body>
              <Card.Title>
                {name}
              </Card.Title>
              <Card.Text>
                Temperature-{temp}C, Humidity-{humidity}, Pressure-{pressure}, Wind: degree-{deg}, gust-{gust || 0},
                speed-{speed},
              </Card.Text>
              <Card.Footer>
                <small className="text-muted">Last updated {updatedAt}</small>
              </Card.Footer>
            </Card.Body>
          </Card>;
        })}
      </CardColumns>
    </Container>
  );
};

export interface City {
  name: string,
  id: number,
  main: {
    temp: number,
    humidity: number,
    pressure: number,
  },
  wind: {
    deg: number,
    gust: number,
    speed: number,
  },
  updatedAt: string,
}

interface ICities {
  cities: Array<City>,
  handleRemoveCity: (cityName: string) => void,
}

Cities.propTypes = {
  handleRemoveCity: PropTypes.func.isRequired,
};

export default Cities;
