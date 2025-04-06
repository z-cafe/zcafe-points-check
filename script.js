const pointUrl = 'https://script.google.com/macros/s/AKfycbwRZjtQWPdlpd4lrDqd7aQl6eLp1745BWPJ5wkAcL8GtVqikXCDJYVfTQ5ivW5mQ1iFgg/exec'; 
const recordUrl = 'https://script.google.com/macros/s/AKfycbyERAuZl5ktVMso7o5PDESxcCxU6MXxaVqDHZyyqwXlM5S8BNVmtahw-wQkjxc_Pp_5Rg/exec'; 

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

  // 點數查詢仍使用 fetch (後端已正確設定 CORS 標頭)
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

  // 使用 JSONP 避免 CORS 問題
  const callbackName = "jsonpCallback_" + Date.now();
  
  // 定義全域 callback 函式，接收 JSONP 回傳資料
  window[callbackName] = function(data) {
    recordDiv.innerHTML = JSON.stringify(data);
    document.body.removeChild(script);
    delete window[callbackName];
  };

  const script = document.createElement('script');
  script.src = `${recordUrl}?name=${encodeURIComponent(name)}&callback=${callbackName}`;
  document.body.appendChild(script);
}
