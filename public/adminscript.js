var list;
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;


function onYouTubePlayerAPIReady() 
{
        player = new YT.Player('player', 
        {
          height: '390',
          width: '640',
          videoId: 'u1zgFlCw8Aw',
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
}


function onPlayerReady(event) {
  event.target.loadPlaylist({list: "PLQ3bg2MOQ-107PJB3-LWkDg85eIRB-zIR", index: 0});
  player.playVideo();
  
buildApiRequest('GET',
'/youtube/v3/playlistItems',
{'maxResults': '25',
 'part': 'snippet,contentDetails',
 'playlistId': 'PLQ3bg2MOQ-107PJB3-LWkDg85eIRB-zIR'});
}





function stopVideo() {
  player.stopVideo();
  
}


var GoogleAuth;

/**
 * Load the API's client and auth2 modules.
 * Call the initClient function after the modules load.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
  // Initialize the gapi.client object, which app uses to make API requests.
  // Get API key and client ID from API Console.
  // 'scope' field specifies space-delimited list of access scopes

  gapi.client.init({
      'clientId': '692358556994-ik0smhl0u75sph06upugunav04hf1oqr.apps.googleusercontent.com',
      'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
      'scope': 'https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtubepartner'
  }).then(function () {
    GoogleAuth = gapi.auth2.getAuthInstance();

    // Listen for sign-in state changes.
    GoogleAuth.isSignedIn.listen(updateSigninStatus);

    // Handle initial sign-in state. (Determine if user is already signed in.)
    setSigninStatus();

    // Call handleAuthClick function when user clicks on "Authorize" button.
    $('#execute-request-button').click(function() {
      handleAuthClick(event);
    }); 
  });
}

function handleAuthClick(event) {
  // Sign user in after click on auth button.
  GoogleAuth.signIn();
}

function setSigninStatus() {
  var user = GoogleAuth.currentUser.get();
  isAuthorized = user.hasGrantedScopes('https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtubepartner');
  // Toggle button text and displayed statement based on current auth status.
  if (isAuthorized) {
    defineRequest();
  }
}

function updateSigninStatus(isSignedIn) {
  setSigninStatus();
}

function createResource(properties) {
  var resource = {};
  var normalizedProps = properties;
  for (var p in properties) {
    var value = properties[p];
    if (p && p.substr(-2, 2) == '[]') {
      var adjustedName = p.replace('[]', '');
      if (value) {
        normalizedProps[adjustedName] = value.split(',');
      }
      delete normalizedProps[p];
    }
  }
  for (var p in normalizedProps) {
    // Leave properties that don't have values out of inserted resource.
    if (normalizedProps.hasOwnProperty(p) && normalizedProps[p]) {
      var propArray = p.split('.');
      var ref = resource;
      for (var pa = 0; pa < propArray.length; pa++) {
        var key = propArray[pa];
        if (pa == propArray.length - 1) {
          ref[key] = normalizedProps[p];
        } else {
          ref = ref[key] = ref[key] || {};
        }
      }
    };
  }
  return resource;
}

function removeEmptyParams(params) {
  for (var p in params) {
    if (!params[p] || params[p] == 'undefined') {
      delete params[p];
    }
  }
  return params;
}

var list;

function executeRequest(request) {
  request.execute(function(response) {
      list = response
    console.log(list)
    for(var i = 0; i < list.items.length; i++) {
      $("#songs").append('<tr><td>'+ list.items[i].snippet.title + '</td></tr>')
    }
  });
}

function buildApiRequest(requestMethod, path, params, properties) {
  params = removeEmptyParams(params);
  var request;
  if (properties) {
    var resource = createResource(properties);
    request = gapi.client.request({
        'body': resource,
        'method': requestMethod,
        'path': path,
        'params': params
    });
  } else {
    request = gapi.client.request({
        'method': requestMethod,
        'path': path,
        'params': params
    });
  }
  executeRequest(request);
}

/***** END BOILERPLATE CODE *****/


function defineRequest() {
  // See full sample for buildApiRequest() code, which is not 
// specific to a particular API or API method.


}


console.log(list)

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
    
  buildApiRequest('DELETE',
  '/youtube/v3/playlistItems',
  {'id': list.items[0].id,
  'onBehalfOfContentOwner': ''});
  location.reload()
    }
}