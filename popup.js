var redditResults = [];
var HNResults = [];

function redditLink(redditObject) {
  var reddit_link = 'http://www.reddit.com' + redditObject.permalink;
  return "<a class='reddit-link' href='" + reddit_link + "'>" + '/r/' + redditObject.subreddit +
    " (" + redditObject.num_comments + "): " + redditObject.title + "</a>";
}

function hnLink(hnObject) {
  var hn_link = 'https://news.ycombinator.com/item?id=' + hnObject.id
  return "<a class='hn-link' href='" + hn_link + "'>" + "HN (" + hnObject.num_comments + "): " + hnObject.title + "</a>";
}

function addRedditResult(result) {
  redditResults.push(result);
  $("#redditresults").append("<p>" + redditLink(result.data) + "</p>");
}

function addHNResult(result) {
  HNResults.push(result);
  $("#hnresults").append("<p>" + hnLink(result.item) + "</p>");
}

function searchReddit(search_url) {
  $.getJSON("http://www.reddit.com/search.json", {q: 'url:' + search_url}, function(data) {
    $.each(data.data.children, function(i, result) {
      addRedditResult(result);
    });
    if (!redditResults.length) {
      $('#redditresults').append("<p>No Reddit Comments Found. <a href='http://www.reddit.com/submit?url=" +
        search_url + "'>Post one?</a></p>");
    }
  }); 
}

function searchHN(search_url) {
  removeSchema = search_url.match(/(https?\:\/\/)(.*)/);
  if (removeSchema) {
    search_url = removeSchema[2];
  }
  $.getJSON("http://api.thriftdb.com/api.hnsearch.com/items/_search", {filter: { queries: ["url:(*" + search_url + "*)"]}}, function(data) {
    window.data = data;
    $.each(data.results, function(i, result) {
      addHNResult(result);
    });
    if (!HNResults.length) {
      $("#hnresults").append("<p>No HN Comments Found. <a href='https://news.ycombinator.com/submitlink?u=" +
        search_url + "'>Post one?</a></p>");
    }
  });
}

$(document).ready(function() {
  chrome.tabs.getSelected(null,function(tab) {
    console.log(tab.url);
    searchReddit(tab.url);
    searchHN(tab.url);
  });
});

$(document).on('click', 'a', function() {
  chrome.tabs.create({url: $(this).attr('href')});
});
