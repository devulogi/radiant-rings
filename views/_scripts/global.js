$(document).ready(function () {
  console.log('jQuery is working!');

  const ACTIONS = {
    GET_FOLLOWERS: {
      name: 'get followers',
      method: 'GET',
      url: '/followers/{/id}'
    }
  };

  const { GET_FOLLOWERS } = ACTIONS;

  // setup the semantic ui behaviors api here
  $.fn.api.settings.api = {
    [GET_FOLLOWERS.name]: GET_FOLLOWERS.url
  };

  $(document).ready(function () {
    console.log('jQuery is working!');
  });

  $('.basic.button')
    .off('click')
    .on('click', function () {
      console.log('button clicked');
      $(this).api({
        action: ACTIONS.GET_FOLLOWERS.name,
        urlData: {
          id: 1
        },
        onSuccess: function (response) {
          console.log(response);
        },
        onFailure: function (response) {
          console.log(response);
        }
      });
    });
});
