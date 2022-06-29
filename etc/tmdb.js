var episodes = $('.episode.closed');

var output = [];
for (var i = 0; i < episodes.length; i++ ) {
    output.push({
        id: $(episodes[i]).find('h3').find('[episode_id]').attr('episode_id'),
        episode: $(episodes[i]).find('h3').find('[episode]').attr('episode'),
        season: $(episodes[i]).find('h3').find('[season]').attr('season'),
        title: $(episodes[i]).find('h3').find('[title]').attr('title'),
        airdate: $(episodes[i]).find('.date').find('span')[0].innerHTML,
        runtime: $(episodes[i]).find('.date').find('span')[1].innerHTML
    });
}

console.log(output);

console.log("Click on webpage to copy JSON to clipboard.");
setTimeout(function () {
    navigator.clipboard.writeText(JSON.stringify(output));
    console.log("JSON copied to clipboard.");
}, 3000);