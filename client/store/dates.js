import axios from 'axios'

const TOKEN = 'token';
const SET_DATES = 'SET_DATES';

const setDates = dates => ({type: SET_DATES, dates});

export const fetchDates = () => {
    return async (dispatch) => {
        try {
            const token = window.localStorage.getItem(TOKEN);
            if (token) {
                const { data } = await axios.get('/api/dates', {
                    headers: {
                        authorization: token
                    }
                });
                dispatch(setDates(data));
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export default function datesReducer (state = [], action) {
    switch (action.type) {
        case SET_DATES: {
            return action.dates.map(item => item.date).sort();
        }
        default:
            return state;
    }
}