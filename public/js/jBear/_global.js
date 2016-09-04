  /*
Author:     Frank Lee
File name:    _global.js
Description:  Global tools
Dependencies:  ''
Usage:     
*/ 

// fast comparation :jsperf.com/getelementbyid-vs-queryselector/233 .
window.$_qsl = document.querySelectorAll.bind(document);
window.$_qs = document.querySelector.bind(document);
window.$_id = document.getElementById.bind(document);
window.$_class = document.getElementsByClassName.bind(document);
window.$_tag = document.getElementsByTagName.bind(document);

