import React from 'react';
import BestDealsEntity from './BestDealsEntity.jsx';
import getBestOrRestDeals from '../lib/getBestOrRestDeals.js';
import styled from 'styled-components';

const BestDeals = ({ currentHotel, userDates }) => {
  if (currentHotel.length === 0 || !currentHotel) {
    return (<div>Loading...</div>);
  } else {
    let best = getBestOrRestDeals(currentHotel, 'getBest');
    return (
      <Div>
        {best.map((item, i)=>(
          <BestDealsEntity
            item={item}
            key={i}
            userDates={userDates}
          />
        ))}
      </Div>
    );
  }
};

const Div = styled.div`
  cursor: pointer;
  color: #000;
  position: relative;
  border-width: 0 0 1px;
  font-family: 'Poppins', sans-serif;
  padding-top: 10px;
`;

export default BestDeals;