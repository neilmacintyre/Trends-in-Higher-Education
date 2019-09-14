// Set the dimensions of the canvas / graph
const margin = {top: 30, right: 20, bottom: 50, left: 100},
width = 1000 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

const Y_AXIS_LABELS = {
    enrollment: 'Students Enrolled',
    percentageOfTotal: 'Percentage of Total Enrollment',
    yearOverYearChange: 'Year Over Year Change'
}


export {margin, width, height, Y_AXIS_LABELS};