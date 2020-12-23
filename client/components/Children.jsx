import React from 'react';
import styled from 'styled-components';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Children = ({ childrenNumber }) => {
  const rows = [];
  for (let i = 1; i <= childrenNumber; i++) {
    rows.push(
      <InnerLine key={i}>
        <InnerLineDiv>
          <InnerLineSpan>{`Child ${i}`}</InnerLineSpan>
          <InnerLineDropDown>
            <InnerLineDropDownField>10</InnerLineDropDownField>
            <InnerLineDropDownIcon>
              <FontAwesomeIcon icon={faCaretDown}></FontAwesomeIcon>
            </InnerLineDropDownIcon>
          </InnerLineDropDown>
        </InnerLineDiv>
      </InnerLine>
    );
  }
  return (
    <Wrapper>{rows}</Wrapper>
  );
};

const Wrapper = styled.div`
  max-height: auto;
  border-color: #e0e0e0;
  border-style: solid;
  border-width: 1px 0;
  overflow: auto;
  font-family: 'Poppins', sans-serif;
  margin-top: 15px;
`;

const InnerLine = styled.div`
  display: block;
  margin: 10px 0px;
  min-height:38px;
  font-size: 14px;
`;

const InnerLineDiv = styled.div`
  &:after {
    content: "";
      display: block;
      padding-top: 16px;
  }
  max-height: 240px;
  height: 38px;
  font-size: 14px;
  line-height: 34px;
  clear: both;
`;

const InnerLineSpan = styled.span`
  font-size: 1em;
  font-weight: 700;
  padding-right: 16px;
`;

const InnerLineDropDown = styled.button`
  display: block;
  position: relative;
  height: 36px;
  min-width: 82px;
  // padding: 0 36px 0 12px;
  text-decoration: none;
  background: #fff;
  font: inherit;
  text-align: left;
  float: right;
  cursor: pointer;
  border: 1px solid #e0e0e0;
  border-radius: 2px;
  margin-right: 4px;
`;

const InnerLineDropDownField = styled.span`
  font-weight: 400;
  text-align: left;
  cursor: pointer;
  padding-left: 7px;
`;

const InnerLineDropDownIcon = styled.span`
  padding-left: 30px;
`;

export default Children;