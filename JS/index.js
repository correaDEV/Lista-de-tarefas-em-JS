const texto = document.querySelector('.textInsert');
const btnInsert = document.querySelector('.divInsert button');
const btnDeleteAll = document.querySelector('.btnDeleteAll');
const ul = document.querySelector('ul');
const filter = document.getElementById('filter');

let itensDB = [];

btnDeleteAll.onclick = () => {
  itensDB = [];
  updateDB();
};

texto.addEventListener('keypress', e => {
  if (e.key === 'Enter' && texto.value !== '') {
    setItemDB();
  }
});

btnInsert.onclick = () => {
  if (texto.value !== '') {
    setItemDB();
  }
};

filter.onchange = () => {
  loadItens();
};

function setItemDB() {
  if (itensDB.length >= 20) {
    alert('Limite máximo de 20 itens atingido!');
    return;
  }

  itensDB.push({ 'item': texto.value, 'status': '', 'date': new Date().toLocaleString() });
  updateDB();
}

function updateDB() {
  localStorage.setItem('todolist', JSON.stringify(itensDB));
  loadItens();
}

function loadItens() {
  ul.innerHTML = "";
  itensDB = JSON.parse(localStorage.getItem('todolist')) ?? [];
  const filterValue = filter.value;

  itensDB.forEach((item, i) => {
    if (filterValue === 'all' || (filterValue === 'completed' && item.status === 'checked') || (filterValue === 'pending' && item.status === '')) {
      insertItemTela(item.item, item.status, item.date, i);
    }
  });
}

function insertItemTela(text, status, date, i) {
  const li = document.createElement('li');

  li.innerHTML = `
    <div class="divLi">
      <input type="checkbox" ${status} data-i=${i} onchange="done(this, ${i});" />
      <span data-si=${i}>${text}</span>
      <span class="date">${date}</span>
      <button onclick="editItem(${i})" data-i=${i}><i class='bx bx-edit'></i></button>
      <button onclick="removeItem(${i})" data-i=${i}><i class='bx bx-trash'></i></button>
    </div>
    <div class="editing" data-editing=${i} style="display: none;">
      <input type="text" value="${text}">
      <button onclick="confirmEdit(${i})">Salvar</button>
      <button onclick="cancelEdit(${i})">Cancelar</button>
    </div>
  `;
  ul.appendChild(li);

  if (status) {
    document.querySelector(`[data-si="${i}"]`).classList.add('line-through');
  } else {
    document.querySelector(`[data-si="${i}"]`).classList.remove('line-through');
  }

  texto.value = '';
}

function done(chk, i) {
  itensDB[i].status = chk.checked ? 'checked' : '';
  updateDB();
}

function removeItem(i) {
  itensDB.splice(i, 1);
  updateDB();
}

function editItem(i) {
  document.querySelector(`[data-editing="${i}"]`).style.display = 'flex';
  document.querySelector(`[data-si="${i}"]`).parentElement.style.display = 'none';
}

function confirmEdit(i) {
  const newText = document.querySelector(`[data-editing="${i}"] input`).value;
  itensDB[i].item = newText;
  updateDB();
}

function cancelEdit(i) {
  document.querySelector(`[data-editing="${i}"]`).style.display = 'none';
  document.querySelector(`[data-si="${i}"]`).parentElement.style.display = 'flex';
}

loadItens();
