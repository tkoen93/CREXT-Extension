var $ = require('jquery');

function txPages(pageNumber, pageNumberSelect, maxPages) {

pageNumber = Number(pageNumber);
pageNumberSelect = Number(pageNumberSelect);
maxPages = Number(maxPages);

  if(maxPages <= 7) {
    if(pageNumber == 1) {
      $('#txPaging').html("<p class=\"pull-left\" style=\"position:fixed;left:42px;\"><a class=\"pageNumber\"><i class=\"fas fa-arrow-left\"></i></a></p>");
    } else {
      $('#txPaging').html("<p class=\"pull-left\" style=\"position:fixed;left:42px;\"><a href=\"#\" class=\"pageNumberActive\" id=\"selectPage\" page=\"" + (pageNumber-1) + "\"><i class=\"fas fa-arrow-left\"></i></a></p>");
    }

    for(let i=0;i<maxPages;i++) {
      if(pageNumber == (i+1)) {
        $('#txPaging').append("<a href=\"#\" class=\"pageNumberActive\" id=\"selectPage\" page=\"" + (i+1) + "\">" + (i+1) + "</a>");
      } else {
        $('#txPaging').append("<a href=\"#\" class=\"pageNumber\" id=\"selectPage\" page=\"" + (i+1) + "\">" + (i+1) + "</a>");
      }
    }

    if(pageNumber == maxPages) {
      $('#txPaging').append("<p class=\"pull-right\" style=\"position:fixed;right:46px;\"><a class=\"pageNumber\"><i class=\"fas fa-arrow-right\"></i></a></p>");
    } else {
      $('#txPaging').append("<p class=\"pull-right\" style=\"position:fixed;right:46px;\"><a href=\"#\" class=\"pageNumberActive\" id=\"selectPage\" page=\"" + (pageNumber+1) + "\"><i class=\"fas fa-arrow-right\"></i></a></p>");
    }
  } else {
    if(pageNumber == 1) {
      $('#txPaging').html("<p class=\"pull-left\" style=\"position:fixed;left:42px;\"><a class=\"pageNumber\"><i class=\"fas fa-arrow-left\"></i></a></p>");
    } else {
      $('#txPaging').html("<p class=\"pull-left\" style=\"position:fixed;left:42px;\"><a href=\"#\" class=\"pageNumberActive\" id=\"selectPage\" page=\"" + (pageNumber-1) + "\"><i class=\"fas fa-arrow-left\"></i></a></p>");
    }

    if(pageNumberSelect == 4) {
      $('#txPaging').append("<a href=\"#\" class=\"pageNumber\" id=\"selectPage\" page=\"1\">1</a>");
    }

    if(pageNumberSelect > 4) {
      $('#txPaging').append("<a href=\"#\" class=\"pageNumber\" id=\"selectPage\" page=\"1\">1</a>");
      $('#txPaging').append("<a class=\"pageNumber\">...</a>");
    }

    if(pageNumber == 1 && pageNumberSelect == 3) {
      $('#txPaging').append("<a href=\"#\" class=\"pageNumberActive\" id=\"selectPage\" page=\"" + (pageNumberSelect-2) + "\">" + (pageNumberSelect-2) + "</a>");
    } else {
      $('#txPaging').append("<a href=\"#\" class=\"pageNumber\" id=\"selectPage\" page=\"" + (pageNumberSelect-2) + "\">" + (pageNumberSelect-2) + "</a>");
    }

    if(pageNumber == 2 && pageNumberSelect == 3) {
      $('#txPaging').append("<a href=\"#\" class=\"pageNumberActive\" id=\"selectPage\" page=\"" + (pageNumberSelect-1) + "\">" + (pageNumberSelect-1) + "</a>");
    } else {
      $('#txPaging').append("<a href=\"#\" class=\"pageNumber\" id=\"selectPage\" page=\"" + (pageNumberSelect-1) + "\">" + (pageNumberSelect-1) + "</a>");
    }

    if(pageNumber == pageNumberSelect) {
      $('#txPaging').append("<a href=\"#\" class=\"pageNumberActive\" id=\"selectPage\" page=\"" + pageNumberSelect + "\">" + pageNumberSelect + "</a>");
    } else {
      $('#txPaging').append("<a href=\"#\" class=\"pageNumber\" id=\"selectPage\" page=\"" + pageNumberSelect + "\">" + pageNumberSelect + "</a>");
    }

    if(pageNumber == (maxPages-1) && pageNumberSelect == (maxPages-2)) {
      $('#txPaging').append("<a href=\"#\" class=\"pageNumberActive\" id=\"selectPage\" page=\"" + (pageNumberSelect+1) + "\">" + (pageNumberSelect+1) + "</a>");
    } else {
      $('#txPaging').append("<a href=\"#\" class=\"pageNumber\" id=\"selectPage\" page=\"" + (pageNumberSelect+1) + "\">" + (pageNumberSelect+1) + "</a>");
    }

    if(pageNumber == maxPages && pageNumberSelect == (maxPages-2)) {
      $('#txPaging').append("<a href=\"#\" class=\"pageNumberActive\" id=\"selectPage\" page=\"" + (pageNumberSelect+2) + "\">" + (pageNumberSelect+2) + "</a>");
    } else {
      $('#txPaging').append("<a href=\"#\" class=\"pageNumber\" id=\"selectPage\" page=\"" + (pageNumberSelect+2) + "\">" + (pageNumberSelect+2) + "</a>");
    }

    if(pageNumber == (maxPages-3)) {
      $('#txPaging').append("<a href=\"#\" class=\"pageNumber\" id=\"selectPage\" page=\"" + maxPages + "\">" + maxPages + "</a>");
    }

    if(pageNumberSelect < (maxPages-3)) {
      $('#txPaging').append("<a class=\"pageNumber\">...</a>");
      $('#txPaging').append("<a href=\"#\" class=\"pageNumber\" id=\"selectPage\" page=\"" + maxPages + "\">" + maxPages + "</a>");
    }


    if(pageNumber == maxPages) {
      $('#txPaging').append("<p class=\"pull-right\" style=\"position:fixed;right:46px;\"><a class=\"pageNumber\"><i class=\"fas fa-arrow-right\"></i></a></p>");
    } else {
      $('#txPaging').append("<p class=\"pull-right\" style=\"position:fixed;right:46px;\"><a href=\"#\" class=\"pageNumberActive\" id=\"selectPage\" page=\"" + (pageNumber+1) + "\"><i class=\"fas fa-arrow-right\"></i></a></p>");
    }
  }
}

module.exports = txPages;
