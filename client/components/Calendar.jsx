import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Calendar extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      now: moment(),
      currentMonth: moment(),
      selectedDate: moment(),
      nextMonth: moment().add(1, 'month'),
      checkIn: false,
      checkOut: false,
      clickCounter: 0,
      averageRate: ''
    };
    this.onDateClick = this.onDateClick.bind(this);
    this.nextMonth = this.nextMonth.bind(this);
    this.prevMonth = this.prevMonth.bind(this);
    this.checkState = this.checkState.bind(this);
  }

  renderNavbar () {
    const dateFormat = 'MMMM yyyy';
    return (
      <div className="navbar-container">
        <div className="col">
          <button type="button" onClick={this.prevMonth}>previous</button>
        </div>
        <div className="col">
          <span>{moment(this.state.currentMonth).format(dateFormat)}</span>
        </div>
        <div className="col">
          <span>{moment(this.state.nextMonth).format(dateFormat)}</span>
        </div>
        <div className="col">
          <button type="button" onClick={this.nextMonth}>next</button>
        </div>
      </div>
    );
  }

  renderWeekDays (term) {
    const dateFormat = 'ddd';
    const days = [];
    let startDate;
    term === this.state.currentMonth ? startDate = moment(this.state.currentMonth).startOf('week') : startDate = moment(this.state.nextMonth).startOf('week');
    for (var i = 0; i < 7; i++) {
      days.push(
        <WeekDay key={i}>{moment(startDate).add(i, 'days').format(dateFormat).toUpperCase()}</WeekDay>
      );
    }
    return days;
  }

  renderCells (term) {
    let currentMonth;
    if (term === this.state.currentMonth) currentMonth = this.state.currentMonth;
    else currentMonth = this.state.nextMonth;

    const selectedDate = this.state.selectedDate;
    const monthStart = moment(currentMonth).startOf('month');
    const monthEnd = moment(currentMonth).endOf('month');
    const startDate = moment(monthStart).startOf('week');
    const endDate = moment(monthEnd).endOf('week');
    const today = moment().startOf('day');
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day < endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = moment(day).format('D');
        const dayCopy = day;
        days.push(
          <div
            className={`cell${
              moment(day).isSame(moment(), 'day') ? '-today' :
                !moment(day).isSame(monthStart, 'month') ? '-disabled' :
                  moment(day).isBefore(today) ? '-inactive' :
                    this.state.checkIn && moment(day).isSame(this.state.checkIn, 'day') ? '-checkIn' :
                      this.state.checkOut && moment(day).isSame(this.state.checkOut, 'day') ? '-checkOut' : ''
            }`}
            key={day}
            onClick={ ()=>{ this.onDateClick(dayCopy); }}
          ><span className="number">{formattedDate}</span>
          </div>
        );
        day = moment(day).add(1, 'day');
      }
      rows.push(
        <CalendarRow key={day}>{days}</CalendarRow>
      );
      days = [];
    }
    return rows;
  }

  onDateClick (day) {
    if (!this.state.clickCounter) {
      this.setState({
        selectedDate: day,
        checkIn: day,
        clickCounter: 1
      }, () => { this.checkState(); });
    } else {
      if (!moment(day).isBefore(this.state.checkIn)) {
        this.setState({
          selectedDate: day,
          checkOut: day,
          clickCounter: 0
        }, () => { this.checkState(); });
      }
    }
  }

  checkState () {
    if (this.state.checkIn && this.state.checkOut) {
      const dates = {checkIn: moment(this.state.checkIn).format('YYYY-MM-DD'), checkOut: moment(this.state.checkOut).format('YYYY-MM-DD')};
      this.props.getUpdatedData(dates);
      this.setState({
        checkIn: false,
        checkOut: false
      });
    }
  }

  nextMonth () {
    this.setState({
      currentMonth: moment(this.state.currentMonth).add(1, 'month'),
      nextMonth: moment(this.state.nextMonth).add(1, 'month')
    });
  }

  prevMonth () {
    this.setState({
      currentMonth: moment(this.state.currentMonth).subtract(1, 'month'),
      nextMonth: moment(this.state.nextMonth).subtract(1, 'month')
    });
  }

  render () {
    return (
      <PortalWrapper>

        <Header>
          <HeaderTop>
            <HeaderTopText>Select a date to continue</HeaderTopText>
            <CloseButton onClick={this.props.changeCalendarView}></CloseButton>
          </HeaderTop>
          <Legend><LegendSpan></LegendSpan>Lowest priced dates</Legend>
        </Header>

        <CheckInContainer>
          <CheckInWrapper>

            <NavBar>
              <NavBarButton onClick={this.prevMonth}>
                <Icon><FontAwesomeIcon icon={faChevronLeft}/></Icon>
              </NavBarButton>
              <NavBarButton onClick={this.nextMonth}>
                <Icon><FontAwesomeIcon icon={faChevronRight}/></Icon>
              </NavBarButton>
            </NavBar>

            <Months>
              <MonthsDiv>
                <CalendarGrid>
                  <Caption>
                    <div>{moment(this.state.currentMonth).format('MMMM yyyy')}</div>
                  </Caption>
                  <Weekdays>
                    <WeekDaysRow>{this.renderWeekDays(this.state.currentMonth)}</WeekDaysRow>
                  </Weekdays>
                  <CalendarBody>{this.renderCells(this.state.currentMonth)}</CalendarBody>
                </CalendarGrid>


                <CalendarGrid>
                  <Caption>
                    <div>{moment(this.state.nextMonth).format('MMMM yyyy')}</div>
                  </Caption>
                  <Weekdays>
                    <WeekDaysRow>{this.renderWeekDays(this.state.nextMonth)}</WeekDaysRow>
                  </Weekdays>
                  <CalendarBody>{this.renderCells(this.state.nextMonth)}</CalendarBody>
                </CalendarGrid>

              </MonthsDiv>
            </Months>
          </CheckInWrapper>
        </CheckInContainer>

        <Average>
          <AverageSpan>Average daily rates: {this.props.calculateAvrgRate()}</AverageSpan>
          <AverageMsgSpan>{this.props.displayNotAvailableMsg()}</AverageMsgSpan>
        </Average>

      </PortalWrapper>
    );
  }
}

