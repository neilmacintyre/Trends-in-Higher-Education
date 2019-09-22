import updateScales from './updateScales.js';
import {majorStr2ID} from './misc.js';

export default function(store, lineTranistion){

    // Gather required feilds from store
    const majors = store.getState().selectedMajors;
    const transformMap = store.getState().transformMap;
    const data = transformMap(store.getState().data);
    const colorScale = store.getState().colorScale;
    const svg = store.getState().svg;
    const scales = updateScales(store); 
    const xScale = scales.xScale;
    const yScale = scales.yScale;

    // Insert tooltip
    d3.select("#tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .html("Testing");

    const majGroups = svg.selectAll('g.majGroups')
      .data(majors, d=>majorStr2ID(d));

    majGroups
        .enter()
        .append('g')
        .attr('class', 'majGroups');
    majGroups
      .exit().remove();

    svg.selectAll('g.majGroups')
        .selectAll('circle')
        .data(d => data.map(row => {return {year:row.year, enrollment:row[d]}}))
        .enter()
          .append('circle')
          .style("fill", d3.color('rgba(255, 255, 255, 0.1)'))
          .attr('r', 5)
          .attr('cy', d => {return yScale(d.enrollment)})
          .attr('cx', d => xScale(d.year))
          .on('mouseover', d => {
              // make the tooltip visible and move to the appropriat location 
              d3.select('#tooltip')
                  .style('visibility', 'visible')
                  .html(`<p>${d.year.getFullYear()}</p><p>${Math.round(d.enrollment)}</p>`)
                  .style('left', `${d3.event.pageX}px`)
                  .style('top', `${d3.event.pageY}px`);
          })
          .on('mouseout', d => {
              // Hide tooltip
              d3.select('#tooltip')
                .style('visibility', 'hidden');
          });

   
    // Apply transitions
    svg.selectAll('g.majGroups')
    .selectAll('circle')
    
      .transition(lineTranistion)
      .duration(1000)
      .attr('cy', d => {return yScale(d.enrollment)})
      .attr('cx', d => xScale(d.year))
      .style('fill', 
        function() {
          const maj = d3.select(this.parentNode).datum();
          return colorScale(majorStr2ID(maj))}
      );
}