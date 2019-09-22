import updateLines from './updateLines.js';
import updateScales from './updateScales.js';
import updateLegendKeys from './updateLegendKeys.js';
import { loadD2Select, attachDFSelection } from './Dropdown.js';
import { margin, width, height } from './constants.js';
import graphApp from './redux/reducers.js';
import { updateHierarchy, updateData, updateSVG, updateColorScale } from './redux/actions.js';
import updateAxises from './updateAxises.js';
import radialPieChart from './radialPieChart.js' 

let store = {};


Promise.all([
    d3.csv('./data/data.csv'),
    $.ajax({url: "./data/majorHierachy.json"}),
    ]).then(values => {
        draw_scatter(values[0], values[1]);
    });


function draw_scatter(data, hierarchy) {
    // preform transformations to data
    data.forEach(d => {
        d.year = new Date(d.year);
    });

    var svg = d3.select("#enrollment_line_graph")
        .append("svg")
        .attr("class", "graph")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)   
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

   
    store = Redux.createStore(graphApp);
    
    
    store.dispatch(updateHierarchy(hierarchy));
    store.dispatch(updateData(data));
    store.dispatch(updateSVG(svg));
    store.dispatch(updateColorScale(d3.scaleOrdinal(d3.schemeCategory10)))

    
    const unsubscribe = store.subscribe(() => {
        updateChart(store);
    });

    updateChart(store);

    loadD2Select(store)
    attachDFSelection(store);


    // insert the radial pie chart
    radialPieChart(store);
}


function updateChart(store) {
    updateAxises(store);
        updateLines(store);
        updateLegendKeys(store);
}
