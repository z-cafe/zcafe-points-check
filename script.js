const pointUrl = 'https://script.google.com/macros/s/AKfycbzx3t6ktbHZMUBGzGsKyfPnI3jyngSTA60NuoMnOlczJf4Eq_SckJp0eAbDaQEhIRNZdA/exec'; 
const recordUrl = 'https://script.google.com/macros/s/AKfycbzIktMLmiiJlANmXjPE-up8EGNiUD1PwJbAFT-Ffr3iu0i-NAQ77SOIzTF7I0VTHYcCYA/exec'; 

function checkAll() {
  const userInput = document.getElementById('userInput').value.trim();
  const pointsDiv = document.getElementById('pointsResult');
  const recordsDiv = document.getElementById('recordsResult');

  if (!userInput) {
    pointsDiv.innerHTML = '請輸入姓名、電話或 LINE ID';
    recordsDiv.innerHTML = '';
    return;
  }

  pointsDiv.innerHTML = '查詢中...';
  recordsDiv.innerHTML = '查詢中...';

  // 會員點數查詢 (使用 fetch 並解析 JSON 回傳資料)
  fetch(`${pointUrl}?name=${encodeURIComponent(userInput)}`)
    .then(res => res.text())
    .then(data => {
      console.log("點數查詢回傳資料:", data);
      try {
        let obj = JSON.parse(data);
        // 修改顯示格式：第一行顯示 姓名：，第二行顯示 會員點數：
        pointsDiv.innerHTML = `<div class="points-box">
          <p>姓名：${obj.name || "無"}</p>
          <p>會員點數：${obj.point || "無"}</p>
        </div>`;
      } catch(e) {
        console.error("JSON 解析錯誤:", e);
        pointsDiv.innerHTML = '回傳資料解析錯誤';
      }
    })
    .catch(err => {
      console.error("fetch 錯誤:", err);
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

// 掛載全域，確保 HTML 中的 inline onclick 可以存取
window.checkAll = checkAll;
