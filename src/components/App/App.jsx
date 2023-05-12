import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchImages } from 'services/api';
import { Dna } from 'react-loader-spinner';
import css from './App.module.css';
import Searchbar from 'components/Searchbar';
import Button from 'components/Button';
import ImageGallery from 'components/ImageGallery';
import Modal from 'components/Modal';

export default function App() {
  const [searchData, setSearchData] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [largeImage, setLargeImage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!searchData.trim()) {
      setImages([]);
      return;
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchData, page]);

  async function fetchData() {
    try {
      setIsLoading(true);
      const data = await fetchImages(searchData, page);
      if (data.hits.length === 0) {
        setImages([]);
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
        setImages(prevImages => [...prevImages, ...newData]);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const onSubmit = newSearchData => {
    if (newSearchData.trim() === '') {
      setImages([]);
      return toast.error('Enter the meaning for search');
    } else if (newSearchData === searchData) {
      return;
    }

    setSearchData(newSearchData);
    setPage(1);
    setImages([]);
  };

  const nextPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  const openModal = index => {
    setShowModal(true);
    setLargeImage(images[index].largeImageURL);
  };

  const toggleModal = () => {
    setShowModal(prevshowModal => !prevshowModal);
  };

  return (
    <div className={css.app}>
      <Searchbar onSubmit={onSubmit} />
      {images.length !== 0 && (
        <ImageGallery images={images} openModal={openModal} />
      )}
      {showModal && <Modal toggleModal={toggleModal} largeImage={largeImage} />}
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
