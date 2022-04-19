function submitResult() {
    var record = document.getElementById('record');
    console.log(record.options[record.selectedIndex].value);

    var amount = document.getElementById('amount');
    console.log(amount.value);
}