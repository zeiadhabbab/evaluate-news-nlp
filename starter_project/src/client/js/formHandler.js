// Replace checkForName with a function that checks the URL
import { checkForName, checkForUrl } from './urlChecker'
import Typewriter from 'typewriter-effect/dist/core';


// If working on Udacity workspace, update this with the Server API URL e.g. `https://wfkdhyvtzx.prod.udacity-student-workspaces.com/api`
// const serverURL = 'https://wfkdhyvtzx.prod.udacity-student-workspaces.com/api'
const serverURL = 'https://localhost:8000/api'

const form = document.getElementById('urlForm');
const errorMsg = document.getElementById('errorMsg');
const loader = document.getElementById('loader');
const loaderText = new Typewriter('#results', {
    loop: true,
});

form.addEventListener('submit', handleSubmit);

async  function handleSubmit(event) {
    event.preventDefault();

    let isValidUrl = true;
    // Get the URL from the input field
    const urlText = document.getElementById('url').value;
   
    isValidUrl = checkForUrl(urlText);

 
    // Check if the URL is valid
    if(!isValidUrl){
        showErrors('Please insert a valid url!');
        return;
    }else{
          // If the URL is valid, send it to the server using the serverURL constant above
        hideErrors();
        showLoader(true);
        loaderText.typeString('........').start();

        const body = {url:urlText};
        try {
            // Function to send data to the server
            const response = await fetch('http://localhost:8000/getData', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch recent entry: ${response.status}`);
            }
            const { object, msg, code } = await response.json();
            if(object != null || code === 0 || code === 200){
                hideErrors();
                showLoader(false);
                loaderText.stop();
                loaderText.deleteAll(20).start();
                loaderText.options.loop = false;

                let textToShow = `Agreement: ${object.agreement}<br>`;
                textToShow += `Subjectivity: ${object.subjectivity}<br>`;
                textToShow += `Confidence: ${object.confidence}<br>`;
                textToShow += `Irony: ${object.irony}<br>`;
                textToShow += `Score Tag: ${object.score_tag}`;

                loaderText.options.delay = 40;
                loaderText.typeString(textToShow).start();
            }else
            if (code !== 200)  {
                showErrors(msg);
                showLoader(false);
                loaderText.stop();
                loaderText.deleteAll(20).start();
                loaderText.options.loop = false;
            } 
            
        } catch (error) {
            console.error("Error updating UI:", error);
            loader.classList.add("hidden");
        }
    }
}


function showErrors(errorText = ''){
    if(errorText != '' ){
        errorMsg.innerHTML = errorText;
    }
    errorMsg.classList.remove('hidden');
}

function hideErrors(){
    errorMsg.classList.add('hidden');
}

function showLoader(show){
    if(show){
        loader.style.display = 'flex';
    }else{
        loader.style.display = 'none';
    }
}


// Export the handleSubmit function
export { handleSubmit };

