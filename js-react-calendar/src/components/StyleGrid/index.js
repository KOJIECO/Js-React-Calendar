import React from 'react';
import moment from "moment";
import styled from 'styled-components';
import * as events from "events";

const GridWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-gap: 2px;
    //grid-template-rows: repeat(6, 1fr);
    background-color: ${props => props.isHeader ? '#1E1F21' : '#404040'};
    ${props => props.isHeader && 'border-bottom: 1px solid #404040'}
`;

const CellWrapper = styled.div`
    min-width: 140px;
    min-height: ${props => props.isHeader ? 24 : 80}px;
    background-color: ${props => props.weekEnd ? '#272829' : '#1E1F21'};
    color: ${props => props.isSelectedMonth ? '#DDDCDD' : '#555759'}
`;

const RowInCell = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: ${props => props.justifyContent ? props.justifyContent : 'flex-start'};
    ${props => props.pr && `padding-right: ${props.pr * 6}px`}
`;

const DayWrapper = styled.div`
    height: 33px;
    width: 31px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 2px;
    cursor: pointer;
`;

const CurrentDay = styled.div`
    height: 100%;
    width: 100%;
    background: #f00;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
`

const ShowDayWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
`

const EventListWrapper = styled.ul`
    margin: unset;
    list-style-position: inside;
    padding-left: 4px;
`

const EventItemWrapper = styled.button`
    position: relative;
    left: -14px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 114px;
    border: unset;
    background: unset;
    color: #DDDDDD;
    cursor: pointer;
    margin: 0;
    padding: 0;
    text-align: left;
`


const StyleGrid = ({dayStart, today, daysTotal, events, openFormHandler}) => {
    const day = dayStart.clone().subtract(1, "day");
    const daysArray = [...Array(42)].map(() => day.add(1, 'day').clone());
    // console.log(daysArray)

    const isCurrentDay = (day) => moment().isSame(day, 'day');
    const isSelectedMonth = (day) => today.isSame(day, 'month');

    return(
        <>
        <GridWrapper isHeader>
            {[...Array(7)].map((_, i) => (
                <CellWrapper isHeader isSelectedMonth key={i}>
                    <RowInCell justifyContent = {'flex-end'} pr={1}>
                        {moment().day(i + 1).format('ddd')}
                    </RowInCell>
                </CellWrapper>
            ))}
        </GridWrapper>
        <GridWrapper>
            {
                daysArray.map((dayItem) => (
                    <CellWrapper
                        weekEnd={dayItem.day() == 6 || dayItem.day() == 0}
                        key = {dayItem.unix()}
                        isSelectedMonth={isSelectedMonth(dayItem)}
                    >
                        <RowInCell justifyContent = {'flex-end'}>
                            <ShowDayWrapper>
                            <DayWrapper onDoubleClick={() => openFormHandler('Create')}>
                                {
                                    isCurrentDay(dayItem) ? (
                                        <CurrentDay>{dayItem.format('DD')}</CurrentDay>
                                    ) : (
                                        dayItem.format('DD')
                                    )
                                }
                            </DayWrapper>
                        </ShowDayWrapper>
                            <EventListWrapper>
                                {
                                    events
                                        .filter(event => event.date >= dayItem.format('X') && event.date <= dayItem.clone().endOf('day').format('X'))
                                        .map(event => (
                                            <li key={event.id}>
                                                <EventItemWrapper onDoubleClick={() => openFormHandler('Update', event)}>
                                                    {event.title}
                                                </EventItemWrapper>
                                            </li>
                                        ))
                                }
                            </EventListWrapper>
                        </RowInCell>
                    </CellWrapper>
                ))
            }
        </GridWrapper>
        </>
    );
};

export {
    StyleGrid
};