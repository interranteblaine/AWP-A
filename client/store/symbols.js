import axios from 'axios'

const TOKEN = 'token'
const SET_SYMBOLS = 'SET_SYMBOLS';

const setSymbols = symbols => ({type: SET_SYMBOLS, symbols});

export const fetchSymbols = () => {
    return async (dispatch) => {
        try {
            const token = window.localStorage.getItem(TOKEN)
            if (token) {
                const { data } = await axios.get('/api/symbols', {
                    headers: {
                        authorization: token
                    }
                });
                dispatch(setSymbols(data));
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export default function symbolsReducer (state = [], action) {
    switch (action.type) {
        case SET_SYMBOLS:
            return action.symbols;
        default:
            return state;
    }
}