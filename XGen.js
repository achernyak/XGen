/*jslint browser: true */

function XGen() {
	'use strict';

	//allow the loading of an XML file to be parsed

	function loadXMLDoc(dname) {
		var xhttp;
		//option for IE
		if (window.XMLHttpRequest) {
			xhttp = new XMLHttpRequest();
		} else {
			xhttp = new window.ActiveXObject("Microsoft.XMLHTTP");
		}
		xhttp.open("GET", dname, false);
		xhttp.send(null);
		return xhttp.responseXML;
	}

	//appends element and xpath to a table

	function tableAppend(table, elem, xpath) {
		var row, cell1, cell2;
		row = table.insertRow(-1);
		cell1 = row.insertCell(0);
		cell2 = row.insertCell(1);
		cell1.innerHTML = elem;
		cell2.innerHTML = xpath;
	}
	
	//checks if an elment is in a the list
	function isIn(list, out) {
		var i;
		for (i = 0; i < list.length; i += 1) {
			if (list[i][0] === out) {
				return false;
			}
		}
		return true;
	}

	//gets xpath and writes unique xpath values

	function getXpath(table, xmlDoc) {
		var elems, elem, out, list = [], attribute, i, a;
		elems = xmlDoc.getElementsByTagName('*');
		//loops through all the elements
		for (i = 0; i < elems.length; i += 1) {
			elem = elems[i];
			out = elem.nodeName;
			//loops through all the parent nodes of an element creating the xpath
			while (elem.parentNode) {
				out = elem.parentNode.nodeName + '/' + out;
				elem = elem.parentNode;
			}
			// trims out the #Document element present in every xml file
			out = out.substr(9);
			//checks if xpath was loaded, if not writes the xpath to the page
			if (isIn(list, out)) {
				list.push([out, elems[i].nodeName]);
				//checks if the element has any attributes, and writes all attributes to the page
				if (elems[i].attributes.length !== 0) {
					for (a = 0; a < elems[i].attributes.length; a += 1) {
						attribute = elems[i].attributes[a].nodeName;
						list.push([out + '/@' + attribute, attribute]);
					}
				}
			}
		}
		return list;
	}

	var table, xmlDoc, i, list;
	table = document.getElementById("table");
	xmlDoc = loadXMLDoc(document.getElementById('file').value);
	list = getXpath(table, xmlDoc);
	for (i = 0; i < list.length; i += 1) {
		tableAppend(table, list[i][1], list[i][0]);
	}
}