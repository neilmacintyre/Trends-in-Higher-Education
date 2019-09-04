// Load drop down
function loadD2Select(graphState){
    const majors = graphState.data.selectedMajors;
    const hierarchy =  graphState.data.majorHierarchy;
    const update = graphState.update;


    let d2Select = $('#broad_sel');
    
    d2Select.append($('<option>').html('Total Enrollment').attr('key','-1')
        .on('click',  (element) => loadD4Select(hierarchy, element)
        ));
    for (let catagory in hierarchy){
        d2Select.append(
            $('<option>')
                .html(hierarchy[catagory].name)
                .attr('key',catagory)
                .on('click', (element) => {
                    loadD4Select(graphState, element);
                    majors.push(hierarchy[catagory].d2);
                    update();
                })
            );
    }	
   }


function loadD4Select(graphState, element){
    const majors = graphState.data.selectedMajors;
    const hierarchy =  graphState.data.majorHierarchy;
    const update = graphState.update;

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
                            majors.push(catagory);
                            update();
                        })
                    );
            }
        }	
    }else{
        // change back to total enrollment graph
        $('#detailed_sel').css('visibility', 'hidden');
    }
}

function attachDFSelection(graphState){
    $('#display_percent').on('click', () => {
        graphState.data.display = graphState.data.enrollmentAsPercentage;
        graphState.update(graphState)
    });
    $('#display_enrollment').on('click', () => {
        graphState.data.display = graphState.data.enrollment;
        graphState.update(graphState)
    });
    $('#display_yoy').on('click', () => {
        graphState.data.display = graphState.data.enrollmentAsYOY;
        graphState.update(graphState)
    });

    

}



export {loadD2Select, loadD4Select, attachDFSelection};