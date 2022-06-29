var episodes = $('.list-group-item');
var output = [];

var sRx = /S0*(\d+)E/;
var eRx = /E0*(\d+)/;

for (var i = 0; i < episodes.length; i++) {
    var episodeLabel = $(episodes[i]).find('.episode-label').html();
    if (episodeLabel.includes("SPECIAL 0")) {
        continue;
    }
    
    output.push({
        id: $(episodes[i]).find('a').attr('href').split('/')[4],
        episode: eRx.exec(episodeLabel)[1],
        season: sRx.exec(episodeLabel)[1],
        title: $(episodes[i]).find('a').html().trim(),
        airdate: $(episodes[i]).find('li').html(),
        runtime: 0
    });
}

console.log(output);

console.log("Click on webpage to copy JSON to clipboard.");
setTimeout(function () {
    navigator.clipboard.writeText(JSON.stringify(output));
    console.log("JSON copied to clipboard.");
}, 3000);