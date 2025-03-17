document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("health-form").addEventListener("submit", function (event) {
        event.preventDefault();
        
        const age = parseInt(document.getElementById("age").value);
        const weight = parseFloat(document.getElementById("weight").value);
        const height = parseFloat(document.getElementById("height").value) / 100; // Convert cm to meters
        const systolic = parseInt(document.getElementById("systolic").value);
        const diastolic = parseInt(document.getElementById("diastolic").value);
        const familyHistory = Array.from(document.querySelectorAll("input[name='family_disease']:checked"))
                                  .map(input => input.value);
        
        if (isNaN(age) || isNaN(weight) || isNaN(height) || isNaN(systolic) || isNaN(diastolic)) {
            alert("Please fill in all fields correctly.");
            return;
        }
        
        const requestData = {
            age,
            bmi: weight / (height * height),
            systolic,
            diastolic,
            familyHistory
        };
        
        // Updated URL for Azure Backend
        fetch("https://health-risk-api-a2b7e3fjcnatcffm.uaenorth-01.azurewebsites.net/calculateRisk", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .then(data => {
            const resultDiv = document.getElementById("result");
            const summaryDiv = document.getElementById("summary");
        
            // Display the risk category
            resultDiv.textContent = "Risk Category: " + data.riskCategory;
        
            // Remove previous styles and apply the correct category color
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
        
            // Generate the summary
            summaryDiv.innerHTML = `
                <h3>Summary of Your Inputs:</h3>
                <p><strong>Age:</strong> ${requestData.age} years</p>
                <p><strong>BMI:</strong> ${requestData.bmi.toFixed(1)}</p>
                <p><strong>Blood Pressure:</strong> ${requestData.systolic}/${requestData.diastolic} mmHg</p>
                <p><strong>Family History of Diseases:</strong> ${requestData.familyHistory.length > 0 ? requestData.familyHistory.join(", ") : "None"}</p>
            `;
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred while processing the request.");
        });
    });

    // Dark Mode Toggle Functionality
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    const body = document.body;

    // Check if user has dark mode preference saved
    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark-mode");
    }

    darkModeToggle.addEventListener("click", function () {
        body.classList.toggle("dark-mode");

        // Save preference in localStorage
        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
        } else {
            localStorage.removeItem("darkMode");
        }
    });
});