const PortalWrapper = styled.div`
  background-color: lightblue;
  width: 597px;
  height: 430px;
  padding: 4px 16px 0;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.1);
  min-height: 430px;
  box-sizing: border-box;
  border-radius: 2px;
  background-color: #fff;
  border-width: 1px;
  border-style: solid;
  border-color: #e0e0e0;
  position: relative;
  z-index: 25;
  font-family: 'Poppins', sans-serif;
  top: 5px;
  left:150px;
  position:absolute;
`;

const Header = styled.div`
  font-size: 15px;
  border: solid #e0e0e0;
  border-width: 0 0 1px;
  font-weight: 500;
  text-align: center;
`;

const HeaderTop = styled.div`
`;

const HeaderTopText = styled.span`
`;

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

const Legend = styled.div`
  padding-top: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #4a4a4a;
`;

const LegendSpan = styled.span`
  display: inline-block;
  width: 9px;
  height: 9px;
  border-radius: 2px;
  background: #f2b203;
`;

const Months = styled.div`
  white-space: nowrap;
  text-align: center;
`;

const CheckInContainer = styled.div`
  display: block;
  margin: 0;
  padding: 0;
`;

const CheckInWrapper = styled.div`
  position: relative;
  user-select: none;
`;

const NavBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  top: 0;
  padding: 5px 7px;
`;

const NavBarButton = styled.button`
  height: 36px;
  width: 36px;
  line-height: 36px;
  text-align: center;
  color: #4a4a4a;
  cursor: pointer;
  font-size: 20px;
  transition: color .3s;
  border: none;
  text-decoration: none;
  background: #fff;
  padding: 0;
  font-family: inherit;
`;

const Icon = styled.div`
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  font-size: inherit;
  line-height: 1;
  color:#4a4a4a
`;

const MonthsDiv = styled.div`
  white-space: nowrap;
  text-align: center;
  margin: 0;
  padding: 0;
  user-select: none;
