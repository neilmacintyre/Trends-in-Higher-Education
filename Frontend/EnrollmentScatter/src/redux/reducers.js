import { ADD_MAJOR, REMOVE_MAJOR, UPDATE_HIERARCHY, UPDATE_DATA, UPDATE_SVG, UPDATE_COLOR_SCALE, CHANGE_TRANSFORM } from './actions.js';
import { Y_AXIS_LABELS } from '../constants.js';

export default function graphApp(state, action){
    if(state == undefined){
        const initalState = {
            selectedMajors: [],
            majorHierarchy: {},
            enrollmentLines: {},
            transformMap: (d) => d, // intialize to identity function
            yAxisLabel: Y_AXIS_LABELS.enrollment,
            data: {},
            svg: {}
        };

        return initalState;
    }

    switch(action.type){
        case ADD_MAJOR:
            return Object.assign({}, state, {selectedMajors: state.selectedMajors.concat(action.majorCatagory)});
        case REMOVE_MAJOR:
            const indexToRemove = state.selectedMajors.indexOf(action.majorCatagory); /// parmater major has been converted thus this is -1
            return Object.assign({}, state, {selectedMajors: state.selectedMajors.slice(0, indexToRemove).concat(state.selectedMajors.slice(indexToRemove+1))}); // TODO store selected majors as a set to make this operation easier and for built in duplicate protection 
        
        case UPDATE_HIERARCHY:
            return Object.assign({}, state, {majorHierarchy: action.majorHierarchy});
        
        case UPDATE_DATA:
            return Object.assign({}, state, {data: action.data});
        
        case UPDATE_SVG:
            return Object.assign({}, state, {svg: action.svg});
        
        case UPDATE_COLOR_SCALE:
                return Object.assign({}, state, {colorScale: action.colorScale});

        case CHANGE_TRANSFORM:
                return Object.assign({}, state, {transformMap: action.transformMap, yAxisLabel: action.yAxisLabel});

        
        default:
            return state;
    }
}
