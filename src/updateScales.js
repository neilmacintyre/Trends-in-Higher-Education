import {width, height} from './constants.js';


export default function updateScales(store){
    const majors = store.getState().selectedMajors;
    const data = store.getState().transformMap(store.getState().data);
  
    
    //y-scale
    let max = 0;
    majors.forEach(
        major =>{
            const majorData = data.map(
                d => {return {enrollment:d[major]}}
            );
        
            const colMax = d3.max(majorData, d => +d.enrollment)
            if(colMax > max){
                max = colMax
            }
    });

    var yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0,max]);


    //x Scale
    var xScale = d3.scaleTime()
        .range([0,width])
        .domain(d3.extent(data, d => d.year));

    return {xScale, yScale};

}

