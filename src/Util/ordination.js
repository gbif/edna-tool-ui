import Jaccard from "jaccard-index";
import BrayCurtis from "./BrayCurtis";
import numeric from "numeric"
import _ from 'lodash'
const jaccard = Jaccard();

/* export const getJaccardDistanceMatrix2 = (data) => {
    
    let samples = Object.keys(data)
    
    // create a dataframe
    const matrix = [...samples.map(() => new Array(samples.length))];
    
    for(let i =0; i < samples.length; i++){
        const res = matrix[i]
        res[i] = 0; // dist to self always 0
        const sample1 = samples[i]
        for(let j= i+1; j < samples.length; j++){
            const sample2 = samples[j]
            let idx = (jaccard.index(data[sample1], data[sample2])) 
            
            res[j] = idx;
            matrix[j][i] = idx;
            
        }
    }
    return {
        matrix,
        samples
    }
} */

export const getJaccardDistanceMatrix = (sparseMatrix, samples) => {
    console.log('getJaccardDistanceMatrix')
    // let samples = Object.keys(data)
    
    // create a dataframe
    const data = sparseToJaccardMatrix(sparseMatrix)
    const matrix = [...data.map(() => new Array(data.length))];
    
    for(let i =0; i < data.length; i++){
        if(i % 100 === 0){
            console.log(`Processed ${i} records`)
        }
        const res = matrix[i]
        res[i] = 0; // dist to self always 0
       // const sample1 = samples[i]
        for(let j= i+1; j < data.length; j++){
         //   const sample2 = samples[j]
            let idx = (jaccard.index(data[i], data[j]) /* || 0 */)  // * 10000;
            
            res[j] = idx || 0;
            matrix[j][i] = idx || 0;
            
        }
    }
    return {
        matrix,
        samples
    }
}

const sparseToJaccardMatrix = (data) => {
    const maxSampleIndex = _.max(data.map(d => d[1]))
    const matrix =  new Array(maxSampleIndex +1 ).fill().map(() => [])
    data.forEach((elm, idx) => {
        const [taxonIdx, sampleIdx, abundance] = elm;
        matrix[sampleIdx].push(taxonIdx)   
       // denseData[sampleIdx][taxonIdx] = abundance;
       
    }) 
    return matrix;
}

const sparseToDense = (data, transformValue = (val) => val) => {
    try {
    const maxSampleIndex = _.max(data.map(d => d[1]))
    const maxTaxonIndex =_.max(data.map(d => d[0]))
    const denseData =  new Array(maxSampleIndex +1 ).fill().map(() => new Array(maxTaxonIndex +1).fill(0));

     data.forEach((elm, idx) => {
        const [taxonIdx, sampleIdx, abundance] = elm;      
        denseData[sampleIdx][taxonIdx] = transformValue(abundance, sampleIdx);
       
    }) 

    return denseData;
    } catch(err) {
        console.log(err)
    }
}

export const getBrayCurtisDistanceMatrix = (sparseMatrix, samples, readCounts) => {
    console.log('getBrayCurtisDistanceMatrix')

    // Use relative abundance see https://github.com/gbif/edna-tool-ui/issues/104
    const relativeAbundance = (val, idx) => (val / readCounts[idx]) *100
    // Scale abundances, see https://github.com/gbif/edna-tool-ui/issues/2#issuecomment-1717637957 
    const transformAbundance = (val, idx) =>  Math.pow(relativeAbundance(val, idx), 1/4)
   
    // create a dataframe
    const vectors =  sparseToDense(sparseMatrix, transformAbundance)
    const matrix = [...vectors.map(() => new Array(vectors.length))];

    try {
        const brayCurtis = new BrayCurtis(vectors);
         for(let i =0; i < vectors.length; i++){
            const res = matrix[i]
            res[i] = 0; // dist to self always 0
           // const sample1 = samples[i]
            for(let j= i+1; j < vectors.length; j++){
              //  const sample2 = samples[j]
                let idx = (brayCurtis.calculateSimilarityBetweenVectors(i, j))  
                
                res[j] = idx;
                matrix[j][i] = idx;
                
            }
        }
        return {
            matrix,
            samples
        } 
       // console.log(brayCurtis)
    } catch(err){
        console.log(err)
    }
   
} 

/// given a matrix of distances between some points, returns the
/// point coordinates that best approximate the distances using
/// classic multidimensional scaling
export const classicMDS = (distances, dimensions) => {
    dimensions = dimensions || 2;

    // square distances
    var M = numeric.mul(-0.5, numeric.pow(distances, 2));

    // double centre the rows/columns
    function mean(A) { return numeric.div(numeric.add.apply(null, A), A.length); }
    var rowMeans = mean(M),
        colMeans = mean(numeric.transpose(M)),
        totalMean = mean(rowMeans);

    for (var i = 0; i < M.length; ++i) {
        for (var j =0; j < M[0].length; ++j) {
            M[i][j] += totalMean - rowMeans[i] - colMeans[j];
        }
    }

    // take the SVD of the double centred matrix, and return the
    // points from it
    var ret = numeric.svd(M),
        eigenValues = numeric.sqrt(ret.S);
    return ret.U.map(function(row) {
        return numeric.mul(row, eigenValues).splice(0, dimensions);
    });
};


export const getDataForDissimilarityPlot = (data, method = 'jaccard', sampleIds, readCounts) => {
    const processedData = method === 'jaccard' ? getJaccardDistanceMatrix(data, sampleIds) : getBrayCurtisDistanceMatrix(data, sampleIds, readCounts);
    const mds = classicMDS(processedData.matrix);
    const positions = numeric.transpose(mds);
    const plotData = processedData.samples.map((s,i) => { return {Sample: s, x: positions[0][i], y:positions[1][i]}})
    return plotData; 
}