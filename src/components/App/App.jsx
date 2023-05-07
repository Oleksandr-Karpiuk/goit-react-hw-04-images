import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchImages } from 'services/api';
import { Dna } from 'react-loader-spinner';
import css from './App.module.css';
import Searchbar from 'components/Searchbar';
import Button from 'components/Button';
import ImageGallery from 'components/ImageGallery';
import Modal from 'components/Modal';

export default class App extends Component {
  state = {
    searchData: '',
    images: [],
    page: 1,
    largeImage: '',
    showModal: false,
    isLoading: false,
  };

  async componentDidUpdate(prevProps, prevState) {
    const prevPage = prevState.page;
    const prevSearchData = prevState.searchData;
    const { searchData, page, images } = this.state;
    if (prevPage !== page || prevSearchData !== searchData) {
      try {
        this.setState({ isLoading: true });
        const data = await fetchImages(searchData, page);
        if (data.hits.length === 0) {
          this.setState({ images: [] });
          return toast.error('Nothing found');
        }

        const newData = data.hits.reduce(
          (acc, { id, webformatURL, largeImageURL }) => {
            if (images.filter(image => image.id === id).length === 0) {
              acc.push({ id, webformatURL, largeImageURL });
            }
            return acc;
          },
          []
        );

        if (newData.length > 0) {
          this.setState(({ images }) => ({
            images: [...images, ...newData],
          }));
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        this.setState({ isLoading: false });
      }
    }

    if (page > 1) {
      const CARD_HEIGHT = 260;
      window.scrollBy({
        top: CARD_HEIGHT * 2,
        behavior: 'smooth',
      });
    }
  }

  onSubmit = searchData => {
    if (searchData === this.state.searchData) {
      return;
    }
    this.setState({
      searchData: searchData,
      page: 1,
      images: [],
    });
  };

  nextPage = () => {
    this.setState(({ page }) => ({ page: page + 1 }));
  };

  openModal = index => {
    this.setState(({ images }) => ({
      showModal: true,
      largeImage: images[index].largeImageURL,
    }));
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({ showModal: !showModal }));
  };

  render() {
    const { toggleModal, openModal, nextPage, onSubmit } = this;
    const { images, isLoading, largeImage, showModal } = this.state;

    return (
      <div className={css.app}>
        <Searchbar onSubmit={onSubmit} />
        {images.length !== 0 && (
          <ImageGallery images={images} openModal={openModal} />
        )}
        {showModal && (
          <Modal toggleModal={toggleModal} largeImage={largeImage} />
        )}
        {isLoading && (
          <Dna
            visible={true}
            height="200"
            width="200"
            ariaLabel="dna-loading"
            wrapperStyle={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            wrapperClass="dna-wrapper"
          />
        )}
        <ToastContainer autoClose={2500} />
        {images.length >= 12 && <Button nextPage={nextPage} />}
      </div>
    );
  }
}
