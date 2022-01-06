import axios from 'axios'

const TOKEN = 'token';
const SET_DATA_TABLE = 'SET_DATA_TABLE';

const setDataTable = dataTable => ({type: SET_DATA_TABLE, dataTable});

export const fetchDataTable = (userId) => {
    return async (dispatch) => {
        try {
            const token = window.localStorage.getItem(TOKEN);
            if (token) {
                const { data } = await axios.get(`api/timeseries/${userId}`, {
                    headers: {
                        authorization: token
                    }
                });
                dispatch(setDataTable(data));
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export default function analysisReducer (state = [], action) {
    switch (action.type) {
        case SET_DATA_TABLE:
            return action.dataTable;
        default:
            return state;
    }
}