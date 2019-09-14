import { addMajor, changeTransform } from "./redux/actions.js";
import { Y_AXIS_LABELS} from './constants.js'

// Load drop down
function loadD2Select(store){
    const hierarchy =  store.getState().majorHierarchy;

    let d2Select = $('#broad_sel');
    
    d2Select.append($('<option>').html('Total Enrollment').attr('key','-1')
        .on('click',  (element) => loadD4Select(hierarchy, element,store)
        ));
    for (let catagory in hierarchy){
        d2Select.append(
            $('<option>')
                .html(hierarchy[catagory].name)
                .attr('key',catagory)
                .on('click', (element) => {
                    loadD4Select(element, store);
                    store.dispatch(addMajor(hierarchy[catagory].d2));
                 
                })
            );
    }	
   }


function loadD4Select(element, store){
    const hierarchy =  store.getState().majorHierarchy;

    const key = $(element.currentTarget).attr('key');
    // clear anything that is already there
    $('#detailed_sel').empty();
    
    if (key != -1){  // makes sure that we have not just selected the aggregate of all sub catagories "Total"
        $('#detailed_sel').css('visibility', 'visible');
        // populate the d4 sub-cat
        const d4Select = $('#detailed_sel');
        d4Select.append($('<option>').html('All').attr('key','-1'));
        for (let catagory in hierarchy[key]){
            if (catagory !== 'name' && catagory !== 'd4' && catagory !== 'd2'){
                d4Select.append(
                    $('<option>')
                        .html(hierarchy[key][catagory].name)
                        .attr('key',`${catagory}`)
                        .on('click', (element) => {
                            store.dispatch(addMajor(catagory));
                        })
                    );
            }
        }	
    }else{
        // change back to total enrollment graph
        $('#detailed_sel').css('visibility', 'hidden');
    }
}

import { enrollment2Percent, enrollment2YOY } from './calc.js';
function attachDFSelection(store){
    $('#display_percent').on('click', () => {
        store.dispatch(changeTransform(enrollment2Percent, Y_AXIS_LABELS.percentageOfTotal));
        
    });
    $('#display_enrollment').on('click', () => {
        store.dispatch(changeTransform(x=>x,Y_AXIS_LABELS.enrollment));
        
    });
    $('#display_yoy').on('click', () => {
        store.dispatch(changeTransform(enrollment2YOY , Y_AXIS_LABELS.yearOverYearChange));
    });

    

}



export {loadD2Select, loadD4Select, attachDFSelection};