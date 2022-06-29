function renderTimeline(episodes, entries, alternates) {
    var mediaQuery = getMedia(episodes, entries, alternates);

    if (true) {
        mediaQuery = flattenMedia(mediaQuery);
    }

    for (var groupIndex = 0; groupIndex < mediaQuery.length; groupIndex++) {
        var group = mediaQuery[groupIndex];

        addNavigation(group.title);
        addHeader(group.title, 'h1');

        for (var mediaIndex = 0; mediaIndex < group.media.length; mediaIndex++) {
            var media = group.media[mediaIndex];

            var uniqueRef = "ref" + getRandomRef();
            var listItem = $('<div></div>').addClass('timeline-card-body').attr('id', uniqueRef).addClass('collapse');

            var title = getTitleForMedia(media);
            
            //$(listItem).append($('<p></p>').html(media.series));
            $(listItem).append(media.content);

            if (media.notes) {
                for (var noteIndex = 0; noteIndex < media.notes.length; noteIndex++) {
                    $(listItem).append($('<span></span>').addClass('badge badge-secondary').html(media.notes[noteIndex]));
                }
            }

            var card = $('<div></div>').addClass('timeline-card timeline-' + media.type);
            if (media.isAlternate) {
                $(card).addClass('is-alternate');
            }
            
            var header = $('<div></div>').addClass('timeline-card-header collapsed').attr('data-toggle', 'collapse').attr('data-target', "#" + uniqueRef).html(title);
            $(card).append(header);
            $(card).append(listItem);

            addTimelineContainer(card, media.type);
        }
    }
}

function getTitleForMedia(media) {
    switch (media.type) {
        case "spinoff-episodes":
            var sSeason = getNumberAsSeason(media.start.season);
            var sEpisode = getNumberAsEpisode(media.start.episode);
            var eSeason = getNumberAsSeason(media.end.season);
            var eEpisode = getNumberAsEpisode(media.end.episode);

            return media.series + " " + sSeason + sEpisode + " - " + eSeason + eEpisode;
        case "spinoff-episode":
            var sSeason = getNumberAsSeason(media.season);
            var sEpisode = getNumberAsEpisode(media.episode);

            return media.series + " " + sSeason + sEpisode + " - " + media.title;
        case "episodes":
        case "special":
        case "movie":
        case "episode":
        case "short":
            return media.title;
    }

    return media.title;
}

function addNavigation(name) {
    var link = $('<li></li>').html(name).click(function() {
        $('html,body').animate({
            scrollTop: $("[data-header='" + name + "']").offset().top},
            'slow');
    });
    $('.floating-navigation').append(link);

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

function addTimelineContainer(content, type) {
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
    $('.floating-navigation-container').css('top', ($(window).height() / 2) - ($('.floating-navigation-container').height() / 2));
    $('.floating-navigation-container').css('left', $('.floating-navigation-container').parent().position().left + ($('.floating-navigation-container').parent().width() / 2) - ($('.floating-navigation-container').width() / 2));

    var lastActive;
    var results = $('.floating-navigation li');
    for (var i = 0; i < results.length; i++) {
        var topOfNav = $(results[i]).position().top;
        var topOfHeader = $("[data-header='" + $(results[i]).html() + "']").position().top - $(window).scrollTop();
        
        if (topOfNav > topOfHeader) {
            lastActive = $(results[i]);
        }
    }

    if (lastActive == $('.floating-navigation li.active')) {
        return;
    }
    else if (lastActive) {
        $('.floating-navigation li').removeClass('active');

        $(lastActive).addClass('active');
    }
}

function getMedia(episodes, entries, alternates) {
    var output = [];

    var entryPlacement = 0;
    var alternatePlacement = 0;
    var episodesBySeason = groupBy(episodes, "season");
    for (var episodeBySeason in episodesBySeason) {
        var group = {
            title: "Season " + episodeBySeason,
            media: []
        };

        for (var episode = 0; episode < episodesBySeason[episodeBySeason].length; episode++) {
            group.media.push({
                type: "episode",
                title: episodesBySeason[episodeBySeason][episode].title,
                season: episodesBySeason[episodeBySeason][episode].season,
                episode: episodesBySeason[episodeBySeason][episode].episode
            });

            for (var entry = entryPlacement; entry < entries.length; entry++) {
                if (episodesBySeason[episodeBySeason][episode].title.toLowerCase().includes(entries[entry].entry.toLowerCase()) == false) {
                    break;
                }

                group.media.push(entries[entry]);

                entryPlacement++;
            }

            for (var alternate = alternatePlacement; alternate < alternates.length; alternate++) {
                if (!alternates[alternate].entry) {
                    alternatePlacement++;

                    continue;
                }

                if (episodesBySeason[episodeBySeason][episode].title.toLowerCase().includes(alternates[alternate].entry.toLowerCase()) == false) {
                    break;
                }

                var newAlternate = JSON.parse(JSON.stringify(alternates[alternate]));
                newAlternate.isAlternate = true;

                group.media.push(newAlternate);

                alternatePlacement++;
            }
        }

        output.push(group);
    }

    var alternateGroup = {
        title: "Alternate Continuity",
        media: []
    };
    for (var alternate = 0; alternate < alternates.length; alternate++) {
        alternateGroup.media.push(alternates[alternate]);
    }

    output.push(alternateGroup);

    return output;
}

function flattenMedia(media) {
    for (var group = 0; group < media.length; group++) {
        var newMedia = [];

        var currentEpisode = 0;
        var previousActual = 0;
        var previousEpisode = 0;
        var content = "";
        for (var i = 0; i < media[group].media.length; i++) {
            if (media[group].media[i].type == "episode") {
                content += '<p>' + getNumberAsSeason(media[group].media[i].season) + getNumberAsEpisode(media[group].media[i].episode) + ' ' + media[group].media[i].title + '</p>';
            }

            if (media[group].media[i].type != "episode") {
                if (currentEpisode == previousEpisode)
                {
                    newMedia.push(media[group].media[i]);

                    previousActual = i + 1;
                }
                else
                {
                    newMedia.push({
                        type: "episodes",
                        title: "Pokemon " + getNumberAsSeason(media[group].media[previousActual].season) + getNumberAsEpisode(media[group].media[previousActual].episode) + " - " + getNumberAsSeason(media[group].media[currentEpisode].season) + getNumberAsEpisode(media[group].media[currentEpisode].episode),
                        content: content
                    });
                    newMedia.push(media[group].media[i]);

                    previousActual = i + 1;

                    content = "";
                }

                previousEpisode = i;
            }
            else if (i == media[group].media.length - 1) {
                newMedia.push({
                    type: "episodes",
                    title: "Pokemon " + getNumberAsSeason(media[group].media[previousActual].season) + getNumberAsEpisode(media[group].media[previousActual].episode) + " - " + getNumberAsSeason(media[group].media[currentEpisode].season) + getNumberAsEpisode(media[group].media[currentEpisode].episode),
                    content: content
                });

                content = "";
            }

            currentEpisode = i;
        }

        media[group].media = newMedia;
    }

    return media;
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
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}

function run() {
    $.getJSON("content/episodes/tvdb-dvd-order.json", function (episodes) {
        $.getJSON("content/entries.json", function (entries) {
            $.getJSON("content/alternates.json", function (alternates) {
                renderTimeline(episodes, entries, alternates);
            });
        });
    });
}

$(document).ready(function () {
    run();
    initEvents();

    posiitonNav();
});