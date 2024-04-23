function displayImage() {
  var fileInput = document.getElementById('fileInput');

  if (fileInput.files.length > 0) {
    var selectedFile = fileInput.files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
      var imgElement = document.createElement('img');
      imgElement.src = e.target.result;
      imgElement.alt = 'Selected Image';

      // Set the style of the image box
      imgElement.style.width = '100%';
      imgElement.style.display = 'block';

      document.getElementById('imageBox').innerHTML = '';
      document.getElementById('imageBox').appendChild(imgElement);

      // Display the file name
      document.getElementById('fileName').innerText = 'File Name: ' + selectedFile.name;
    };

    reader.readAsDataURL(selectedFile);
  } else {
    alert('Please select a file.');
  }
}

document.getElementById('detectButton').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    // Get objects
    var selectedObjects = [];
    var checkboxes = document.getElementsByClassName('objectCheckbox');
    var labels = document.getElementsByClassName('objectLabel');

    for (var i = 0; i < checkboxes.length; i++) {
      if (!checkboxes[i].checked) {
        selectedObjects.push(labels[i].innerText);
      }
    }

    // Print the selected objects to the console
    console.log('Selected Objects:', selectedObjects);
    if (!file) {
        alert('Please select an image file.');
        return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('selectedObjects', JSON.stringify(selectedObjects));
    try {
        const response = await fetch('/detect', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to detect objects.');
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        const img = new Image();
        img.src = imageUrl;
        img.onload = function() {
          const imageBox = document.getElementById('imageBox');
          imageBox.innerHTML = '';
          img.style.maxWidth = '100%';  // Set maximum width to 100%
          img.style.maxHeight = '100%';
          imageBox.appendChild(img);

          // Add download button
          const downloadButton = document.createElement('button');
          downloadButton.innerText = 'Download Image';
          downloadButton.onclick = function() {
            const a = document.createElement('a');
            a.href = imageUrl;
            a.download = 'analyzed_image.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };
          imageBox.appendChild(downloadButton);
        };


    } catch (error) {
        console.error(error);
        alert('An error occurred while detecting objects.');
    }
});
// Function to display the results in a table
// Function to display the results in a table
function displayResults(resultsData) {
  var tableContainer = document.getElementById('resultsTableContainer');
  tableContainer.innerHTML = ''; // Clear previous content

  var table = document.createElement('table');
  var thead = document.createElement('thead');
  var tbody = document.createElement('tbody');

  // Create table headers
  var headerRow = document.createElement('tr');
  var headers = ['Object', 'X Center', 'Y Center', 'Confidence'];
  headers.forEach(function(headerText) {
    var headerCell = document.createElement('th');
    headerCell.textContent = headerText;
    headerRow.appendChild(headerCell);
  });
  thead.appendChild(headerRow);

  // Loop through the results data and create table rows
  resultsData.forEach(function(rowData) {
    var row = document.createElement('tr');

    // Remove the fourth column of data
    rowData.splice(3, 1);

    rowData.forEach(function(cellData) {
      var cell = document.createElement('td');
      cell.textContent = cellData;
      row.appendChild(cell);
    });
    tbody.appendChild(row);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  tableContainer.appendChild(table);
}


document.getElementById('displayResultsButton').addEventListener('click', async () => {
  try {
      const response = await fetch('/display_stats', {
            method: 'POST'
        });
      console.log(response)
    // Assuming this is the endpoint that returns the text file data
    const textData = await response.text();
    const rows = textData.trim().split('\n'); // Split the text data into rows
    const resultsData = rows.map(row => row.split(' ')); // Split each row into cells
    displayResults(resultsData);
  } catch (error) {
    console.error(error);
    alert('An error occurred while fetching results.');
  }
});


// Function to dynamically generate checkbox list
function generateObjectList() {
  var objectListContainer = document.getElementById('objectListContainer');
  var objects = [
    "person", "bicycle", "car", "motorcycle", "bus",
    "train", "truck", "boat", "traffic light", "cat",
    "fire hydrant", "stop sign", "parking meter", "bench", "bird"
  ];

  var html = '';
  for (var i = 0; i < objects.length; i++) {
    html += '<input type="checkbox" class="objectCheckbox" id="object_' + i + '" checked> ' +
            '<label class="objectLabel" for="object_' + i + '">' + objects[i] + '</label>';
  }

  objectListContainer.innerHTML = html;
}
generateObjectList();
