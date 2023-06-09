var episodes = $('tr');
var output = [];

var sRx = /S0*(\d+)E/;
var eRx = /E0*(\d+)/;
var airDateReplaceRegex = /\D/g;

for (var i = 1; i < episodes.length; i++) {
    var episodeLabel = $(episodes[i]).find('td')[0].innerHTML;
    if (episodeLabel.includes("SPECIAL 0")) {
        continue;
    }
    
    output.push({
        id: $(episodes[i]).find('a').attr('href').split('/')[4],
        episode: eRx.exec(episodeLabel)[1],
        season: sRx.exec(episodeLabel)[1],
        title: $(episodes[i]).find('td a').html().trim(),
        airdate: $(episodes[i]).find('td div')[0].innerHTML,
        runtime:  $(episodes[i]).find('td')[3].innerHTML.replace(airDateReplaceRegex,'')
    });
}

console.log(output);

console.log("Click on webpage to copy JSON to clipboard.");
setTimeout(function () {
    navigator.clipboard.writeText(JSON.stringify(output));
    console.log("JSON copied to clipboard.");
}, 3000);