import {width, height} from './constants.js';


export default function updateScales(graphState){
    const majors = graphState.data.selectedMajors;
    const data = graphState.data.display;
    const svg = graphState.graphSVG;


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

    
    graphState.enrollmentLine =
        d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.enrollment));


    // Remove axises if they already exist

    if(svg.select("g.axis.y") != null){
        svg.select("g.axis.y").remove();
    }
    if(svg.select("g.axis.x") != null){
        svg.select("g.axis.x").remove();
    }


    // Add the X Axis
    svg.append("g")
        .attr("class", "axis x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    // Add the Y Axis
    svg.append("g")
        .attr("class", "axis y")
        .call(d3.axisLeft(yScale));

}
