
$(document).ready(function () {
  $('a[data-image-trigger]').click(function (event) {
    $('input[data-image-upload]').click();
    event.preventDefault();
  });

  $('input[data-image-upload]').change(function (event) {
    $("form[data-image-form]").submit(function (e) {

      var formData = new FormData($(this)[0]);
      var bucket = $(event.currentTarget).data('image-upload');
      $(event.currentTarget).parent().append('<i data-image-loading class="fa fa-spinner fa-pulse"></i>')
      $.ajax({
        url: bucket,
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function (media) {
          
          var img = document.createElement('img');
          img.src = media.imageUrl;
          $(event.currentTarget).parent().replaceWith(img);
          var input = document.createElement('input');
          input.type = 'hidden';
          input.value = media._id;
          input.name = 'photos[0]';
          $("form[name='sellitem']").append(input);
        },
      });
      e.preventDefault();
    });
    $("form[data-image-form]").submit();
  });
});
