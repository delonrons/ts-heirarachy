import React from 'react';

const Tab = ({ title, children}) => {

  return (
    <article {...{ 'data-ts':'Panel', 'data-ts.label': title}} >
      {children}
    </article>
  )
}

export default Tab;