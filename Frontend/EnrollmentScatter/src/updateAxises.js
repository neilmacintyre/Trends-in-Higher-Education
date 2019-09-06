import { margin, width, height } from './constants.js';
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

}