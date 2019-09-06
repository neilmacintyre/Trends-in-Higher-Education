/*
 * action types
 */
export const ADD_MAJOR = 'ADD_MAJOR';
export const REMOVE_MAJOR = 'REMOVE_MAJOR';
export const UPDATE_HIERARCHY = 'UPDATE_HIERARCHY'; 
export const CHANGE_TRANSFORM = 'CHANGE_TRANSFORM';
export const UPDATE_DATA = 'UPDATE_DATA';
export const UPDATE_SVG = 'UPDATE_SVG';
export const UPDATE_COLOR_SCALE = 'UPDATE_COLOR_SCALE';


/*
 * action creators
 */

export function addMajor(majorCatagory){
    return {type: ADD_MAJOR, majorCatagory}
}
export function removeMajor(majorCatagory){;
    return {type: REMOVE_MAJOR, majorCatagory}
}
export function updateHierarchy(majorHierarchy){
    return {type: UPDATE_HIERARCHY, majorHierarchy};
}
export function changeTransform(transformMap){
    return {type: CHANGE_TRANSFORM, transformMap};
}
export function updateData(data){
    return {type: UPDATE_DATA, data};
}
export function updateSVG(svg){
    return {type: UPDATE_SVG, svg};
}
export function updateColorScale(colorScale){
    return {type: UPDATE_COLOR_SCALE, colorScale};
}

