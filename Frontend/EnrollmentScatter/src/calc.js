/** Math operations on data set */
function enrollment2Percent(enrollment){
    

    const percentOfTotal = $.extend(true,[], enrollment);
    const cols = percentOfTotal.columns;
    
    for(let key in percentOfTotal){

        // assign total and proceed if not undefined
        let yearTotal =  percentOfTotal[key].year_total
        if (yearTotal){
            let row = percentOfTotal[key];
            cols.slice(1).map(majorKey => {
                row[majorKey] = 100*row[majorKey]/yearTotal 
            });

        }
    };
    
    return percentOfTotal;

}

function enrollment2YOY(enrollment){
    

    const yoy = $.extend(true,[], enrollment);
    const cols = yoy.columns;
    let prevYearKey;
    for(let yearKey in yoy){

        // assign total and proceed if not undefined
        let yearTotal =  yoy[yearKey].year_total
        if (yearTotal){

            let row = enrollment[yearKey];
            let lastRow = enrollment[prevYearKey];

            cols.slice(1).map((majorKey) => {
                if(prevYearKey){
                    yoy[yearKey][majorKey] = row[majorKey]/lastRow[majorKey];
                }else{
                    yoy[yearKey][majorKey] = 0
                }
                
            });
            prevYearKey = yearKey;
        }
    };
    console.log('YOy',yoy);
    
    return yoy;

}

export {enrollment2Percent,enrollment2YOY};