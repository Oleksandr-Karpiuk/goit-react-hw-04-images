import { useEffect } from 'react';
import { useKeyPress } from 'react-use';
import css from './Modal.module.css';
import PropTypes from 'prop-types';

export default function Modal({ toggleModal, largeImage }) {
  const escPress = useKeyPress('Escape');

  useEffect(() => {
    escPress && toggleModal();
  }, [escPress, toggleModal]);

  /*
  Або може бути варіант без react-use з використанням обробника подій
   
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  const handleKeyDown = e => {
    e.code === 'Escape' && toggleModal();
  };
  */

  const handleBackdropClick = e => {
    e.target === e.currentTarget && toggleModal();
  };

  return (
    <div className={css.overlay} onClick={handleBackdropClick}>
      <div className={css.modal}>
        <img src={largeImage} alt="" />
      </div>
    </div>
  );
}

Modal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  largeImage: PropTypes.string.isRequired,
};
