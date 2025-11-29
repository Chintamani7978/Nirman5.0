function previewPhoto(event) {
    const file = event.target.files[0];
    const img = document.getElementById("profileImage");
    const text = document.getElementById("addText");

    if (file) {
        img.src = URL.createObjectURL(file);
        img.style.display = "block";
        text.style.display = "none";
    }
}