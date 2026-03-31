document.addEventListener('DOMContentLoaded', () => {
    const deviceInputs = document.getElementById('deviceInputs');
    const addDeviceBtn = document.getElementById('addDevice');
    const resultDiv = document.getElementById('result');
    const solarSuggestionDiv = document.getElementById('solarSuggestion');
    const batteryRecommendationDiv = document.getElementById('batteryRecommendation');

    addDeviceBtn.addEventListener('click', addDeviceInput);
    deviceInputs.addEventListener('click', removeDevice);
    // Add input event listener to deviceInputs
    deviceInputs.addEventListener('input', calculateTotalUsage);

    function addDeviceInput() {
        const newDevice = document.createElement('div');
        newDevice.className = 'device-input';
        newDevice.innerHTML = `
            <input type="text" placeholder="Device name" class="device-name">
            <input type="number" placeholder="Power (Watts)" class="device-power">
            <input type="number" placeholder="Hours per day" class="device-hours">
            <button class="remove-device">X</button>
        `;
        deviceInputs.appendChild(newDevice);
        // Calculate total usage after adding a new device
        calculateTotalUsage();
    }

    function removeDevice(e) {
        if (e.target.classList.contains('remove-device')) {
            e.target.parentElement.remove();
            // Calculate total usage after removing a device
            calculateTotalUsage();
        }
    }

    function calculateTotalUsage() {
        let totalWattHours = 0;
        const devices = document.querySelectorAll('.device-input');
        
        devices.forEach(device => {
            const power = parseFloat(device.querySelector('.device-power').value) || 0;
            const hours = parseFloat(device.querySelector('.device-hours').value) || 0;
            totalWattHours += power * hours;
        });

        const ampHours = totalWattHours / 12; // Assuming 12V system

        // Ensure this ID matches your HTML
        const resultContent = document.getElementById('resultContent'); 
        if (totalWattHours > 0) {
            resultContent.textContent = `${totalWattHours.toFixed(2)}Wh (${ampHours.toFixed(2)}Ah at 12V)`;
            resultContent.classList.remove('no-info');
        } else {
            resultContent.textContent = 'Enter device info above'; // Ensure this message is displayed when no devices are entered
            resultContent.classList.add('no-info');
        }

        // Calculate and display battery capacity recommendation
        const recommendedBatteryCapacity = Math.ceil(ampHours * 3 * 2); // Assuming 50% depth of discharge
        batteryRecommendationDiv.querySelector('.result-box-content').innerHTML = `
            <div class="battery-capacity-result">${recommendedBatteryCapacity}Ah</div>
            <span class="assumption">(Assuming 50% depth of discharge)</span>
        `;

        // Calculate and display solar panel recommendation
        const recommendedSolarPower = Math.ceil((totalWattHours / 5) * 1.33); // Assuming 5 hours of peak sunlight
        solarSuggestionDiv.querySelector('.result-box-content').innerHTML = `
            <div class="solar-power-result">${recommendedSolarPower}W</div>
            <span class="assumption">(Assuming 5 hours of peak sunlight per day)</span>
        `;


    }

    // Initialize the display of results
    calculateTotalUsage(); // Ensure this is called after adding event listeners

    // Call this to initialize the display
    calculateTotalUsage(); // Ensure results are displayed on load
});