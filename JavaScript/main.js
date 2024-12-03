var siteNameInput = document.querySelector(".siteName input");
var siteUrlInput = document.querySelector(".url input");
var submitBtn = document.querySelector("input[type='submit']");
var tableBody = document.querySelector("tbody");

// Function to show alert modal
function showAlert(message) {
  var alertModal = document.getElementById("alertModal");
  var alertMessage = document.getElementById("alertMessage");
  alertMessage.textContent = message;
  alertModal.style.display = "block";
}

// Function to close alert modal
function closeAlert() {
  var alertModal = document.getElementById("alertModal");
  alertModal.style.display = "none";
}

function addBookmark(name, url) {
  var row = document.createElement("tr");
  row.innerHTML = `
    <td>${tableBody.rows.length + 1}</td>
    <td>${name}</td>
    <td>
      <button type="button" class="btn btn-info text-white" onclick="window.open('${url}', '_blank')">
        <i class="fa-solid fa-eye pe-2"></i> Visit
      </button>
    </td>
    <td>
      <button type="button" class="btn btn-info bg-danger text-white" onclick="deleteBookmark(this)">
        <i class="fa-solid fa-trash-can"></i> Delete
      </button>
    </td>
  `;
  tableBody.appendChild(row);
}

function saveBookmarks(bookmarks) {
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

function deleteBookmark(button) {
  var row = button.parentElement.parentElement;
  row.remove();
  updateLocalStorage();
}

function updateLocalStorage() {
  var rows = tableBody.querySelectorAll("tr");
  var bookmarks = [];

  rows.forEach(function (row) {
    var cells = row.querySelectorAll("td");
    var name = cells[1].textContent;
    var url = cells[2].querySelector("button").onclick.toString().split("'")[1];
    bookmarks.push({ name: name, url: url });
  });

  saveBookmarks(bookmarks);
}

function loadBookmarks() {
  var storedBookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  if (storedBookmarks) {
    storedBookmarks.forEach(function (bookmark) {
      addBookmark(bookmark.name, bookmark.url);
    });
  }
}

function isValidUrl(url) {
  var regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return regex.test(url);
}

submitBtn.addEventListener("click", function (event) {
  event.preventDefault();

  var name = siteNameInput.value.trim();
  var url = siteUrlInput.value.trim();

  if (name && url) {
    if (isValidUrl(url)) {
      addBookmark(name, url);
      var bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
      bookmarks.push({ name: name, url: url });
      saveBookmarks(bookmarks);
      siteNameInput.value = "";
      siteUrlInput.value = "";
    } else {
      showAlert("Site name must contain at least 3 character.");
    }
  } else {
    showAlert(" Site URL must be a valid one .");
  }
});

loadBookmarks();
