import {majorStr2ID} from './misc.js';
import updateScales from './updateScales.js'


export default function updateLines( store){
    const majors = store.getState().selectedMajors;
    const transformMap = store.getState().transformMap;
    const data = transformMap(store.getState().data);
    const colorScale = store.getState().colorScale;
    //const line = store.getState().enrollmentLine;
    const svg = store.getState().svg;

    const scales = updateScales(store); // It would probably amke sense to store scale in the store since it is used in multiple places
                                        // needs to be caluclated on majors selected change so it should be added to that recuder
                                        // or would that be considered an api call -- ie not pure

    const xScale = scales.xScale;
    const yScale = scales.yScale;


    const line =
        d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.enrollment));
    
    const p = svg
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
