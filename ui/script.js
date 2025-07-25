<script>
  const sectionContainer = document.getElementById("sectionContainer");
  const newSectionBtn = document.getElementById("newSectionBtn");

  let sectionCount = 1;

  newSectionBtn.addEventListener("click", () => {
    sectionCount++;
    const newSection = document.createElement("div");
    newSection.className = "section-item mt-1";
    newSection.innerHTML = `
      <div class="color-bar" style="background-color: #${Math.floor(Math.random()*16777215).toString(16)};"></div>
      Untitled Section ${sectionCount}
    `;
    newSection.addEventListener("click", () => {
      loadNoteEditor(`Untitled Section ${sectionCount}`);
    });
    sectionContainer.appendChild(newSection);
  });

  function loadNoteEditor(title) {
    const titleInput = document.querySelector(".note-title");
    const contentArea = document.querySelector(".note-content");

    titleInput.value = title;
    contentArea.value = "";
    titleInput.focus();
  }
</script>
