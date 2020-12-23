import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const BestDealsEntity = ({ item, userDates }) => {
  const chooseLogo = (item) => {
    const links = {
      'Hotels.com': 'https://static.tacdn.com/img2/branding/hotels/Hotelscom_384x164.png',
      'Booking.com': 'https://static.tacdn.com/img2/branding/hotels/booking logo.png',
      'Expedia.com': 'https://static.tacdn.com/img2/branding/hotels/expediaib_new_384164.png',
      'Snaptravel': 'https://static.tacdn.com/img2/branding/hotels/Snaptravel_384x164.png',
      'Orbitz.com': 'https://static.tacdn.com/img2/branding/hotels/orbitzews_384164.png',
      'Tripadvisor': 'https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary.svg',
      'Priceline': 'https://static.tacdn.com/img2/branding/hotels/pcln-logo-384x164.png',
      'eDreams': 'https://static.tacdn.com/img2/branding/hotels/ed_16852.png',
      'Zenhotels': 'https://static.tacdn.com/img2/branding/hotels/zenlogo.png',
      'Prestigia': 'https://static.tacdn.com/img2/branding/hotels/logo-prestigia-size-384-164.png'
    };
    return (
      <LogoPicture src={links[item.serviceName]}></LogoPicture>
    );
  };

  const calcFreeCancel = ({ checkIn }) => {
    let result = 'Free cancellation ';
    if (checkIn) result += 'until ' + moment(checkIn).subtract(2, 'days').format('MM/DD/YY');
    return result;
  };

  return (
    <Div>
      <HeadDiv>
        <LogoDiv>{chooseLogo(item)}</LogoDiv>
        <PriceDiv><Quote>${item.price}</Quote></PriceDiv>
        <Button>
          <ButtonDiv><ButtonDivSpan>View Deal</ButtonDivSpan></ButtonDiv>
        </Button>
      </HeadDiv>
      <BottomDiv>
        <CancelDiv>
          <FontAwesomeIcon icon={faCheck}/>
          <CancelTextSpan type="fat">{calcFreeCancel(userDates)}</CancelTextSpan>
        </CancelDiv>
        <CancelDiv>
          <FontAwesomeIcon icon={faCheck}/>
          <CancelTextSpan type="slim">Reserve now, pay at stay</CancelTextSpan>
        </CancelDiv>
      </BottomDiv>
    </Div>
  );
};

const ButtonDiv = styled.div`
  display: block;
  min-height: 42px;
  border-radius: 12px;
  border-color: #f2b203;
  background-color: #f2b203;
  color: #000;
  font-family: 'Poppins', sans-serif;
`;

const Div = styled.div`
  &:hover  {
    color: #000a12;
    text-decoration: none;
    background: #f9f9f9;
    box-shadow:0 3px 2px -2px hsla(0,0%,60%,.4);
    ${ButtonDiv}{
      border-color: #fee190;
      background-color: #fee190;
    }
  }
  color: white;
  cursor: pointer;
  color: #000;
  position: relative;
  border: solid #e0e0e0;
  border-width: 0 0 1px;
  padding: 10px 0;
`;

const HeadDiv = styled.div`
  display:flex;
  margin-left: 0;
  margin-right: 0;
`;

const LogoDiv = styled.div`
  color: #4a4a4a;
  font-weight: 700;
  height: 45px;
  -webkit-align-self: stretch;
  -ms-flex-item-align: stretch;
  align-self: stretch;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  width: 33.33333333%;
`;

const LogoPicture = styled.img`
  width: 103px;
  height: 44px;
`;

const PriceDiv = styled.div`
  color: black;
  width: 33.33333333%;
`;

const PriceInnerDiv = styled.div`
  width: 33.33333333%;
`;

const Quote = styled.div`
  font-size: 24px;
  font-weight: 400;
  line-height: normal;
  text-align: right;
  padding-top:5px;
  padding-right: 5px;
`;

const Button = styled.div`
  width: 33.33333333%;
  flex:none;
`;

const ButtonDivSpan = styled.span`
  display: block;
  padding: 10px 22px;
  font-size: 15px;
  line-height: 20px;
`;

const BottomDiv = styled.div`
  display: block;
`;

const CancelDiv = styled.div`
  display: inline-block;
  margin-right: 8px;
  line-height: 12px;
  font-size: 12px;
  color: #4a4a4a;
  width: 100%;
`;

const CancelTextSpan = styled.span`
${props => {
    if (props.type === 'fat') {
      return 'font-weight:700;font-size: 14px;';
    } else {
      return 'font-weight:400;font-size: 12px;';
    }
  }}
  line-height: 12px;
  padding-left: 5px;
`;

export default BestDealsEntity;
