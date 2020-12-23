import React from 'react';
import Children from './Children.jsx';
import styled from 'styled-components';
import { faMinus, faPlus, faBed, faUserFriends, faChild } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Guests extends React.Component {
  constructor () {
    super();
    this.state = {
      roomsNumber: 1,
      adultsNumber: 2,
      childrenNumber: 1
    };
    this.handleMinusClick = this.handleMinusClick.bind(this);
    this.handlePlusClick = this.handlePlusClick.bind(this);
    this.handleUpdateClick = this.handleUpdateClick.bind(this);
    this.renderIcon = this.renderIcon.bind(this);
  }

  handleMinusClick (event) {
    const id = event.currentTarget.dataset.id;
    if (id === '0' && this.state.roomsNumber) {
      this.setState({ roomsNumber: --this.state.roomsNumber });
    }
    if (id === '1' && this.state.adultsNumber) {
      this.setState({ adultsNumber: --this.state.adultsNumber });
    }
    if (id === '2' && this.state.childrenNumber) {
      this.setState({ childrenNumber: --this.state.childrenNumber });
    }
  }

  handlePlusClick (event) {
    const id = event.currentTarget.dataset.id;
    if (id === '0') this.setState({ roomsNumber: ++this.state.roomsNumber });
    if (id === '1') this.setState({ adultsNumber: ++this.state.adultsNumber });
    if (id === '2') this.setState({ childrenNumber: ++this.state.childrenNumber });
  }

  handleUpdateClick () {
    let guestsTotal = this.state.adultsNumber + this.state.childrenNumber;
    let config = ({
      'guestsNumber': guestsTotal,
      'roomsNumber': this.state.roomsNumber,
      'adultsNumber': this.state.adultsNumber,
      'childrenNumber': this.state.childrenNumber
    });
    this.props.getUpdatedData(config);
    this.props.updateGuestPickerInfo(config);
  }

  renderIcon (param) {
    if (param === 'roomsNumber') return <FontAwesomeIcon icon={faBed}></FontAwesomeIcon>;
    if (param === 'adultsNumber') return <FontAwesomeIcon icon={faUserFriends}></FontAwesomeIcon>;
    if (param === 'childrenNumber') return <FontAwesomeIcon icon={faChild}></FontAwesomeIcon>;
  }

  render () {
    let links = {
      'state': ['roomsNumber', 'adultsNumber', 'childrenNumber'],
      'labels': ['Rooms', 'Adults', 'Children']
    };
    const lines = [];
    for (let i = 0; i < 3; i++) {
      lines.push(
        <InnerLine key={i}>
          <InnerLineConfig>
            <Button data-id={i} onClick={this.handleMinusClick}>
              <ButtonSpan><FontAwesomeIcon icon={faMinus}></FontAwesomeIcon></ButtonSpan>
            </Button>
            <Field>{this.state[links.state[i]]}</Field>
            <Button data-id={i} onClick={this.handlePlusClick}>
              <ButtonSpan><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon></ButtonSpan>
            </Button>
          </InnerLineConfig>
          <Label>
            <Icon>{this.renderIcon(links.state[i])}</Icon>
            {links.labels[i]}
          </Label>
        </InnerLine>
      );
    }
    return (
      <Wrapper>
        <CloseButton onClick={this.props.changeGuestsView}></CloseButton>
        {lines}
        <Children childrenNumber={this.state.childrenNumber}/>
        <UpdateButtonDiv>
          <UpdateButton onClick={this.handleUpdateClick}>Update</UpdateButton>
        </UpdateButtonDiv>
      </Wrapper>
    );
  }
}

const CloseButton = styled.button`
  &:before {
      content: "x";
      font-size: 18px;
      line-height: 36px;
      color:#4a4a4a;
  }
  position: absolute;
  top: 6px;
  right: 6px;
  text-align: center;
  transition: opacity .2s;
  width: 36px;
  height: 36px;
  cursor: pointer;
  border: none;
  text-decoration: none;
  background: #fff;
  padding: 0;
`;

const Wrapper = styled.div`
  background-color: lightblue;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.1);
  box-sizing: border-box;
  border-radius: 2px;
  background-color: #fff;
  border-width: 1px;
  border-style: solid;
  border-color: #e0e0e0;
  font-family: 'Poppins', sans-serif;
  padding: 32px 16px 16px;
  font-size: 14px;
  min-width: 288px;
  min-heigth: 342px;
  position: absolute;
  z-index: 25;
  top: 50px;
  left:435px;
  max-height: auto;
`;

const InnerLine = styled.div`
  display: block;
  margin-top: 10px;
  min-height:38px;
`;

const InnerLineConfig = styled.div`
  width: 130px;
  float: right;
  display: flex;
  height: 36px;
  line-height: 36px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid #e0e0e0;
  border-radius: 2px;
`;

const Button = styled.button`
  background-color: #fff;
  cursor: default;
  min-width: 36px;
  min-height: 36px;
`;

const ButtonSpan = styled.span`
  color: #767676;
  background-color: #fff;
  cursor: default;
`;

const Field = styled.span`
  flex: 1 1 auto;
  display: inline-block;
  vertical-align: top;
  font-size: 1em;
  box-shadow: inset 0 3px 3px -3px rgba(0,0,0,.25);
`;

const Label = styled.div`
  display: block;
  font-size: 1em;
  font-weight: 700;
  padding-right: 16px;
  line-height: 36px;
`;

const Icon = styled.div`
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  font-size: 20px;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  speak: none;
  color:#2C2C2C;
  padding: 0px 16px 0px 0px;
`;

const UpdateButtonDiv = styled.div`
  display: block;
  margin-top: 16px;
  font-size: 14px
`;

const UpdateButton = styled.button`
  background-color: #000;
  border-color: #000;
  border-radius: 3px;
  width: 256px;
  height: 35px;
  color:#fff;
`;

export default Guests;