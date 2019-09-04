function majorStr2ID(str){
    str = str.split(new RegExp(/\./, 'g')).join('_'); // remove charecters that mess with css selectors
    
    return `${str.split(' ').join('').toLowerCase()}`
}

export {majorStr2ID};