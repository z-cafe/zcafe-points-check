const pointUrl = 'https://script.google.com/macros/s/AKfycbwRZjtQWPdlpd4lrDqd7aQl6eLp1745BWPJ5wkAcL8GtVqikXCDJYVfTQ5ivW5mQ1iFgg/exec'; 
const recordUrl = 'https://script.google.com/macros/s/AKfycbyERAuZl5ktVMso7o5PDESxcCxU6MXxaVqDHZyyqwXlM5S8BNVmtahw-wQkjxc_Pp_5Rg/exec'; 

function checkAll() {
  const userInput = document.getElementById('userInput').value.trim();
  const pointsDiv = document.getElementById('pointsResult');
  const recordsDiv = document.getElementById('recordsResult');

  if (!userInput) {
    pointsDiv.innerHTML = '請輸入姓名、電話或 LINE ID';
    recordsDiv.innerHTML = '';
    return;
  }

  // 清空舊資料，顯示查詢中...
  pointsDiv.innerHTML = '查詢中...';
  recordsDiv.innerHTML = '查詢中...';

  // 會員點數查詢 (使用 fetch)
  fetch(`${pointUrl}?name=${encodeURIComponent(userInput)}`)
    .then(res => res.text())
    .then(data => {
      // 假設回傳的是點數文字
      pointsDiv.innerHTML = `<div class="points-box">目前點數：${data}</div>`;
    })
    .catch(err => {
      pointsDiv.innerHTML = '發生錯誤，請稍後再試';
    });

  // 扣款紀錄查詢 (使用 JSONP)
  const callbackName = "jsonpCallback_" + Date.now();
  let script = document.createElement('script');
  script.src = `${recordUrl}?name=${encodeURIComponent(userInput)}&callback=${callbackName}`;

  window[callbackName] = function(data) {
    console.log("JSONP callback invoked:", data);
    if (!data || data.length === 0) {
      recordsDiv.innerHTML = "查無扣款紀錄";
    } else {
      let html = `<div class="records-box">`;
      data.forEach(item => {
        html += `<p>日期：${item.date ? item.date : "無"}</p>`;
        html += `<p>扣款內容：${item.content ? item.content : "無"}</p>`;
        html += `<p>扣款金額：${item.amount ? item.amount : "無"}</p>`;
        html += `<p>點數餘額：${item.balance ? item.balance : "無"}</p>`;
        html += `<hr/>`;
      });
      html += `</div>`;
      recordsDiv.innerHTML = html;
    }
    if (script.parentNode) {
      document.body.removeChild(script);
    }
    delete window[callbackName];
  };

  document.body.appendChild(script);
  console.log("JSONP 請求已發出，URL =", script.src);
}
