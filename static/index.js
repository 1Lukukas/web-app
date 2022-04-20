async function doEverything() {
    const response = await fetch('/records/all')
    const data = await response.json()
    buildTable(data)
}

function buildTable(data){
    console.log(data.length)
    console.log("starting to build table")
    var table = document.getElementById('myTable')

    for (var i = 0; i < data.length; i++){
        console.log("adding rows")
        var row = `<tr>
                        <td>${data[i].amount}</td>
                        <td>${data[i].recordType}</td>
                        <td>${data[i].createdDate}</td>
                  </tr>`
        table.innerHTML += row
    }
}

doEverything()