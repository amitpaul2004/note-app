// Toolbar toggle
function toggleHomeToolbar() {
  document.getElementById('homeToolbar').classList.toggle('d-none');
}

// Sidebar toggle
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
}

// Notebook dropdown
function toggleNotebookDropdown() {
  const list = document.getElementById('sectionList');
  const arrow = document.getElementById('notebookArrow');
  list.classList.toggle('show');
  arrow.classList.toggle('rotate');
}

// Section and page data
const sectionColors = ['#ff6f61','#6b5b95','#88b04b','#f7cac9','#92a8d1'];
let sectionCount = 1, sectionData = {}, currentSectionId = null, currentPageIndex = null, timestampInserted = false;

// Section/page management
function addSection() {
  const id = `s-${Date.now()}`;
  const color = sectionColors[sectionCount % sectionColors.length];
  const html = `<div class="section-item" data-id="${id}">
    <div class="left">
      <div class="color-bar" style="background:${color}"></div>
      <input class="edit-input" value="Section ${sectionCount}" onclick="selectSection('${id}')"/>
    </div>
    <i class="bi bi-trash" onclick="deleteSection(this)"></i>
  </div>`;
  document.getElementById('sectionList').insertAdjacentHTML('beforeend', html);
  sectionData[id] = [{ title:'Untitled Page', content:'', timestamp:'' }];
  sectionCount++;
  selectSection(id);
}

function selectSection(id) {
  currentSectionId = id;
  const items = document.querySelectorAll('.section-item');
  items.forEach(el => el.classList.toggle('bg-secondary', el.dataset.id === id));
  renderPages();
}

function deleteSection(icon) {
  const div = icon.closest('.section-item');
  const id = div.dataset.id;
  if (confirm('Delete this section?')) {
    delete sectionData[id];
    div.remove();
    document.getElementById('pageList').innerHTML = '';
    document.getElementById('editor').innerHTML = '';
    currentSectionId = null;
  }
}

function renderPages() {
  const pages = sectionData[currentSectionId];
  const container = document.getElementById('pageList');
  container.innerHTML = `<div>
    <button class="btn btn-sm btn-add-page" onclick="addPage()">Add Page</button>
  </div>`;
  pages.forEach((p,i) => {
    const div = document.createElement('div');
    div.className = 'page-item';
    div.innerHTML = `${p.title}<i class="bi bi-x-lg delete-btn" onclick="deletePage(event,${i})"></i>`;
    div.onclick = () => loadPage(i);
    container.appendChild(div);
  });
}

function addPage() {
  sectionData[currentSectionId].push({ title:'Untitled Page', content:'', timestamp:'' });
  renderPages();
  loadPage(sectionData[currentSectionId].length - 1);
}

function deletePage(evt,i) {
  evt.stopPropagation();
  sectionData[currentSectionId].splice(i,1);
  renderPages();
  document.getElementById('editor').innerHTML = '';
}

function loadPage(i) {
  currentPageIndex = i;
  const p = sectionData[currentSectionId][i];
  document.getElementById('editor').innerHTML = p.content || 'Start typing...';
  document.getElementById('dateTimeDisplay').textContent = p.timestamp || (p.timestamp = new Date().toLocaleString());
  timestampInserted = !!p.timestamp;
}

// Rich text toolbar logic
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.font-select').onchange = function() {
    document.execCommand('fontName', false, this.value);
  };
  document.querySelector('.size-select').onchange = function() {
    const map = { "10":"1","12":"2","14":"3","16":"4","18":"5","20":"6","24":"7" };
    document.execCommand('fontSize', false, map[this.value]);
  };
  document.querySelector('.style-btn.fw-bold').onclick = () => document.execCommand('bold');
  document.querySelector('.style-btn.fst-italic').onclick = () => document.execCommand('italic');
  document.querySelector('.style-btn.text-decoration-underline').onclick = () => document.execCommand('underline');
  document.querySelector('.style-btn.text-decoration-line-through').onclick = () => document.execCommand('strikeThrough');

  document.getElementById('editor').oninput = function() {
    const lines = this.innerText.split('\n');
    const headline = lines[0] || 'Untitled Page';
    sectionData[currentSectionId][currentPageIndex].title = headline;
    sectionData[currentSectionId][currentPageIndex].content = this.innerHTML;
    renderPages();
  };

  addSection();
});
