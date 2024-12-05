const grid = document.getElementById("grid");
const addBookmarkBtn = document.getElementById("addBookmark");
const deleteBookmarkBtn = document.getElementById("deleteBookmark");
const bookmarkModal = document.getElementById("bookmarkModal");
const saveBookmarkBtn = document.getElementById("saveBookmark");
const cancelBookmarkBtn = document.getElementById("cancelBookmark");
const bookmarkName = document.getElementById("bookmarkName");
const bookmarkLink = document.getElementById("bookmarkLink");
const bookmarkImageInput = document.getElementById("bookmarkImage");
const dropZone = document.getElementById("dropZone");
const preview = document.getElementById("preview");
const showBookmarksBtn = document.getElementById("showBookmarks");
const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("closeModalBtn");
const bookmarksList = document.getElementById("bookmarksList");
const bookmarkCount = document.getElementById("bookmarkCount");

let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
let selectedCards = [];
let uploadedImage = null;


bookmarkModal.style.display = "none"; 


function renderBookmarks() {
    grid.innerHTML = ""; 

    bookmarks.forEach((bookmark, index) => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${bookmark.image}" alt="${bookmark.name}">
            <p>${bookmark.name}</p>
        `;

        card.addEventListener("click", () => handleBookmarkClick(index, card));

        if (selectedCards.includes(index)) {
            card.style.border = "2px solid red";
        }

        grid.appendChild(card);
    });
}


function handleBookmarkClick(index, card) {
    if (selectedCards.includes(index)) {
        
        window.open(bookmarks[index].link, '_blank');
    } else {
       
        selectedCards.push(index);
        card.style.border = "2px solid red"; 
    }
}


function renderBookmarksInModal() {
    bookmarksList.innerHTML = ""; 
    bookmarks.forEach((bookmark, index) => {
        const bookmarkItem = document.createElement("div");
        bookmarkItem.className = "bookmark-item";
        bookmarkItem.innerHTML = `
            <img src="${bookmark.image}" alt="${bookmark.name}" class="bookmark-image">
            <p>${bookmark.name}</p>
            <p><a href="${bookmark.link}" target="_blank">${bookmark.link}</a></p>
        `;
        bookmarksList.appendChild(bookmarkItem);
    });

    
    bookmarkCount.textContent = bookmarks.length;
}


function addBookmark() {
    const name = bookmarkName.value.trim();
    const link = bookmarkLink.value.trim();
    const image = uploadedImage;

    if (name && link && image) {
        bookmarks.push({ name, link, image });
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
        renderBookmarks(); 
        renderBookmarksInModal();  
        closeModal();
    } else {
        alert("Please fill in all fields!");
    }
}


function deleteBookmarks() {
    bookmarks = bookmarks.filter((_, index) => !selectedCards.includes(index));
    selectedCards = [];
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    renderBookmarks();  
    renderBookmarksInModal();  
}


function handleImageInput(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
        uploadedImage = event.target.result;
        preview.innerHTML = `<img src="${uploadedImage}" alt="Selected Image">`;
    };
    reader.readAsDataURL(file);
}


function openModal() {
    bookmarkModal.style.display = "flex"; 
}

function closeModal() {
    bookmarkModal.style.display = "none"; 
    bookmarkName.value = "";
    bookmarkLink.value = "";
    preview.innerHTML = "<p>No image selected</p>";
    uploadedImage = null;
}


function openBookmarksModal() {
    modal.style.display = "flex";
    renderBookmarksInModal();
}

function closeBookmarksModal() {
    modal.style.display = "none";
}


addBookmarkBtn.addEventListener("click", openModal); 
cancelBookmarkBtn.addEventListener("click", closeModal);
saveBookmarkBtn.addEventListener("click", addBookmark);
deleteBookmarkBtn.addEventListener("click", deleteBookmarks);
showBookmarksBtn.addEventListener("click", openBookmarksModal);  
closeModalBtn.addEventListener("click", closeBookmarksModal);

// Drag-and-drop events
dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.style.backgroundColor = "rgba(137, 83, 14 , 0)";
});

dropZone.addEventListener("dragleave", () => {
    dropZone.style.backgroundColor = "rgba(137, 83, 14, 0.1)";
});

dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.style.backgroundColor = "rgba(137, 83, 14, 0.1)";
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
        handleImageInput(file);
    }
});

// Trigger file input when clicking on drop zone
dropZone.addEventListener("click", () => {
    bookmarkImageInput.click();  
});

// File input event
bookmarkImageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
        handleImageInput(file);
    }
});

// Initial render
renderBookmarks();  // Render on page load (without opening the modal)
