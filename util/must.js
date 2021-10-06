/**
 * 
 * @param {Promise} promise 
 * @returns
 */
const must = (promise)=> {
    return promise
    .then(data => [data, null])
    .catch(err => [null, err]);
}

module.exports = {must}