function checkRecords() {
  const name = document.getElementById('recordInput').value.trim();
  const recordDiv = document.getElementById('recordResult');
  if (!name) {
    recordDiv.innerHTML = '請輸入姓名或 LINE ID';
    return;
  }

  recordDiv.innerHTML = '查詢中...';

  const callbackName = "jsonpCallback_" + Date.now();
  
  // 定義全域 callback 函式，用來接收 JSONP 回傳資料
  window[callbackName] = function(data) {
    if (!data || data.length === 0) {
      recordDiv.innerHTML = "查無資料";
    } else {
      let html = "";
      data.forEach(item => {
        html += `<div style="margin-bottom: 20px; border: 1px solid #ccc; padding: 10px;">`;
        html += `<div>日期：${item.date ? item.date : "無"}</div>`;
        html += `<div>扣款內容：${item.content ? item.content : "無"}</div>`;
        html += `<div>扣款金額：${item.amount ? item.amount : "無"}</div>`;
        html += `<div>點數餘額：${item.balance ? item.balance : "無"}</div>`;
        html += `</div>`;
      });
      recordDiv.innerHTML = html;
    }
    document.body.removeChild(script);
    delete window[callbackName];
  };

  const script = document.createElement('script');
  script.src = `${recordUrl}?name=${encodeURIComponent(name)}&callback=${callbackName}`;
  document.body.appendChild(script);
}