`;

const CalendarGrid = styled.div`
  display: inline-block;
  padding: 0 16px;
  margin: 12px 0;
  vertical-align:text-top;
`;

const Caption = styled.div`
  display: block;
  height: 24px;
  line-height: 24px;
  text-align: center;
  margin-bottom: 4px;
  font-size: 15px;
  font-weight: 500;
`;

const Weekdays = styled.div`
  display: block;
`;

const CalendarBody = styled.div`
  display: block;
`;

const WeekDaysRow = styled.div`
  display: flex;
  white-space: nowrap;
  text-align: center;
`;

const WeekDay = styled.div`
  flex: 1 0;
  display: inline-block;
  border: 1px solid rgba(0,0,0,0);
  margin: -1px 0 0 -1px;
  height: 36px;
  line-height: 36px;
  font-size: 11px;
  width: 36px;
`;

const CalendarRow = styled.div`
  display: flex;
  .cell {
    border: 1px solid grey;
    background-color: #fff;
    flex: 1 0;
    display: inline-block;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    vertical-align: top;
    position: relative;
    z-index: 1;
    border: 2px solid rgba(0,0,0,0);
    margin: -2px 0 0 -2px;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
  }

  .cell:hover {
    background: #00aa6c;
    color: #fff;
    flex: 1 0;
    display: inline-block;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    vertical-align: top;
    position: relative;
    z-index: 1;
    border: 2px solid rgba(0,0,0,0);
    margin: -2px 0 0 -2px;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
  }

  .cell-today {
    border: 1px solid grey;
    background-color: #fff;
    flex: 1 0;
    display: inline-block;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    font-weight: 600;
    vertical-align: top;
    position: relative;
    z-index: 1;
    border: 2px solid rgba(0,0,0,0);
    margin: -2px 0 0 -2px;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
  }

  .cell-today:hover {
    background: #00aa6c;
    color: #fff;
    flex: 1 0;
    display: inline-block;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    vertical-align: top;
    position: relative;
    z-index: 1;
    border: 2px solid rgba(0,0,0,0);
    margin: -2px 0 0 -2px;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
  }

  .cell-inactive {
    color: grey;
    pointer-events: none;
    border: 1px solid grey;
    background-color: #fff;
    flex: 1 0;
    display: inline-block;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    vertical-align: top;
    position: relative;
    z-index: 1;
    border: 2px solid rgba(0,0,0,0);
    margin: -2px 0 0 -2px;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
  }

  .cell-disabled {
    background-color: white;
    color: gainsboro;
    pointer-events: none;
    flex: 1 0;
    display: inline-block;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    vertical-align: top;
    position: relative;
    z-index: 1;
    border: 2px solid rgba(0,0,0,0);
    margin: -2px 0 0 -2px;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
  }

  .cell-checkIn {
    border: 1px solid grey;
    background-color: #00aa6c;
    flex: 1 0;
    display: inline-block;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    vertical-align: top;
    position: relative;
    z-index: 1;
    border: 2px solid rgba(0,0,0,0);
    margin: -2px 0 0 -2px;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
  }

  .cell-checkOut {
    border: 1px solid grey;
    background-color: #cc0202;
    flex: 1 0;
    display: inline-block;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    vertical-align: top;
    position: relative;
    z-index: 1;
    border: 2px solid rgba(0,0,0,0);
    margin: -2px 0 0 -2px;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
  }
  `;

const Cell = styled.div`
  flex: 1 0;
  display: inline-block;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  vertical-align: top;
  position: relative;
  z-index: 1;
  border: 2px solid rgba(0,0,0,0);
  margin: -2px 0 0 -2px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
`;

const Average = styled.div`
  padding: 16px 0;
  font-size: 12px;
  border: solid #e0e0e0;
  border-width: 1px 0 0;
  color: #4a4a4a;

  margin-right: 15px;
  margin-left: 15px;
  position:absolute;
  bottom:0;
  width: 90%;
  display: flex;
  justify-content: space-between;
`;

const AverageSpan = styled.span`
  color: #4a4a4a;
  font-size: 12px;
`;

const AverageMsgSpan = styled.span`
  color: red;
  font-size: 12px;
`;



export default Calendar;
