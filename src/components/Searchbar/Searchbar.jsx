import { Component } from 'react';
import css from './Searchbar.module.css';
import PropTypes from 'prop-types';

export default class Searchbar extends Component {
  state = {
    searchData: '',
  };

  handleChange = e => {
    this.setState({ searchData: e.target.value.toLowerCase() });
  };

  handleSubmit = e => {
    e.preventDefault();

    this.props.onSubmit(this.state.searchData);
    this.setState({ searchData: '' });
  };

  render() {
    return (
      <header className={css.searchbar}>
        <form className={css.searchform} onSubmit={this.handleSubmit}>
          <button type="submit" className={css.searchform__button}>
            <span className={css.searchform__button__label}>Search</span>
          </button>

          <input
            className={css.searchform__input}
            type="text"
            name="searchData"
            value={this.state.searchData}
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            onChange={this.handleChange}
          />
        </form>
      </header>
    );
  }
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
