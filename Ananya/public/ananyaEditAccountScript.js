// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
        .then((text) => {
            statusElem.textContent = text;
        })
        .catch((error) => {
            statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
        });
}

async function editPassword(event) {
    event.preventDefault();

    const passwordValue = document.getElementById('Password').value;
    // const displayNameValue = document.getElementById('DisplayName').value;
    // const bioValue = document.getElementById('Bio').value;
    // const regionValue = document.getElementById('Region').value;
    // const avatarValue = document.getElementById('Avatar').value;

    // document.getElementById('DisplayName').setAttribute("placeholder", "placeholder value");

    const response = await fetch('/edit-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            // displayName: displayNameValue,
            password: passwordValue,
            // bio: bioValue,
            // region: regionValue,
            // avatar: avatarValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('editResultMsg');


    if (responseData.success) {
        messageElement.textContent = "Password saved successfully!";
    } else {
        messageElement.textContent = "Error saving password!";
    }
}

async function editDN(event) {
    event.preventDefault();

    // const passwordValue = document.getElementById('Password').value;
    const displayNameValue = document.getElementById('DisplayName').value;
    // const bioValue = document.getElementById('Bio').value;
    // const regionValue = document.getElementById('Region').value;
    // const avatarValue = document.getElementById('Avatar').value;

    // document.getElementById('DisplayName').setAttribute("placeholder", "placeholder value");

    const response = await fetch('/edit-DN', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            displayName: displayNameValue,
            // password: passwordValue,
            // bio: bioValue,
            // region: regionValue,
            // avatar: avatarValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('editResultMsg');


    if (responseData.success) {
        messageElement.textContent = "Display Name saved successfully!";
    } else {
        messageElement.textContent = "Error saving display name!";
    }
}

async function editBio(event) {
    event.preventDefault();

    // const passwordValue = document.getElementById('Password').value;
    // const displayNameValue = document.getElementById('DisplayName').value;
    const bioValue = document.getElementById('Bio').value;
    // const regionValue = document.getElementById('Region').value;
    // const avatarValue = document.getElementById('Avatar').value;

    // document.getElementById('DisplayName').setAttribute("placeholder", "placeholder value");

    const response = await fetch('/edit-bio', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            // displayName: displayNameValue,
            // password: passwordValue,
            bio: bioValue,
            // region: regionValue,
            // avatar: avatarValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('editResultMsg');


    if (responseData.success) {
        messageElement.textContent = "Bio saved successfully!";
    } else {
        messageElement.textContent = "Error saving bio!";
    }
}

async function editRegion(event) {
    event.preventDefault();

    // const passwordValue = document.getElementById('Password').value;
    // const displayNameValue = document.getElementById('DisplayName').value;
    // const bioValue = document.getElementById('Bio').value;
    const regionValue = document.getElementById('Region').value;
    // const avatarValue = document.getElementById('Avatar').value;

    // document.getElementById('DisplayName').setAttribute("placeholder", "placeholder value");

    const response = await fetch('/edit-region', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            // displayName: displayNameValue,
            // password: passwordValue,
            // bio: bioValue,
            region: regionValue,
            // avatar: avatarValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('editResultMsg');


    if (responseData.success) {
        messageElement.textContent = "Region saved successfully!";
    } else {
        messageElement.textContent = "Error saving region!";
    }
}

async function editAvatar(event) {
    event.preventDefault();

    // const passwordValue = document.getElementById('Password').value;
    // const displayNameValue = document.getElementById('DisplayName').value;
    // const bioValue = document.getElementById('Bio').value;
    // const regionValue = document.getElementById('Region').value;
    const avatarValue = document.getElementById('Avatar').value;

    // document.getElementById('DisplayName').setAttribute("placeholder", "placeholder value");

    const response = await fetch('/edit-avatar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            // displayName: displayNameValue,
            // password: passwordValue,
            // bio: bioValue,
            // region: regionValue,
            avatar: avatarValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('editResultMsg');


    if (responseData.success) {
        messageElement.textContent = "Avatar saved successfully!";
    } else {
        messageElement.textContent = "Error saving avatar!";
    }
}

async function displayRegionAndAvatarOptions() {
    const regionElement = document.getElementById('Region');
    const avatarElement = document.getElementById('Avatar');

    const regionResponse = await fetch('/allRegions', {
        method: 'GET'
    });

    const avatarResponse = await fetch('/allAvatarIDs', {
        method: 'GET'
    });

    const regionResponseData = await regionResponse.json();
    const avatarResponseData = await avatarResponse.json();
    const regionContent = regionResponseData.data;
    const avatarContent = avatarResponseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (regionElement.innerHTML) {
        regionElement.innerHTML = '';
    }

    if (avatarElement.innerHTML) {
        avatarElement.innerHTML = '';
    }

    regionContent.forEach(region => {
        const rOption = document.createElement('option');
        // button.style.height = '100px';
        // button.style.width = '280px';
        rOption.textContent = region;
        regionElement.appendChild(rOption);
        // containerElement.appendChild(document.createElement('br'));
    });

    avatarContent.forEach(avatar => {
        const aOption = document.createElement('option');
        // button.style.height = '100px';
        // button.style.width = '280px';
        aOption.textContent = avatar;
        avatarElement.appendChild(aOption);
        // containerElement.appendChild(document.createElement('br'));
    });
}

async function deleteAccount(event) {
    event.preventDefault();

    const response = await fetch('/delete-account', {
        method: 'POST'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('deleteResultMsg');


    if (responseData.success) {
        messageElement.textContent = "Account deleted successfully!";
        window.location.replace("ananyaCreateAccount.html");
    } else {
        messageElement.textContent = "Error deleting account!";
    }
}

// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    displayRegionAndAvatarOptions();
    document.getElementById("passwordForm").addEventListener("submit", editPassword);
    document.getElementById("dnForm").addEventListener("submit", editDN);
    document.getElementById("bioForm").addEventListener("submit", editBio);
    document.getElementById("regionForm").addEventListener("submit", editRegion);
    document.getElementById("avatarForm").addEventListener("submit", editAvatar);
    document.getElementById("deleteButton").addEventListener("click", deleteAccount);
}