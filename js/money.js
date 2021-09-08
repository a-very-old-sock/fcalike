var ctx = document.getElementById("money_chart").getContext('2d');

var income_record = localStorage.getItem("income_record");
income_array = (income_record) ? JSON.parse(income_record) : [];
var label_array = []
income_array.forEach((item, i) => {
  label_array.push(i)
});

var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: label_array,
        datasets: [{
            label: 'Income',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: income_array,
            fill: false
        }]
    },

    // Configuration options go here
    options: {
				responsive: true,
				// title: {
				// 	display: true,
				// 	text: 'Chart.js Line Chart'
				// },
				tooltips: {
					mode: 'index',
					intersect: false,
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Week'
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Income'
						},
            // ticks: {
            //   stepSize: 1
            // }
					}]
				}
			}
});

function showSlaveSaleList() {
  $("#slave_price_list").empty();
  $("#slave_price_list").append("<table class='table'><thead><th>Name</th><th>Purchase Price</th><th>Estimated Sale Price</th><th></th></thead><tbody id='sale_list_start'></tbody></table>");
  var slaves = JSON.parse(localStorage.getItem("slaves"))
  slaves.forEach((slave, i) => {
    calculatePrice(slave)
    $("#sale_list_start").append("<tr><td>" + slave.name + "</td><td>" + slave.purchased + "</td><td>" + slave.price + "</td><td><button id='btn-" + slave.name + i + "' onclick='sellSlave("+ slave.id + ")' type='button' class='btn btn-sm btn-secondary'>Sell</td></tr>");
  });
  localStorage.setItem("slaves", JSON.stringify(slaves))
}
