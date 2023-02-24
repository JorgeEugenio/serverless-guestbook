/**
 * Web application
 */
const apiUrl = 'https://us-south.functions.appdomain.cloud/api/v1/web/dbe9d0cc-3bc1-4969-89de-4db45507cb50/guestbook';
console.log(apiUrl)
const guestbook = {
  // retrieve the existing guestbook entries
  get() {
    const result = $.ajax({
      type: 'GET',
      url: `${apiUrl}/read-guestbook-entries-sequence.json`,
      dataType: 'json'
    });
    return result;
  },
  // add a single guestbood entry
  add(name, email, comment) {
    console.log('Sending', name, email, comment)
    return $.ajax({
      type: 'PUT',
      url: `${apiUrl}/save-guestbook-entry-sequence.json`,
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        name,
        email,
        comment,
      }),
      dataType: 'json',
    });
  }
};

(function() {

  let entriesTemplate;

  function prepareTemplates() {
    entriesTemplate = Handlebars.compile($('#entries-template').html());
  }

  // retrieve entries and update the UI
  function loadEntries() {
    console.log('Loading entries...');
    $('#entries').html('Loading entries...');
    guestbook.get().done(function(result) {
      console.log('estamos a punto de imprimir result')
      console.log(result)
      console.log(result.entries)
      console.log(result.rows)
      if (!result.entries) {
        return;
      }

      const context = {
        entries: result.entries
      }
      $('#entries').html(entriesTemplate(context));
    }).error(function(error) {
      $('#entries').html('No entries');
      console.log(error);
    });
  }

  // intercept the click on the submit button, add the guestbook entry and
  // reload entries on success
  $(document).on('submit', '#addEntry', function(e) {
    e.preventDefault();

    guestbook.add(
      $('#name').val().trim(),
      $('#email').val().trim(),
      $('#comment').val().trim()
    ).done(function(result) {
      // reload entries
      loadEntries();
    }).error(function(error) {
      console.log(error);
    });
  });

  $(document).ready(function() {
    prepareTemplates();
    loadEntries();
  });
})();
