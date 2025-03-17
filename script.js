document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("health-form").addEventListener("submit", function (event) {
        event.preventDefault();
        
        //  Collect Input Values
        const age = parseInt(document.getElementById("age").value);
        const weight = parseFloat(document.getElementById("weight").value);
        const height = parseFloat(document.getElementById("height").value);
        const systolic = parseInt(document.getElementById("systolic").value);
        const diastolic = parseInt(document.getElementById("diastolic").value);

        const familyHistory = Array.from(document.querySelectorAll("input[name='family_disease']:checked"))
                                  .map(input => input.value);

        //  Basic Form Validation
        if (isNaN(age) || isNaN(weight) || isNaN(height) || isNaN(systolic) || isNaN(diastolic)) {
            alert("Please fill in all fields correctly.");
            return;
        }

        //  Request Data with BMI Calculation
        const requestData = {
            age,
            weight,
            height,
            systolic,
            diastolic,
            familyHistory
        };

        // API Request
        fetch("https://health-risk-api-a2b7e3fjcnatcffm.uaenorth-01.azurewebsites.net/calculateRisk", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch. Please try again.");
            }
            return response.json();
        })
        .then(data => {
            const resultDiv = document.getElementById("result");
            const summaryDiv = document.getElementById("summary");

            //  Display Risk Score & Category
            resultDiv.innerHTML = `<strong>Risk Category:</strong> ${data.riskCategory} <br> 
                                   <strong>Risk Score:</strong> ${data.riskScore}`;

            //  Styling for Risk Categories
            resultDiv.classList.remove("low-risk", "moderate-risk", "high-risk", "uninsurable");
            if (data.riskCategory === "Low Risk") {
                resultDiv.classList.add("low-risk");
            } else if (data.riskCategory === "Moderate Risk") {
                resultDiv.classList.add("moderate-risk");
            } else if (data.riskCategory === "High Risk") {
                resultDiv.classList.add("high-risk");
            } else {
                resultDiv.classList.add("uninsurable");
            }

            //  Display Summary of Inputs
            summaryDiv.innerHTML = `
                <h3>Summary of Your Inputs:</h3>
                <p><strong>Age:</strong> ${requestData.age} years</p>
                <p><strong>Weight:</strong> ${requestData.weight} kg</p>
                <p><strong>Height:</strong> ${requestData.height} cm</p>
                <p><strong>Blood Pressure:</strong> ${requestData.systolic}/${requestData.diastolic} mmHg</p>
                <p><strong>Family History:</strong> ${requestData.familyHistory.length > 0 ? requestData.familyHistory.join(", ") : "None"}</p>
            `;
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred while processing the request. Please try again.");
        });
    });

    //  Dark Mode Toggle
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    const body = document.body;

    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark-mode");
    }

    darkModeToggle.addEventListener("click", function () {
        body.classList.toggle("dark-mode");

        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
        } else {
            localStorage.removeItem("darkMode");
        }
    });
});
