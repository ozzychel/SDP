import React from 'react';
import ReactDOM from 'react-dom';
import getBestOrRestDeals from '../lib/getBestOrRestDeals.js';
import styled from 'styled-components';
import { faCaretDown, faExternalLinkAlt, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class AllDeals extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isClicked: false,
      allDealsView: false,
      popUpVis: false
    };
    this.renderFour = this.renderFour.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.renderAllDealsBasics = this.renderAllDealsBasics.bind(this);
    this.renderPrice = this.renderPrice.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
  }

  renderFour (hotels) {
    const displaySix = [];
    if (hotels.length === 0) {
      return ( <div>Loading data...</div>);
    } else {
      let sorted = getBestOrRestDeals(hotels, 'getRest');
      for (var i = 0; i < sorted.length; i++) {
        displaySix.push(
          <EntityOuter key={i}>
            <EntityInner>
              <ServiceSpan>
                <NameSpan>{sorted[i].serviceName}</NameSpan>
                <IconSpan><FontAwesomeIcon icon={faExternalLinkAlt} size='xs'/></IconSpan>
              </ServiceSpan>
              <PriceSpan>${sorted[i].price}</PriceSpan>
            </EntityInner>
          </EntityOuter>
        );
      }
      return displaySix.slice(0, 4);
    }
  }

  renderPrice (price) {
    return price ? `$${price}` : <FontAwesomeIcon icon={faTimesCircle} size='sm' color='grey'/>;
  }

  togglePopup () {
    this.setState({ popUpVis: !this.state.popUpVis });
  }

  onClickHandler () {
    this.setState({ isClicked: !this.state.isClicked, allDealsView: !this.state.allDealsView });
  }

  renderPopupPortal (flag) {
    return flag ? ReactDOM.createPortal(
      <PopupWrapper>
        <PopupText>
        Prices are the average nightly price provided by our partners and may not include all taxes and fees. Taxes and fees that are shown are estimates only. Please see our partners for more details.
        </PopupText>
      </PopupWrapper>,
      document.getElementById('popup')) : null;
  }

  renderAll () {
    let hotels = this.props.currentHotel;
    if (hotels.length === 0 || !hotels) {
      return (<div>Loading...</div>);
    } else {
      let rates = [];
      for (var i = hotels[0].prices.length - 1; i >= 0; i--) {
        rates.push(
          <PortalLineDiv key={i}>
            <PortalLineInnerDiv>
              <PortalLineName>{hotels[0].prices[i].serviceName + ' '}</PortalLineName>
              <Icon><FontAwesomeIcon icon={faExternalLinkAlt} size='xs'/></Icon>
            </PortalLineInnerDiv>
            <PortalLinePrice>{this.renderPrice(hotels[0].prices[i].price)}</PortalLinePrice>
          </PortalLineDiv>
        );
      }
      return ReactDOM.createPortal(
        <PortalWrapper>
          <Portal><PortalLine>{rates}</PortalLine></Portal>
        </PortalWrapper>
        ,
        document.getElementById('viewAll'));
    }
  }

  renderAllDealsBasics () {
    return (
      <Wrapper>
        <MainDiv>{this.renderFour(this.props.currentHotel)}</MainDiv>
        <ViewAllWrapper onClick={this.onClickHandler}>
          <ViewAllDiv>View all 10 deals<FontAwesomeIcon icon={faCaretDown}/></ViewAllDiv>
        </ViewAllWrapper>
        <BottomDiv onMouseOver={this.togglePopup} onMouseOut={this.togglePopup}>
          Prices are the average nightly price provided by our partners and may not include all taxes and fees. Taxes and fees that are shown are estimates only. Please see our partners for more details.
        </BottomDiv>
      </Wrapper>
    );
  }

  renderAllDeals () {
    if (!this.state.allDealsView) {
      return (this.renderAllDealsBasics());
    }
    if (this.state.allDealsView) {
      return (
        <div>
          {this.renderAllDealsBasics()}
          {this.renderAll()}
        </div>
      );
    }
  }

  render () {
    return (
      <div>
        {this.renderAllDeals()}
        {this.renderPopupPortal(this.state.popUpVis)}
      </div>
    );
  }
}

