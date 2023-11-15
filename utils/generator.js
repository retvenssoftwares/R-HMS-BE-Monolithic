import { xml2json } from 'xml-js';
var xmldata = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<Student>' +
    '<PersonalInformation>' +
    '<FirstName>Sravan</FirstName>' +
    '<LastName>Kumar</LastName>' +
    '<Gender>Male</Gender>' +
    '</PersonalInformation>' +
    '<PersonalInformation>' +
    '<FirstName>Sudheer</FirstName>' +
    '<LastName>Bandlamudi</LastName>' +
    '<Gender>Male</Gender>' +
    '</PersonalInformation>' +
    '</Student>';
var result1 = xml2json(xmldata, { compact: true, spaces: 4 });
// var result2 = xml2json(xmldata, {compact: false, spaces: 4});
console.log('\n', result1);