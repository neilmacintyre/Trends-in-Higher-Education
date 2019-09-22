import { RADIAL_CHART } from './constants.js';
import { majorStr2ID } from './misc.js';


export default function (store) {
    const width = RADIAL_CHART.width;
    const height = RADIAL_CHART.height;
    const margin = RADIAL_CHART.margin;
    const data = store.getState().data;   
    const svg = d3.select("#enrollment_radial_pie_graph")
        .append("svg")
        .attr("class", "graph")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    const year = 1999;
    
    // Stylize Slider
    $(".js-range-slider").ionRangeSlider({
        skin: 'round',
        max: d3.max(data, d => d.year.getFullYear()),
        min: d3.min(data, d => d.year.getFullYear()),
        from: year,
        prettify_enabled: false,
        onChange: (d) => { 
            drawRadial(store, svg, d.from)}
    });

    drawRadial(store, svg, year);
}

function drawRadial(store, svg, year){
    const width = RADIAL_CHART.width;
    const height = RADIAL_CHART.height;
 
    // Go Shoping at Store
    const data = store.getState().data;
    const colorScale = store.getState().colorScale;
    const hierarchy = store.getState().majorHierarchy;

    const yearData = data.filter(d => d.year.getFullYear() == year)[0];

    let cleanedData = Object.keys(hierarchy).map(maj => { return { maj: maj, enrollment: yearData[maj] } });

    // Group majors with less than 2% of total into an other catagory
    const total = cleanedData.reduce((accumulator, d) => +d.enrollment + accumulator, 0);

    // the index 0 represents the sum of all the small majors
    cleanedData = cleanedData.reduce((accumulator, d) => {
        if (d.enrollment / total > 0.02) {
            return accumulator.concat([d]);
        } else {
            accumulator[0].enrollment += +d.enrollment;
            return accumulator;
        }
    }, [{ maj: 'other', enrollment: 0 }]);

    // Add up everything and confirm it is the total



    // make pie genator and arc gen -> pass data to pie gen --> data to feed to arc genorator --> pass genorated arc data to path of svg
    const pieGenerator = d3.pie();
    pieGenerator.value(d => d.enrollment);
    pieGenerator.padAngle(0.02);
    pieGenerator.sort((a,b) => b.maj - a.maj);

    const arcGenerator = d3.arc()
        .innerRadius(145)
        .outerRadius(170);

    const pieData = pieGenerator(cleanedData);

    const arcPaths = svg.selectAll('.radial_arc')
        .data(pieData, d => d.maj)
        .attr('transform', `translate(${width / 2} ${height / 2})`)
        .attr('d', d => arcGenerator(d));

    arcPaths  
        .enter()
        .append('path')
        .attr('class', 'radial_arc')
        .attr('d', d => arcGenerator(d))
        .attr('transform', `translate(${width / 2} ${height / 2})`)
        .style("fill", d => colorScale(majorStr2ID(d.data.maj)));

    arcPaths
        .exit().remove();


    svg.select('.radial_text').remove();

    svg.append('text')
        .attr('class', 'radial_text')
        .html(`Year: ${year}`)
        .attr("transform", `translate(${width / 2 - 76} ${height / 2})`);

    // Add Labels
    console.log(hierarchy);

    

    // Add play button

}