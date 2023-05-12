import { useState } from 'react';
import css from './Searchbar.module.css';
import PropTypes from 'prop-types';

export default function Searchbar({ onSubmit }) {
  const [searchData, setSearchData] = useState('');

  const handleChange = e => {
    setSearchData(e.target.value.toLowerCase());
  };

  const handleSubmit = e => {
    e.preventDefault();

    onSubmit(searchData);
    setSearchData('');
  };

  return (
    <header className={css.searchbar}>
      <form className={css.searchform} onSubmit={handleSubmit}>
        <button type="submit" className={css.searchform__button}>
          <span className={css.searchform__button__label}>Search</span>
        </button>

        <input
          className={css.searchform__input}
          type="text"
          name="searchData"
          value={searchData}
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          onChange={handleChange}
        />
      </form>
    </header>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
