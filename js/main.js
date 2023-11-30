const apiUrl = 'https://m9app.online/9x/app/php/spiski.php';
const corsAnywhereUrl = 'https://cors-anywhere.herokuapp.com/';

document.addEventListener("DOMContentLoaded", function() {
  displayData();
  closeModal();
});

async function displayData() {
  const deliveryBlock = document.getElementById('deliveryMethodBlock');
  const data = await fetchData();

  deliveryBlock.innerHTML = '';

  Object.entries(data).forEach(([listName, listItems]) => {
    const listBlock = document.createElement('div');
    listBlock.classList.add('list-block');

    const title = document.createElement('h2');
    title.textContent = listName;
    listBlock.appendChild(title);

    const list = document.createElement('div');
    list.classList.add('list');
    const listItemDiv = document.createElement('div');

    Object.entries(listItems).forEach(([key, value]) => {
      const listItem = document.createElement('div');
      listItem.classList.add('list-div');
      listItem.textContent = `${value}`;
      const div = document.createElement('div');

      div.innerHTML += `<button onclick="openModal('${listName}', '${key}', '${value}')">Изменить</button>`;
      div.innerHTML += `<button onclick="sendDeleteData('${listName}', '${key}')">Удалить</button>`;
      listItem.appendChild(div);
      listItemDiv.appendChild(listItem);
      list.appendChild(listItemDiv);
    });

    const divButton = document.createElement('div');
    divButton.classList.add('list-divButton');
    divButton.innerHTML += `<button onclick="openModal('${listName}')">Добавить</button>`;
    list.appendChild(divButton);
    listBlock.appendChild(list);
    deliveryBlock.appendChild(listBlock);
  });
}

async function fetchData() {
  try {
    const response = await fetch(apiUrl, { method: 'GET' });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка:', error);
  }
}

async function sendPostData(table, name) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ table, name }),
    });
    const result = await response.json();
    console.log(result);
    displayData();
  } catch (error) {
    console.error('Ошибка:', error);
  }
}

async function sendPatchData(table, name, ID) {
  try {
    const response = await fetch(corsAnywhereUrl + apiUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ table, name, ID }),
    });
    const result = await response.json();
    console.log(result);
    displayData();
  } catch (error) {
    console.error('Ошибка:', error);
  }
}

async function sendDeleteData(table, ID) {
try {
  const response = await fetch(corsAnywhereUrl + apiUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ table, ID }),
  });
  const result = await response.json();
  console.log(result);
  displayData();
} catch (error) {
  console.error('Ошибка:', error);
}
}

function openModal(table, key = '', value = '') {
  const modal = document.getElementById('modal');
  modal.style.display = 'flex';

  const tableInput = document.getElementById('table');
  tableInput.value = table;

  const nameInput = document.getElementById('name');
  nameInput.value = value;

  const submitButton = document.getElementById('submitButton');
  submitButton.textContent = key ? 'Сохранить' : 'Отправить';

  const modalTitle = document.getElementById('modalTitle');
  modalTitle.textContent = key ? 'Изменить элемент' : 'Добавить элемент';

  submitButton.onclick = function(event) {
    event.preventDefault();
    if (key) {
      sendPatchData(tableInput.value, nameInput.value, key);
    } else {
      sendPostData(tableInput.value, nameInput.value);
    }
    closeModal();
  };
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
}