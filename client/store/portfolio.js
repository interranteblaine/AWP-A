import axios from 'axios'

const TOKEN = 'token';
const ADD_PORTFOLIO_ITEM = 'ADD_PORTFOLIO_ITEM';
const REMOVE_PORTFOLIO_ITEM = 'REMOVE_PORTFOLIO_ITEM';
const SET_PORTFOLIO = 'SET_PORTFOLIO';

const addPortfolioItem = item => ({type: ADD_PORTFOLIO_ITEM, item});
const removePortfolioItem = item => ({type: REMOVE_PORTFOLIO_ITEM, item});
const setPortfolio = portfolio => ({type: SET_PORTFOLIO, portfolio});

export const addToPortfolio = (portfolioItem) => {
    return async (dispatch) => {
        try {
            const token = window.localStorage.getItem(TOKEN)
            if (token) {
                const { data } = await axios.post('/api/portfolio', portfolioItem, {
                    headers: {
                        authorization: token
                    }
                });
                dispatch(addPortfolioItem(data));
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export const removeFromPortfolio = (itemId) => {
    return async (dispatch) => {
        try {
            const token = window.localStorage.getItem(TOKEN)
            if (token) {
                const { data } = await axios.delete(`/api/portfolio/${itemId}`, {
                    headers: {
                        authorization: token
                    }
                });
                dispatch(removePortfolioItem(data));
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export const fetchPortfolios = (userId) => {
    return async (dispatch) => {
        try {
            const token = window.localStorage.getItem(TOKEN)
            if (token) {
                const { data } = await axios.get(`/api/portfolio/${userId}`, {
                    headers: {
                        authorization: token
                    }
                });
                dispatch(setPortfolio(data));
            }
        } catch (error) {
            console.log(error)
        }
    }
}

const initialState = { A: [], B: [] };

export default function portfolioReducer (state = initialState, action) {
    switch (action.type) {
        case ADD_PORTFOLIO_ITEM: {
            const { item } = action;
            const { portGroup: group } = item;
            return { ...state, [group]: [...state[group], item] };
        }
        case REMOVE_PORTFOLIO_ITEM: {
            const { item } = action;
            const { portGroup: group } = item;
            return { ...state, [group]: state[group].filter(portItem => portItem.id !== item.id) };
        }
        case SET_PORTFOLIO: {
            const { portfolio } = action;
            return {
                A: portfolio.filter(item => item.portGroup === "A"),
                B: portfolio.filter(item => item.portGroup === "B")
            }
        }
        default:
            return state;
    }
}