const textArea = document.querySelector("#textarea");
const generatePDFButton = document.getElementById("generate-pdf");
const downloadPDFLink = document.getElementById("download-pdf");



const isFetched1 = document.getElementById("fetch-status-1");
const isFetched2 = document.getElementById("fetch-status-2");
const isFetchedLoading = document.getElementById("fetch-loader");


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


    
    textArea.value = transcribeContentOutput + "\n";
    function generatePDF() {
      console.log(downloadPDFLink);

      const pdf = new jsPDF();
      const textContent = textArea.value;

      pdf.text(textContent, 10, 10);

      // Save the PDF
      const pdfData = pdf.output("blob");
      const pdfUrl = URL.createObjectURL(pdfData);

      downloadPDFLink.href = pdfUrl;
      downloadPDFLink.style.display = "block";
    }
    generatePDFButton.addEventListener("click", generatePDF);

    // console.log(Data1);
  } catch (error) {
    alert("Error fetching data: " + error.message);
  }
}


geturl("inida");





