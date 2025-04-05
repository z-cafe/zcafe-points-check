const pointUrl = 'https://script.google.com/macros/s/AKfycbwRZjtQWPdlpd4lrDqd7aQl6eLp1745BWPJ5wkAcL8GtVqikXCDJYVfTQ5ivW5mQ1iFgg/exec';
const recordUrl = 'https://script.google.com/macros/s/AKfycbyHGyVzcMn4QZ_jX3B61s7FErQzhq6FPBUirrVZVl6jq83ssCYZl9y4kjvxreCqXAc6Mg/exec';

function showPage(page) {
  const pointBtn = document.getElementById('pointBtn');
  const recordBtn = document.getElementById('recordBtn');
  const pointsPage = document.getElementById('pointsPage');
  const recordsPage = document.getElementById('recordsPage');

  if (page === 'points') {
    pointBtn.style.backgroundColor = '#888';
    pointBtn.style.color = 'white';
    recordBtn.style.backgroundColor = 'white';
    recordBtn.style.color = 'black';
    pointsPage.style.display = 'block';
    recordsPage.style.display = 'none';
  } else {
    pointBtn.style.backgroundColor = 'white';
    pointBtn.style.color = 'black';
    recordBtn.style.backgroundColor = '#888';
    recordBtn.style.color = 'white';
    pointsPage.style.display = 'none';
    recordsPage.style.display = 'block';
  }
}

function checkPoints() {
  const name = document.getElementById('nameInput').value.trim();
  const resultDiv = document.getElementById('result');
  if (!name) {
    resultDiv.innerHTML = '請輸入姓名或 LINE ID';
    return;
  }

  resultDiv.innerHTML = '查詢中...';

  fetch(`${pointUrl}?name=${encodeURIComponent(name)}`)
    .then(res => res.text())
    .then(data => {
      resultDiv.innerHTML = data;
    })
    .catch(err => {
      resultDiv.innerHTML = '發生錯誤，請稍後再試';
    });
}

function checkRecords() {
  const name = document.getElementById('recordInput').value.trim();
  const recordDiv = document.getElementById('recordResult');
  if (!name) {
    recordDiv.innerHTML = '請輸入姓名或 LINE ID';
    return;
  }

  recordDiv.innerHTML = '查詢中...';

  fetch(`${recordUrl}?name=${encodeURIComponent(name)}`)
    .then(res => res.text())
    .then(data => {
      recordDiv.innerHTML = data;
    })
    .catch(err => {
      recordDiv.innerHTML = '發生錯誤，請稍後再試';
    });
}
