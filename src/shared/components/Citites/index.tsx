import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import { Card, CardColumns, Container } from 'react-bootstrap';
import { ReactComponent as CloseIcon } from './close.svg';
import './style.css';
import Records from './Records';

const Cities: FunctionComponent<ICities> = ({ cities, handleRemoveCity }) => {
  return (
    <Container>
      <Records cities={cities} />
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
