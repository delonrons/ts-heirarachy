import React from 'react';

const Modal = ({ title, children, id}) => {

  return (
    <dialog data-ts="Modal" {...{'data-ts.title': title, id}} className="ts-micro-modal">
      <div data-ts="Panel">
        <article data-ts="Box">
          {children}
        </article>
      </div>
    </dialog>
  )
}

export default Modal;