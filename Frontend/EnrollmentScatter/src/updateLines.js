import {majorStr2ID} from './misc.js';

export default function updateLines(graphState){
    const majors = graphState.data.selectedMajors;
    const data = graphState.data.display;
    const colorScale = graphState.colorScale;
    const line = graphState.enrollmentLine;
    const graphSVG = graphState.graphSVG;

    
    const p = graphSVG
        .selectAll('.graphPath')
            .data(majors, majorStr2ID);

    // UPDATE line
    p.transition()
        .duration(1000)
        .attr('d', maj => line(data.map(row => {return {year:row.year,  enrollment:row[maj]}})))
        
    p.enter()
        .append('path')
        .attr('d', maj => line(data.map(row => {return {year:row.year,  enrollment:row[maj]}})))
        .attr("class", "graphPath")
        .attr('id', maj => `path_${majorStr2ID(maj)}`)
        .style("stroke", d3.color('rgba(255, 255, 255, 0.1)'))  
        .transition()
        .duration(1000)
        .style("stroke", maj => colorScale(majorStr2ID(maj)));
        
    p.exit().remove()
        
   
}
