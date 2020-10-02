import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import lodashDebounce from 'lodash.debounce';
import Autosuggest from 'react-autosuggest';
import './style.css';
import { getCityListByName } from '../../api/city';
import { Alert } from 'react-bootstrap';

const getSuggestionValue = (city: string) => city;
const renderSuggestion = (city: string) => <span>{city}</span>;

// @ts-ignore
const Autocomplete = ({ onSelect }) => {
  const [autocompleteItems, setAutocompleteItems] = useState([]);
  const [value, setValue] = useState('');
  const [alertMessage, setAllertMessage] = useState('');
  const onSuggestionsFetchRequested = useCallback(async ({ value }) => {
    if (value.length < 3) {
      return;
    }

    try {
      const response = await getCityListByName(value);
      const data = await response.json();
      const cities = data._embedded['city:search-results'].map((city: { matching_full_name: string; }) => city.matching_full_name);
      setAutocompleteItems(cities);
      setAllertMessage(cities.length ? '' : 'No result found');
    } catch (e) {
      setAllertMessage(e.toString());
    }

  }, []);
  const debouncedFetch = useMemo(() => lodashDebounce(onSuggestionsFetchRequested, 1000), [onSuggestionsFetchRequested]);
  const onSuggestionSelected = useCallback((_, { suggestion }) => {
    setValue('');
    onSelect(suggestion);
  }, [onSelect]);

  return (
    <div className="container">
      <Autosuggest
        suggestions={autocompleteItems}
        getSuggestionValue={getSuggestionValue}
        onSuggestionSelected={onSuggestionSelected}
        inputProps={{
          value,
          placeholder: 'Type city name',
          className: 'form-control',
          onChange: (_, { newValue }) => {
            setValue(newValue);
          },
        }}
        onSuggestionsFetchRequested={debouncedFetch}
        onSuggestionsClearRequested={() => setAutocompleteItems([])}
        renderSuggestion={renderSuggestion}
      />
      <Alert show={!!alertMessage} variant="warning">
        {alertMessage}
      </Alert>
    </div>
  );
};

Autocomplete.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default Autocomplete;
