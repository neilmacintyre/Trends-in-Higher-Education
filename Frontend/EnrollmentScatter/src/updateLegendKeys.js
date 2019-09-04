import {majorStr2ID} from './misc.js';

export default function updateLegendKeys(graphState){
    const majors = graphState.data.selectedMajors;
    const hierarchy =  graphState.data.majorHierarchy;
    const colorScale = graphState.colorScale;
    const update = graphState.update;

    d3.selectAll('.legendKey').remove(); // clear any existing keys'
    majors.forEach(
        major => {
            if (major.length == 2){
                insertKeyLegend(hierarchy[major].name,colorScale(majorStr2ID(major)), majorStr2ID(major), majors,update);
            }
            else if (major.length == 5){
                // CIP 4 DATA
                const cip2 =  major.split('.')[0];
                insertKeyLegend(hierarchy[cip2][major].name,colorScale(majorStr2ID(major)), majorStr2ID(major), majors, update);
            }else{
                console.error('INVALID MAJOR FORMAT')
            }
        }
    );
}
function insertKeyLegend(text, color, id, majors, update){
    var legend = document.getElementById('legend');
    // TODO depeending on order of execution this might not show up in the right place in html
    // in case the legend has not yet been built
    if (!legend){
        legend = document.createElement("div");
        legend.setAttribute('id', 'legend');
        document.querySelector('#graph_pane').append(legend);
    }
    let key = document.createElement("div");
    legend.append(key);
    key.setAttribute('class', 'legendKey');
    key.setAttribute('id', `key_${id}`)

    key.setAttribute("style", `background:${color}`);
    key.addEventListener("mouseover", ()=>{
        
        d3.select(`#path_${id}`)
            .style('stroke-width','4');
    });
    key.addEventListener("mouseout", ()=>{
        d3.select(`#path_${id}`)
            .style('stroke-width','1.5');
    });

    let title = document.createElement('p');
    key.append(title);
    title.innerHTML = text;

    let removeIcon = document.createElement("div");
    removeIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"> <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="white" /> <path d="M0 0h24v24H0z" fill="none" /></svg>';
    removeIcon.setAttribute('class',"remove");

    removeIcon.addEventListener('click', ()=>{
        majors.splice(majors.indexOf(id), 1);
        d3.select(`#path_${id}`)
            .remove();
        legend.removeChild(document.getElementById(`key_${id}`));
        update(majors);
    });

   key.append(removeIcon)
}