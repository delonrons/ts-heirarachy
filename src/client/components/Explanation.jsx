import React from 'react';

const Explanation = ({ title, type='info', explanations = []}) => {

  return (
    <dl className={`ts-${type}`}>
      <dt>{title}</dt>

      { explanations.map((item, i) => <dd key={i}>{item}</dd>) }
    </dl>
  )
}

export default Explanation;