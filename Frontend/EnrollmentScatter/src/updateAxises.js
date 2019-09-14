import {  width, height } from './constants.js';
import updateScales from './updateScales.js';

export default function updateAxises(store){
    const svg = store.getState().svg;

    const scales = updateScales(store);
    const xScale = scales.xScale;
    const yScale = scales.yScale;


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


    // Axis Labels

    // Remove labels
    if(svg.select("#y_label") != null){
        svg.select('#y_label').remove();
    }
    if(svg.select("#x_label") != null){
        svg.select('#x_label').remove();
    }
    
    // X Axis label
    svg.append("text")
        .attr('id', '#x_label')
        .attr('class', 'axis_label')
        .attr("transform", "translate(" + width/2 + ", " +(height + 36)+")")
        .text('Year');

    // Y Axis label
    
    svg.append("text")
        .attr('class', 'axis_label')
        .attr('id', 'y_label')
        .text(store.getState().yAxisLabel);

    // TODO This work but it might be better to calulate when it is not attached tothe dom
    const {width: y_label_width, height: y_label_height} = document.querySelector('#y_label').getBoundingClientRect();
    const {width: y_axis_width} =  document.querySelector('.axis.y').getBoundingClientRect();
    
    svg.select('#y_label')
        .attr('transform', `rotate(-90)  translate(-${y_label_width/2 + height/2}, -${y_label_height/2 + y_axis_width})`);        


}