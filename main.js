
var _ = require('lodash');

var fs = require('fs-extra');

var consistency = {};

var sorted = [];

var topViews = [];

var consistencyOrder = {};

function tabularize(arr) {
	var col_size = []
	arr.forEach(function(row){
		row.forEach(function(v, i) {
			col_size[i] = col_size[i] || 0;
			var len = (v + "").length;
			if (len > col_size[i])  col_size[i] = len;
		});
	});

	arr.forEach(function(row, i) {
		row.forEach(function(v,i) {
			row[i] = _.padEnd(v + "", col_size[i]);
		});
		arr[i] = _.trimEnd(row.join(" | "));
	});
	return arr.join("\n");
}

function parseFile(data) {
	var tuples = [];
	data.split("\n").forEach(function(line){
		var columns = line.split(" ");
		if (columns[1] && columns[1].length > 2 && columns.length == 4) {
			var name = columns[1];
			var views = columns[2];
			if (!name.match(/(Main_Page|Special\:.+|Wikipedia\:.+)/)) {
				tuples.push({
					name: name + " (" + views + ")", views: (views*1)
				});
			}
		}
	});
	return tuples;

}

function viewSorter(a , b) {
	if (a.views < b.views) return true;
	if (a.views > b.views) return false;

	if (a.name > b.name) return true;
	else return false;
}

function countSorter(a , b) {
	if (a.count < b.count) return true;
	if (a.count > b.count) return false;

	if (a.views < b.views) return true;
	if (a.views > b.views) return false;

	if (a.name > b.name) return true;
	else return false;
}

function orderSorter(a , b) {
	if (a.order > b.order) return true;
	if (a.order < b.order) return false;

	if (a.views < b.views) return true;
	if (a.views > b.views) return false;

	if (a.name > b.name) return true;
	else return false;
}

function addTopViews(tuples) {
	topViews = tuples.sort(viewSorter);
}

function topPageViews(n) {
	return _.slice(topViews, 0, n);
}

function aggregateConsistencyCount(tuples) {
	for(var i in tuples) {
		if (consistency[tuples[i].name]) {
			consistency[tuples[i].name].count += 1;
			consistency[tuples[i].name].views += tuples[i].views;
		} else {
			consistency[tuples[i].name] = {
				name: tuples[i].name, 
				count: 1, 
				views: tuples[i].views
			};
		}
	}
}

function orderConsistency() {
	sorted = _.values(consistency).sort(countSorter);
	for (var i in sorted) {
		consistencyOrder[sorted[i].name] = i;
	}
}

function topConsistent(n) {
	var m = n*5;
	var data = [];
	for (var i =0 ; i < m; i++) {
		data.push({name: topViews[i].name});
	}
	for (var i =0 ; i < m; i++) {
		data[i].order = consistencyOrder[data[i].name];
	}
	var dataSorted = data.sort(orderSorter);

	return _.slice(dataSorted, 0, n);
}

function display(viewOrder, consistentOrder) {
	if (viewOrder.length != consistentOrder.length) {
		console.log("Both orders not same");
		return;
	}
	var data = [];
	var a = [], b = [];
	data.push(["Order","View Order", "Consistent Order"]);
	for (var i=0; i < viewOrder.length; i++) {
		data.push([i+1, viewOrder[i].name, consistentOrder[i].name]);
		a.push(viewOrder[i].name);
		b.push(consistentOrder[i].name);
	}
	console.log(tabularize(data));
	console.log(_.difference(a,b).length);
}

function getHour(fileName) {
	var matches = fileName.match(/-([0-9][0-9])[0-9]+\.en/);
	return matches[1]*1;
}

const viewHour = process.argv[2]*1;
const consistentHours = process.argv[3]*1;

fs.readdir('sample').then(function(items) {
	var viewData;
	for(var i in items) {
		var hour = getHour(items[i]);
		var data = fs.readFileSync('sample/' + items[i]).toString();
		if (hour == viewHour) viewData = data;
		if (hour <= viewHour && hour > (viewHour - consistentHours)) aggregateConsistencyCount(parseFile(data.toString()));
	}
	addTopViews(parseFile(data.toString()));

	orderConsistency();

	//console.log(consistencyOrder);
	display(topPageViews(20), topConsistent(20));
});
