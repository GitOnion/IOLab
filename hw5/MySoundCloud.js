// 'Play' button event handler - play the track in the Stratus player
function changeTrack(url) {
  // Remove any existing instances of the Stratus player
  $('#stratus').remove();
  // Create a new Stratus player using the clicked song's permalink URL
  $.stratus({
    key: "b3179c0738764e846066975c2571aebb",
    auto_play: true,
    align: "bottom",
    links: url
  });
}

$(document).ready(
  function() {
    // Adds "Play" function to all play buttons
    $('#layout').on('click', '.fa-play-circle', function() {
      // Take the url from the button when clicked.
      changeTrack($(this).data('stream_url'));
      // Show the previously hidden "Related Songs".
      $('#relatedSongs').css('visibility', 'visible');
      // Search for relatd songs by the tag of the song being played.
      callAPI($(this).data('tag'), 7, 'related');
    });

    // Adds "Add to playlist" function to all plus buttons
    $('#layout').on('click', '.fa-plus-circle', function() {
      // Get the song title by refering to the button's parent's sibling and store it for later append.
      var songName = $(this).prev().data('title');
      $('.pure-menu-list').first().prepend('<li class="pure-menu-item"><p>' + songName + '</p><i class="fa fa-minus-circle"></i><i class="fa fa-arrow-circle-up"></i><i class="fa fa-arrow-circle-down"></i></li>');
      // Clone the play button, because it knows about the song, so give a true as its parameter.
      $(this).prev().clone(true).insertBefore($('.fa-minus-circle').first());
    });

    // Adds "Remove from playlist" function to all minus buttons
    $('#menu').on('click', '.fa-minus-circle', function() {
      $(this).parent().remove();
    });

    // Adds "Move up on playlist" function to all up arrows
    $('#menu').on('click', '.fa-arrow-circle-up', function() {
      $(this).parent().insertBefore($(this).parent().prev());
    });

    // Adds "Move down on playlist" function to all down arrows
    $('#menu').on('click', '.fa-arrow-circle-down', function() {
      $(this).parent().insertAfter($(this).parent().next());
    });
  }
);

function populateAll(data) {
  // Clean up results from previous search.
  $('.pure-g').find('*').remove();
  // Loop through all JSON object input and create a new responsive grid element to hold data.
  $(data).each(function(index) {
    // Handling results that have no pictures, with a server side image "err.png".
    var pic_url;
    if (data[index].artwork_url === null) {
      pic_url = 'err.png';
    } else {
      pic_url = data[index].artwork_url;
    }
    // Creating new element
    $('.pure-g').append('<div class="pure-u-1 pure-u-md-1-2 pure-u-lg-1-4"><div class="song-item"><p class="song-title">' + data[index].title + '</p><p class="song-author">' + data[index].user.username + '</p><img class="pure-img-responsive" src="' + pic_url.replace('large', 't200x200') + '"/>' + '<span class="option-banner"><i class="fa fa-play-circle"></i>' + '<i class="fa fa-plus-circle"></i></span></div></div>');

    // Storing the url to music to the play button, which will make the button know which song it's supposed to play.
    $('.fa-play-circle').last().data('stream_url', data[index].permalink_url);
    var tag1 = data[index].tag_list.split(" ")[0];
    $('.fa-play-circle').last().data('tag', tag1);
    $('.fa-play-circle').last().data('title', data[index].title);
  });
}

function populateRelated(data) {
  // Clean up results from previous play.
  $('#relatedSongsList li').remove();
  // Loop through all JSON object input and create a new responsive grid element to hold data.
  $(data).each(function(index) {
    // Creating new element
    $('#relatedSongsList').append('<li class="pure-menu-item"><p>'
    + data[index].title + '</p><i class="fa fa-play-circle"></i><i class="fa fa-plus-circle"></i></li>');
    // Storing the url to music to the play button, which will make the button know which song it's supposed to play.
    $('#relatedSongsList').children().last().find('.fa-play-circle').data('stream_url', data[index].permalink_url);
    var tag1 = data[index].tag_list.split(" ")[0];
    $('#relatedSongsList').children().last().find('.fa-play-circle').data('tag', tag1);
    $('#relatedSongsList').children().last().find('.fa-play-circle').data('title', data[index].title);
  });

}

// Event hander for calling the SoundCloud API using the user's search query
function callAPI(query, limit, flag) {
  $.get("https://api.soundcloud.com/tracks?client_id=b3179c0738764e846066975c2571aebb", {
      'q': query,
      'limit': limit
    },
    function(data) {
      // Call function that parses all results
      if (flag === 'search') {
        populateAll(data);
      } else if (flag === 'related') {
        populateRelated(data);
      }
    }, 'json'
  );
}

// Enable searching for songs
$('#searchGo').on('click', function() {
  // Wrapper of the callAPI function.
  callAPI($('#searchEnter').val(), 20, 'search');
  // Clean the search field after each search.
  $('#searchEnter').val('');
  // Add a new instruction after the first search.
  if ($('#searchArea').children().last().is('p') === false) {
    $('#searchArea').append('<p>Click on <i class="fa fa-play-circle"></i> to play, or <i class="fa fa-plus-circle"></i> to add to playlist</p>')
  }
});

/////////////////// Pure CSS "pure-layout-side-menu/js/ui.js"///////////////////
(function(window, document) {

  var layout = document.getElementById('layout'),
    menu = document.getElementById('menu'),
    menuLink = document.getElementById('menuLink');

  // This function will switch the class of element given to show responsive layout.
  function toggleClass(element, className) {
    var classes = element.className.split(/\s+/),
      length = classes.length,
      i = 0;

    for (; i < length; i++) {
      if (classes[i] === className) {
        classes.splice(i, 1);
        break;
      }
    }
    // The className is not found
    if (length === classes.length) {
      classes.push(className);
    }

    element.className = classes.join(' ');
  }

  menuLink.onclick = function(e) {
    var active = 'active';

    e.preventDefault();
    toggleClass(layout, active);
    toggleClass(menu, active);
    toggleClass(menuLink, active);
  };

}(this, this.document));
