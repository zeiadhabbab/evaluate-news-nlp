const meaningCloudApiUrl = "https://api.meaningcloud.com/sentiment-2.1";

const axios = require("axios");


menaCloud = async (url, key) => {
    // the URL=`${BASE_API_URL}?key=${MEAN_CLOUD_API_KEY}&url=${req.body.url}&lang=en`
    // Documntaion here https://www.meaningcloud.com/developer/
    
    let resut = await axios.get(`${meaningCloudApiUrl}?key=${key}&url=${url}&lang=en`)
        .then(function (response) {
            const { code } = response.data.status
            //handle errors
            if (code == 100) {
                //Server Side Validation
                const error = handleErrorStatus(code, "Please enter a valid URL")
                return error
            } else if (code == 212) {
                const error = handleErrorStatus(code, response.data.status.msg)
                return error
            }
            return successResponse(response.data, code)
        })
    return resut;
}


const handleErrorStatus = (code, msg) => {
    const error = {
        object: null,
        msg: msg,
        code: code
        
    }
    return error;
}

//get the data from APi and  and send it to the client to show to user
const successResponse = (res, code) =>{
    const { agreement, confidence, score_tag,  subjectivity,  irony } = res;

    let object = {
        score_tag: score_tag,
        agreement: agreement,
        subjectivity: subjectivity,
        confidence: confidence,
        irony: irony
    }
    result = { object:object, msg:'', code: code };

    return result;

}

module.exports = {
    menaCloud
}