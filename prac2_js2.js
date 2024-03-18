
//-----------------without pagination-------------------------------

fetch("https://api.coinlore.net/api/tickers/")
.then((data)=>{
  return data.json();
})
.then((objectData)=>{
  var data= objectData.data;
  console.log(objectData.data);
  let tableData="";
  var data2 =[];
  data.forEach(currency => {
    const newEntry = {
        "ID": currency.id,
        "Name": currency.name,
        "Rank": currency.rank,
        "PriceU": parseFloat(currency.price_usd),
        "PercentChange": parseFloat(currency.percent_change_24h),
        "PriceB": parseFloat(currency.price_btc),
        "MarketCap": parseFloat(currency.market_cap_usd),
        "Status": parseFloat(currency.msupply)
    };
    
    data2.push(newEntry);
});
console.log(data2);
const tableBody = document.getElementById("table_body");

tableBody.innerHTML = "";

data2.forEach(currency => {
    const newRow = document.createElement("tr");

    const checkboxCell = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkboxCell.appendChild(checkbox);
    newRow.appendChild(checkboxCell);

    Object.values(currency).forEach(value => {
        const newCell = document.createElement("td");
        newCell.textContent = value;
        newRow.appendChild(newCell);
    });

    tableBody.appendChild(newRow);
});
})
/*--------------------------------------------------*/
document.getElementById("selectAll").addEventListener("change", function() {
  let checkboxes = document.getElementsByTagName("input");
  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].type === "checkbox") {
      checkboxes[i].checked = this.checked;
    }
  }
});

//-----------------------searching--------------------------------------------//
document.getElementById("search-input").addEventListener("input", function() {
  let searchQuery = this.value.trim().toLowerCase();
  let rows = document.querySelectorAll("#myTable tbody tr");

  rows.forEach(row => {
      let found = false;
      row.querySelectorAll("td").forEach(cell => {
          if (cell.textContent.toLowerCase().includes(searchQuery)) {
              found = true;
          }
      });
      if (found) {
          row.style.display = "";
      } else {
          row.style.display = "none";
      }
  });
});
//---------------------------------Sorting------------------------------------------------//


document.addEventListener("DOMContentLoaded", function() {

  var headers = document.querySelectorAll("#myTable th");
  headers.forEach(function(header, index) {
    header.addEventListener("click", function() {
      if (header.classList.contains('asc')) {
        sortTableDesc(index);
        updateHeaderArrows(header, 'desc');
      } else {
        sortTableAsc(index);
        updateHeaderArrows(header, 'asc');
      }
    });
  });
});

function sortTableAsc(columnIndex) {
  var table, rows, switching, i, shouldSwitch;
  table = document.getElementById("myTable");
  switching = true;

  while (switching) {

    switching = false;
    rows = table.rows;

    for (i = 1; i < (rows.length - 1); i++) {

      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[columnIndex];
      y = rows[i + 1].getElementsByTagName("TD")[columnIndex];
      
    // if(typeof x.innerText === 'string' || x.innerText instanceof String){
      // if (parseInt(x.innerText.toLowerCase()[0]) > parseInt(y.innerText.toLowerCase()[0])) {
      //   shouldSwitch = true;
      //   break;
      // }
    // }

 
      if(columnIndex == 2){
        if(x.innerHTML[0] > y.innerHTML[0]){
          shouldSwitch = true;
          break;
        }
        // console.log(x.innerHTML);
      }
    
      if (parseFloat(x.innerHTML) > parseFloat(y.innerHTML)) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
  document.getElementById("myTable").querySelectorAll('th').forEach(function(th) {
    th.classList.remove('asc', 'desc');
  });
  document.getElementById("myTable").querySelectorAll('th')[columnIndex].classList.add('asc');
}

function sortTableDesc(columnIndex) {
  var table, rows, switching, i, shouldSwitch;
  table = document.getElementById("myTable");
  switching = true;
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[columnIndex];
      y = rows[i + 1].getElementsByTagName("TD")[columnIndex];

      if(columnIndex == 2){
        if(x.innerHTML[0] < y.innerHTML[0]){
          shouldSwitch = true;
          break;
        }
        // console.log(x.innerHTML);
      }


      if (parseFloat(x.innerHTML) < parseFloat(y.innerHTML)) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
  document.getElementById("myTable").querySelectorAll('th').forEach(function(th) {
    th.classList.remove('asc', 'desc');
  });
  document.getElementById("myTable").querySelectorAll('th')[columnIndex].classList.add('desc');
}

function updateHeaderArrows(clickedHeader, direction) {
  var headers = document.querySelectorAll("#myTable th");
  var arrow = direction === 'asc' ? " ▲" : " ▼"; 
  headers.forEach(function(header) {
    if (header !== clickedHeader) {
      header.innerHTML = header.innerHTML.replace(" ▲", "").replace(" ▼", ""); 
    }
  });
  clickedHeader.innerHTML = clickedHeader.innerHTML.replace(" ▲", "").replace(" ▼", "") + arrow; 
}









 
