import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {StyleGrid} from "../StyleGrid";
import {Header} from "../Header";
import {Monitor} from "../Monitor";
import styled from "styled-components";

const ShadowWrapper = styled('div')`
    border-top: 1px solid #737374;
    border-left: 1px solid #464648;
    border-right: 1px solid #464648;
    border-bottom: 2px solid #464648;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 0 0 1px #1A1A1A, 0 8px 20px 6px #888;
`

const FromPositionWrapper = styled.div`
    position: absolute;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.35);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
`

const FormWrapper = styled(ShadowWrapper)`
    width: 200px;
    background-color: #1E1F21;
    color: #DDDDDD;
    box-shadow: unset;
`

const EventTitle = styled.input`
    padding: 4px 14px;
    font-size: .85rem;
    width: 100%;
    border: unset;
    background-color: #1E1F21;
    color: #DDDDDD;
    outline: unset;
    border-bottom: 1px solid #464648;
`

const EventBody = styled.input`
    padding: 4px 14px;
    font-size: .85rem;
    width: 100%;
    border: unset;
    background-color: #1E1F21;
    color: #DDDDDD;
    outline: unset;
    border-bottom: 1px solid #464648;
`

const ButtonsWrapper = styled.div`
    padding: 8px 14px;
    display: flex;
    justify-content: flex-end;
`

const url = 'http://localhost:5000'
const daysTotal = 42;
const defaultEvent = {
    title: '',
    description: '',
    date: moment().format("X")
}
function App() {

  moment.updateLocale('en', {week: {dow: 1}});
  // const today = moment();
  const [today, setToday] = useState(moment())
  const dayStart = today.clone().startOf('month').startOf('week');

  //window.moment = moment;

    const prevHandler = () => setToday(prev => prev.clone().subtract(1, 'month'))
    const todayHandler = () => setToday(moment())
    const nextHandler = () => setToday(prev => prev.clone().add(1, 'month'))


    const [method, setMethod] = useState(null)
    const [isShowForm, setShowForm] = useState(null)
    const [event, setEvent] = useState(null)

    const [events, setEvents] = useState([])

    const dateStartQuery = dayStart.clone().format('X');
    const dateEndQuery = dayStart.clone().add(daysTotal, 'days').format('X')

    useEffect(() => {
        fetch(`${url}/events?date_gte=${dateStartQuery}&date_lte=${dateEndQuery}`)
            .then(res => res.json())
            .then(res => {
                console.log("Response", res);
                setEvents(res);
            });
    }, [today])

    const openFormHandler = (methodName, eventForUpdate) => {
        console.log('onDoubleClick', methodName);
        setShowForm(true);
        setEvent(eventForUpdate || defaultEvent);
        setMethod(methodName);
    }

    const cancelButtonHandler = () => {
        setShowForm(false)
        setEvent(null)
    }

    const changeEventHandler = (text, field) => {
        setEvent(prevState => ({
            ...prevState,
            [field]: text
        }))
    }

    const eventFetchHandler = () => {
        const fetchURL = method == 'Update' ? `${url}/events/${event.id}` : `${url}/events`;
        const httpMethod = method == 'Update' ? 'PATCH' : 'POST';

        fetch(fetchURL, {
            method: httpMethod,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
        })
            .then(res => res.json())
            .then(res => {
                console.log(res)
                if (method == 'Update') {
                    setEvents(prevState => prevState.map(eventEl => eventEl.id == res.id ? res : eventEl))
                } else {
                    setEvents(prevState => [...prevState, res]);
                }
                cancelButtonHandler()
            })
    }

  return (
    <>
        {
            isShowForm ? (
                <FromPositionWrapper onClick={cancelButtonHandler}>
                    <FormWrapper onClick={e => e.stopPropagation()}>
                        <EventTitle
                            value={event.title}
                            onChange={e => changeEventHandler(e.target.value, 'title')}
                        />
                        <EventBody
                            value={event.description}
                            onChange={e => changeEventHandler(e.target.value, 'description')}
                        />
                        <ButtonsWrapper>
                            <button onClick={cancelButtonHandler}>Cancel</button>
                            <button onClick={eventFetchHandler}>{method}</button>
                        </ButtonsWrapper>
                    </FormWrapper>
                </FromPositionWrapper>
            ) : null
        }
        <ShadowWrapper>
            <Header />
            <Monitor
                today = {today}
                prevHandler = {prevHandler}
                todayHandler = {todayHandler}
                nextHandler = {nextHandler}
            />
            <StyleGrid dayStart={dayStart} today={today} daysTotal={daysTotal} events={events} openFormHandler={openFormHandler}/>
        </ShadowWrapper>
    </>
  );
}

// Здесь у меня произошел какой-то баг, из-за чего у меня не добавлялся ивент адекватно на дату.
// Возможно я исправлю это еще до нормальной сдачи.
// Если нет, то я заранее прошу прощения за весь спагетти-код и невыполнение всех требований и/или функций.
// I'm only a human after all ©

export default App;
