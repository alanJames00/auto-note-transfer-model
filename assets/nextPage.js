const textArea = document.querySelector("#textarea");

const isFetched1 = document.getElementById("fetch-status-1");
const isFetched2 = document.getElementById("fetch-status-2");
const isFetchedLoading = document.getElementById("fetch-loader");

//Grammarly Part




//Get CurrentDate Function def
function getCurrentDate(){
  const date = new Date();
  let currentDay = String(date.getDate()).padStart(2, '0');
  let currentMonth = String(date.getMonth() + 1).padStart(2, "0");
  let currentYear = date.getFullYear();

  let currentDate = `${currentDay}-${currentMonth}-${currentYear}`;
  return currentDate;
}



//PdfMake 

document.getElementById("convertToPDFButton").addEventListener("click", function () {
  // Get the text from the textarea
  var textContent = textArea.value;

  // Define the PDF content using pdfmake
  var docDefinition = {
    content: [
      { text: textContent, fontSize: 16, margin: [0, 0, 0, 15], lineHeight: 1.4 }
    ]
  };

  // Generate the PDF document
  //Get date
  // Date object
  
  let currentDate = getCurrentDate();
  pdfMake.createPdf(docDefinition).download(`AutoNote - ${currentDate}.pdf`);
});


//Handle DOCX conversion
document.getElementById("convertToDocx").addEventListener("click", function () {
  
  var preHtmlContent = textArea.value;
  
  //Preprocessing and adding date to the docx file
  let currentDate = getCurrentDate();
  var htmlContent = `<h4> DATE: ${currentDate}</h4> <p>${preHtmlContent}</p>`;

  
  var converted = htmlDocx.asBlob(htmlContent);

  saveAs(converted, `AutoNote - ${currentDate}.docx`);
});


//get the query parameters from the url

// Get the query string from the URL
const queryString = window.location.search;

// Parse the query string into an object
const queryParams = new URLSearchParams(queryString);

// Access individual query parameters
const fileId = queryParams.get('fileid');



async function geturl(coutry) {
  try {
    const response = await fetch(
      `http://127.0.0.1:5000/download?fileid=${fileId}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const Data = await response.json();
    let transcribeContentOutput = Data.transcribeContentOutput;
    // let transcribeContentOutput = Data.title;

    console.log(transcribeContentOutput);

    //update the progress bar
    isFetched1.innerHTML = 'Transcribed &#10004;';
    isFetched2.innerHTML = 'Fetched &#10004;';
    isFetchedLoading.style.display = "none";
    //Then enable all the buttons
    document.getElementById("convertToPDFButton").removeAttribute("disabled");
    document.getElementById("convertToDocx").removeAttribute("disabled");

    
    textArea.value = transcribeContentOutput + "\n";
    

    // console.log(Data1);
  } catch (error) {
    alert("Error fetching data: " + error.message);
  }
}


geturl("inida");





