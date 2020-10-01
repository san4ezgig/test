import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import './style.css';
const getSuggestionValue = (city: string) => city;
const renderSuggestion = (city: string) => <span>{city}</span>;

// @ts-ignore
const Autocomplete = ({ onSelect }) => {
  const [autocompleteItems, setAutocompleteItems] = useState([]);
  const [value, setValue] = useState('');
  const onSuggestionsFetchRequested = useCallback(async ({value}) => {
    if (value.length < 3) {
      return;
    }

    const response = await fetch(`https://api.teleport.org/api/cities/?search=${value}&limit=6`);
    const data = await response.json();
    const cities = data._embedded['city:search-results'].map((city: { matching_full_name: string; }) => city.matching_full_name);
    setAutocompleteItems(cities);
  }, []);
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
          onChange: (_, { newValue }) => {
            setValue(newValue)
          },
        }}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={() => setAutocompleteItems([])}
        renderSuggestion={renderSuggestion}
      />
    </div>
  );
};

Autocomplete.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default Autocomplete;
