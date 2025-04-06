const pointUrl = 'https://script.google.com/macros/s/AKfycbzl7YLoeE0h2Oib2Ud2-UhTNomoggXk_OBKHX-kXP-ORfAlxyGH_VZClDR9eqoQTfWc/exec';
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

  // ✅ 點數查詢 - JSONP
  const pointsCallback = "pointsCallback_" + Date.now();
  const pointScript = document.createElement('script');
  pointScript.src = `${pointUrl}?name=${encodeURIComponent(userInput)}&callback=${pointsCallback}`;

  window[pointsCallback] = function(obj) {
    console.log("點數 JSONP 回傳:", obj);
    pointsDiv.innerHTML = `<div class="points-box">
      <p>姓名：${obj.name || "無"}</p>
      <p>會員點數：${obj.point || "無"}</p>
    </div>`;
    if (pointScript.parentNode) document.body.removeChild(pointScript);
    delete window[pointsCallback];
  };
  document.body.appendChild(pointScript);

  // ✅ 扣款紀錄查詢 - JSONP
  const recordCallback = "recordCallback_" + Date.now();
  const recordScript = document.createElement('script');
  recordScript.src = `${recordUrl}?name=${encodeURIComponent(userInput)}&callback=${recordCallback}`;

  window[recordCallback] = function(data) {
    console.log("紀錄 JSONP 回傳:", data);
    if (!data || data.length === 0) {
      recordsDiv.innerHTML = "查無扣款紀錄";
    } else {
      let html = `<div class="records-box">`;
      data.forEach(item => {
        html += `<p>日期：${item.date || "無"}</p>`;
        html += `<p>扣款內容：${item.content || "無"}</p>`;
        html += `<p>扣款金額：${item.amount || "無"}</p>`;
        html += `<p>點數餘額：${item.balance || "無"}</p>`;
        html += `<hr/>`;
      });
      html += `</div>`;
      recordsDiv.innerHTML = html;
    }
    if (recordScript.parentNode) document.body.removeChild(recordScript);
    delete window[recordCallback];
  };
  document.body.appendChild(recordScript);
}

// 掛載全域
window.checkAll = checkAll;
