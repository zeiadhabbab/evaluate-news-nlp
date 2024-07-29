const meaningCloudApiUrl = "https://api.meaningcloud.com/sentiment-2.1";



menaCloud = async (url, key) => {
    // the URL=`${BASE_API_URL}?key=${MEAN_CLOUD_API_KEY}&url=${req.body.url}&lang=en`
    // Documntaion here https://www.meaningcloud.com/developer/
    let fullUrl = `${meaningCloudApiUrl}?key=${key}&url=${url}&lang=en`;

    const response = await fetch(fullUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    let data = null;
    data = await response.json();
    const code = data.status.code;

    console.log(data.status.code);
  
    if (code == 100) {
        //Server Side Validation
        const error = onErrorStatus(100, "Please enter a valid URL ...");
        return  error;
    } else if (code == 212) {
        const error = onErrorStatus(212, data.status.msg);
        return  error;
    }

    return onSuccess(data, code);
}


const onErrorStatus = (code, msg) => {
    const error = {
        object: null,
        msg: msg,
        code: code
    }
    return error;
}

//get the data from APi and  and send it to the client to show to user
const onSuccess = (res) =>{
    const { agreement, confidence, score_tag,  subjectivity,  irony } = res;

    let object = {
        score_tag: score_tag,
        agreement: agreement,
        subjectivity: subjectivity,
        confidence: confidence,
        irony: irony
    }
    result = { object:object, msg:'success', code: 200 };

    return result;
}

module.exports = {
    menaCloud
}