const Wrapper = styled.div`
  margin-top: 8px;
  display: block;
  font-family: 'Poppins', sans-serif;
`;

const MainDiv = styled.div`
  display: flex;
  margin-left: -12px;
  margin-right: -12px;
  box-sizing: border-box;
  flex-wrap: wrap;
`;

const EntityOuter = styled.div`
  flex: none;
  width: 50%;
  padding: 2px 12px;
  box-sizing: border-box;
  min-height: 18px;
  max-height: 18px;
`;

const EntityInner = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  color: #4a4a4a;
  position: relative;
  overflow: hidden;
  min-height: 18px;
  line-height: 1.5em;
  cursor: pointer;
  font-size: 12px;
`;

const ServiceSpan = styled.span`
  padding-right: 3px;
  position: relative;
  display: flex;
  max-width: 100px;
  min-height: 18px;
`;

const NameSpan = styled.span`
  display: flex;
  color: #4a4a4a;
  position: relative;
  overflow: hidden;
  min-height: 18px;
  line-height: 1.5em;
  cursor: pointer;
  font-size: 12px;
`;

const IconSpan = styled.span`
&:before {
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
}
  display: flex;
  color: #4a4a4a;
  position: relative;
  overflow: hidden;
  min-height: 18px;
  line-height: 1.5em;
  cursor: pointer;
  font-size: 16px;
  padding-top:2px;
  padding-left:2px;
`;


const PriceSpan = styled.span`
  position: absolute;
  right: 0;
  padding-left: 3px;
  font-weight: 700;
  color: #000a12;
  min-height: 18px;
`;

const BottomDiv = styled.div`
  margin: 8px 0 12px;
  font-size: 13px;
  line-height: 17px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #767676;
  cursor: pointer;
`;

const ViewAllWrapper = styled.div`
  flex-shrink: 1;
  padding: 2px;
  box-sizing: border-box;
  flex-grow: 1;
  flex-basis: 0;
  -webkit-box-flex: 1;
  display: block;
`;

const ViewAllDiv = styled.div`
  color: #000a12;
  font-weight: 700;
  height: 18px;
  line-height: 1.5em;
  cursor: pointer;
  font-size: 12px;

`;

const PortalWrapper = styled.div`
  background-color: lightblue;
  width: 208px;
  height: auto;
  padding: 4px 16px 0;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.1);
  box-sizing: border-box;
  border-radius: 2px;
  background-color: #fff;
  border-width: 1px;
  border-style: solid;
  border-color: #e0e0e0;
  position: absolute;
  z-index: 25;
  top:450px;
  left: 150px;
`;

const Portal = styled.div`
  display: flex;
  flex-direction: column;
  width: 160px;
`;

const PortalLine = styled.div`
  color: #4a4a4a;
  position: relative;
  min-height: 18px;
  line-height: 1.5em;
  cursor: pointer;
  font-size: 12px;
  width: 100%;
  padding-top:10px;
`;

const PortalLineDiv = styled.div`
  width: 100%;
  display:flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 5px 0px;
  color: #4a4a4a;
  min-height: 18px;
  line-height: 1.5em;
  cursor: pointer;
  font-size: 12px;
`;

const PortalLineInnerDiv = styled.div`
  color: #4a4a4a;
`;

const PortalLineName = styled.span`
  padding-left:5px;
  color: #4a4a4a
`;

const PortalLinePrice = styled.span`
  font-weight:700;
  padding-left: 3px;
  color: #000a12;
  line-height: 1.5em;
  cursor: pointer;
  font-size: 12px;
`;

const Icon = styled.span`
  color: black;
`;

const PopupWrapper = styled.div`
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.1);
  box-sizing: border-box;
  border-radius: 2px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  position: absolute;
  z-index: 25;
  top: 380px;
  left: 420px;
  width: 300px;
  height: auto;
`;

const PopupText = styled.div`
  margin: 10px;
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  color: grey;
`;

export default AllDeals;