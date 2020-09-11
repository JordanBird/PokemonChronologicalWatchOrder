$.getJSON("content/order.json", function(json) {
    renderTimeline(json);
});

function renderTimeline(arcs) {
    for (var arcIndex = 0; arcIndex < arcs.length; arcIndex++) {
        addNavigation(arcs[arcIndex].arc);
        
        addHeader(arcs[arcIndex].arc, 'h1');

        for (var miniArcIndex = 0; miniArcIndex < arcs[arcIndex].miniArcs.length; miniArcIndex++) {
            if (arcs[arcIndex].miniArcs[miniArcIndex].miniArc) {
                addHeader(arcs[arcIndex].miniArcs[miniArcIndex].miniArc, 'h2');
            }

            for (var mediaIndex = 0; mediaIndex < arcs[arcIndex].miniArcs[miniArcIndex].media.length; mediaIndex++) {
                var media = arcs[arcIndex].miniArcs[miniArcIndex].media[mediaIndex];

                var uniqueRef = "ref" + getRandomRef();
                var listItem = $('<div></div>').addClass('timeline-card-body').attr('id', uniqueRef).addClass('collapse');

                var title = "";
                switch (media.type) {
                    case "episodes":
                        var sSeason = getNumberAsSeason(media.start.season);
                        var sEpisode = getNumberAsEpisode(media.start.episode);
                        var eSeason = getNumberAsSeason(media.end.season);
                        var eEpisode = getNumberAsEpisode(media.end.episode);

                        title = media.series + " " + sSeason + sEpisode + " - " + eSeason + eEpisode;
                        $(listItem).append($('<p></p>').html(sSeason + sEpisode + " - " + media.start.name));
                        $(listItem).append($('<p></p>').html(eSeason + eEpisode + " - " + media.end.name));
                        break;
                    case "episode":
                        var sSeason = getNumberAsSeason(media.season);
                        var sEpisode = getNumberAsEpisode(media.episode);

                        title = media.series + " " + sSeason + sEpisode + " - " + media.name;
                        $(listItem).append($('<p></p>').html(media.series));
                        $(listItem).append($('<p></p>').html(sSeason + sEpisode + " - " + media.name));
                        break;
                    case "special":
                    case "movie":
                        title = media.name;
                        $(listItem).append($('<p></p>').html(media.name));
                        break;
                    case "short":
                        title = media.name;
                        $(listItem).append($('<p></p>').html(media.series));
                        $(listItem).append($('<p></p>').html(media.name));
                        break;
                }

                if (media.notes) {
                    for (var noteIndex = 0; noteIndex < media.notes.length; noteIndex++) {
                        $(listItem).append($('<span></span>').addClass('badge badge-secondary').html(media.notes[noteIndex]));
                    }
                }

                var card = $('<div></div>').addClass('timeline-card timeline-' + media.type).attr('data-toggle', 'collapse').attr('data-target', "#" + uniqueRef);
                var header = $('<div></div>').addClass('timeline-card-header').html(title);
                $(card).append(header);
                $(card).append(listItem);

                addTimelineContainer(card, media.type);
            }
        }
    }
}

function addNavigation(name) {
    var link = $('<li></li>').html(name).click(function() {
        $('html,body').animate({
            scrollTop: $("[data-header='" + name + "']").offset().top},
            'slow');
    });
    $('.side-timeline').append(link);

    $('.jump-to-container').append($('<a></a>').addClass('dropdown-item').attr('href', '#').html(name).click(function() {
        $('html,body').animate({
            scrollTop: $("[data-header='" + name + "']").offset().top},
            'slow');
    }));
}

function addHeader(name, headerType) {
    var card = $('<div></div>').addClass('timeline-container');
    var chunk = $('<div></div>').addClass('timeline-chunk');
    var header = $('<' + headerType + '></' + headerType + '>').attr('data-header', name).html(name);
    
    $(card).append(chunk);
    $(card).append(header);
    $('.main-timeline').append(card);
}

function addTimelineContainer(content, type)
{
    var card = $('<div></div>').addClass('timeline-container').addClass(type);
    var chunk = $('<div></div>').addClass('timeline-chunk');
    

    if (type) {
        $(chunk).append($('<div></div>').addClass('timeline-dash'));
        $(chunk).append($('<div></div>').addClass('timeline-marker'));
    }

    $(card).append(chunk).append(content);
    
    $('.main-timeline').append(card);
}

function initEvents() {
    $(window).scroll(posiitonNav);
    $(window).resize(posiitonNav);

    posiitonNav();
}

function posiitonNav() {
    $('.side-timeline-container').css('top', ($(window).height() / 2) - ($('.side-timeline-container').height() / 2));
    $('.side-timeline-container').css('left', $('.side-timeline-container').parent().position().left + ($('.side-timeline-container').parent().width() / 2) - ($('.side-timeline-container').width() / 2));

    var lastActive;
    var results = $('.side-timeline li');
    for (var i = 0; i < results.length; i++) {
        var topOfNav = $(results[i]).position().top;
        var topOfHeader = $("[data-header='" + $(results[i]).html() + "']").position().top - $(window).scrollTop();
        
        if (topOfNav > topOfHeader) {
            lastActive = $(results[i]);
        }
    }

    if (lastActive == $('.side-timeline li.active')) {
        return;
    }
    else if (lastActive) {
        $('.side-timeline li').removeClass('active');

        $(lastActive).addClass('active');
    }
}

function formatNumber(number) {
    var output = number.toString();
    if (output.length == 1) {
        output = "0" + output;
    }

    return output;
}

function getNumberAsSeason(number) {
    return "S" + formatNumber(number);
}

function getNumberAsEpisode(number) {
    return "E" + formatNumber(number);
}

function getRandomRef() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

$(document).ready(function () {
    initEvents();
});