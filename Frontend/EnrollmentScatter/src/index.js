import updateLines from './updateLines.js';
import updateScales from './updateScales.js';
import updateLegendKeys from './updateLegendKeys.js';
import {loadD2Select, attachDFSelection} from './Dropdown.js';
import {margin, width, height} from './constants.js';
import {enrollment2Percent, enrollment2YOY} from './calc.js'

let graphState = {};

Promise.all([
    d3.csv('./data/data.csv'),
    $.ajax({url: "./data/majorHierachy.json"}),
    ]).then(values => {
        draw_scatter(values[0], values[1]);
    });


function draw_scatter(data,hierarchy){
    // preform transformations to data
    data.forEach(d => {
        d.year = new Date(d.year);
    });

    var enrollmentLine = d3.line()
        .x((d) => x(d.year))
        .y((d) => y(d['enrollment']));
        
    var svg = d3.select("#enrollment_line_graph")
        .append("svg")
        .attr("class", "graph")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)   
        .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`); 
  
    const majors = data.columns.slice(1,4); // start with a sample of majors

    // Set up graphState
    graphState.graphSVG = svg;
    graphState.enrollmentLine = enrollmentLine;
    graphState.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    graphState.data = {
        enrollment:  data,
        enrollmentAsPercentage: enrollment2Percent(data),
        enrollmentAsYOY: enrollment2YOY(data),
        selectedMajors: majors,
        majorHierarchy: hierarchy 
    };
    graphState.data.display = graphState.data.enrollment;

    graphState.update = () => updateChart(graphState);

    graphState.update();
    
    loadD2Select(graphState)
    attachDFSelection(graphState);
       
}


function updateChart(graphState){
    updateScales(graphState)    
    updateLines(graphState);
    updateLegendKeys(graphState);
    
}
