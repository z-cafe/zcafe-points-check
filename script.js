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

  const callbackName = "jsonpCallback_" + Date.now();
  let script = document.createElement('script');
  script.src = `${recordUrl}?name=${encodeURIComponent(name)}&callback=${callbackName}`;

  window[callbackName] = function(data) {
    console.log("JSONP callback invoked:", data);
    if (!data || data.length === 0) {
      recordDiv.innerHTML = "查無資料";
    } else {
      let html = "";
      data.forEach(item => {
        html += `<div style="margin-bottom: 15px; border: 1px solid #ccc; padding: 10px;">`;
        html += `<p>日期：${item.date ? item.date : "無"}</p>`;
        html += `<p>扣款內容：${item.content ? item.content : "無"}</p>`;
        html += `<p>扣款金額：${item.amount ? item.amount : "無"}</p>`;
        html += `<p>點數餘額：${item.balance ? item.balance : "無"}</p>`;
        html += `</div>`;
      });
      recordDiv.innerHTML = html;
    }
    if (script.parentNode) {
      document.body.removeChild(script);
    }
    delete window[callbackName];
  };

  document.body.appendChild(script);
  console.log("JSONP 請求已發出，URL =", script.src);
}

// 將所有函式掛載到全域，確保 HTML 中的 inline onclick 可以存取
window.showPage = showPage;
window.checkPoints = checkPoints;
window.checkRecords = checkRecords;
