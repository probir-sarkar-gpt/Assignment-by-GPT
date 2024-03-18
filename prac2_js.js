fetch("https://api.coinlore.net/api/tickers/")
  .then((data) => {
    return data.json();
  })
  .then((objectData) => {
    var originalData = objectData.data;
    var data2 = [];
    originalData.forEach((currency) => {
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

    const tableBody = document.getElementById("table_body");

    // Function to display data for a specific page
    function displayPageData(page, data) {
      tableBody.innerHTML = "";
      const startIndex = (page - 1) * 10;
      const endIndex = startIndex + 10;
      const currentPageData = data.slice(startIndex, endIndex);
      currentPageData.forEach(currency => {
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
    }

    // Pagination logic
    let totalPages = Math.ceil(data2.length / 10);
    let currentPage = 1;
    generatePagination(totalPages, currentPage);
    displayPageData(currentPage, data2);

    function generatePagination(totalPages, currentPage) {
      var pager = document.getElementById('pager');
      var ul = document.createElement('ul');
      ul.classList.add('pg-pager');
      // Add previous page button
      var prevPage = currentPage > 1 ? currentPage - 1 : 1;
      var prevLi = createPagerItem('Prev', prevPage, currentPage === 1);
      ul.appendChild(prevLi);

      // Add pages around current page
      for (var i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
        ul.appendChild(createPagerItem(i, i, i === currentPage));
      }

      // Add next page button
      var nextPage = currentPage < totalPages ? currentPage + 1 : totalPages;
      var nextLi = createPagerItem('Next', nextPage, currentPage === totalPages);
      ul.appendChild(nextLi);

      // Replace existing pager with generated one
      pager.innerHTML = '';
      pager.appendChild(ul);
    }

    // Helper function to create pagination item
    function createPagerItem(text, page, isActive, isDisabled) {
      var li = document.createElement('li');
      li.classList.add('pg-item');
      if (isActive) {
        li.classList.add('pg-active');
      }
      if (isDisabled) {
        li.classList.add('pg-disabled');
      }
      var a = document.createElement('a');
      a.classList.add('pg-link');
      a.href = '#';
      a.textContent = text;
      a.dataset.page = page;
      li.appendChild(a);
      return li;
    }

    // Event listener for pagination click
    document.getElementById('pager').addEventListener('click', function (event) {
      var target = event.target;
      if (target.classList.contains('pg-link')) {
        var page = parseInt(target.dataset.page);
        // Display data for the clicked page
        displayPageData(page, data2);
        // Update pagination
        generatePagination(totalPages, page);
      }
    });

    // Select all checkboxes functionality
    document.getElementById("selectAll").addEventListener("change", function () {
      let checkboxes = document.querySelectorAll("#table_body input[type='checkbox']");
      checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
      });
    });
    // Searching functionality
    document.getElementById("search-input").addEventListener("input", function () {
      let searchQuery = this.value.trim().toLowerCase();
      let filteredData = data2.filter(currency => {
        return Object.values(currency).some(value => {
          return typeof value === 'string' && value.toLowerCase().includes(searchQuery);
        });
      });
      displayFilteredData(filteredData);
    });
    function displayFilteredData(filteredData) {
      totalPages = Math.ceil(filteredData.length / 10);
      displayPageData(1, filteredData);
      generatePagination(totalPages, 1);
    }

// Sorting functionality
document.querySelectorAll("#myTable th").forEach(function (header, index) {
  header.addEventListener("click", function () {
    if (header.classList.contains('asc')) {
      sortTableDesc(index);
      updateHeaderArrows(header, 'desc');
    } else {
      sortTableAsc(index);
      updateHeaderArrows(header, 'asc');
    }
  });
});

function sortTableAsc(columnIndex) {
  var table, switching, i, shouldSwitch;
  table = document.getElementById("myTable");
  switching = true;

  while (switching) {
    switching = false;
    var rows = table.rows;
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      var x = rows[i].getElementsByTagName("TD")[columnIndex];
      var y = rows[i + 1].getElementsByTagName("TD")[columnIndex];
      if (compareTableData(x, y)) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
  resetHeaderClasses();
  table.querySelectorAll('th')[columnIndex].classList.add('asc');
}

function sortTableDesc(columnIndex) {
  var table, switching, i, shouldSwitch;
  table = document.getElementById("myTable");
  switching = true;
  while (switching) {
    switching = false;
    var rows = table.rows;
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      var x = rows[i].getElementsByTagName("TD")[columnIndex];
      var y = rows[i + 1].getElementsByTagName("TD")[columnIndex];
      if (!compareTableData(x, y)) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
  resetHeaderClasses();
  table.querySelectorAll('th')[columnIndex].classList.add('desc');
}

function updateHeaderArrows(clickedHeader, direction) {
  var headers = document.querySelectorAll("#myTable th");
  var arrow = direction === 'asc' ? " ▲" : " ▼";
  headers.forEach(function (header) {
    if (header !== clickedHeader) {
      header.innerHTML = header.innerHTML.replace(" ▲", "").replace(" ▼", "");
    }
  });
  clickedHeader.innerHTML = clickedHeader.innerHTML.replace(" ▲", "").replace(" ▼", "") + arrow;
}

function compareTableData(x, y) {
  if (!isNaN(parseFloat(x.innerHTML)) && !isNaN(parseFloat(y.innerHTML))) {
    return parseFloat(x.innerHTML) > parseFloat(y.innerHTML);
  } else {
    return x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase();
  }
}

function resetHeaderClasses() {
  document.querySelectorAll("#myTable th").forEach(function (th) {
    th.classList.remove('asc', 'desc');
  });
}
  });