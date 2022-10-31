//import constants
import * as CST from '../constants/index'

const memoriesReducer = (state= [], action) => {
    let newMemories = state;
    switch (action.type) {
        case CST.GET_LAST_5_MEMORIES:
            return action.memories;
        case CST.ADD_MEMORY:
            return action.memories;
    }
    return state;
};

export default memoriesReducer;