/*! replaces link */
$(document).ready(function() {
    var pathname = window.location.pathname;
    
    var link = 'student.piwai.info' + pathname;
    
    var fullLink = 'http://' + link;
    
    var studentLink = $('span.student-link');
    
    $(studentLink).after('<a class="btn btn-success" href="'+fullLink+'">'+link+' &raquo;</a>');
    $(studentLink).remove();
    
});