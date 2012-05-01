/*! shows hidden emails in page */
$(function(){

  var showmail = $('span.showmail');

  var at = / at /;
  var dot = / dot /g;
  var showRealMail = $(showmail).text().replace(at,"@").replace(dot,".");
  
  $(showmail).after(showRealMail);
  $(showmail).remove();
  
  var linkmail = $('span.linkmail');
  var linkRealMail = $(linkmail).text().replace(at,"@").replace(dot,".");
  
  $(linkmail).after('<a class="btn btn-primary btn-large" href="mailto:'+linkRealMail+'">Contact me &raquo;</a>');
  $(linkmail).remove();  
  
});