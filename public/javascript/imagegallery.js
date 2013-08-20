/*jslint  sloppy: true, laxcomma: true, alert: true */
   
  var ImageGallery = {};

  ImageGallery.vent = _.extend({}, Backbone.Events);

  ImageGallery.Image = Backbone.Model.extend({
  });
  
  ImageGallery.ImageCollection = Backbone.Collection.extend({
    model: ImageGallery.Image
  });

  ImageGallery.AddImageView = Backbone.View.extend({
      id: 'add-image-form'
      
    , template: '#add-image-template'

    , events: {
        'change #name': 'nameChanged'
      , 'change #description': 'descriptionChanged'
      , 'change #url': 'urlChanged'
      , 'click #save': 'saveImage'
      }
    , nameChanged: function (e) {
        'use strict';
        var value = $(e.currentTarget).val();
        this.model.set({name: value});
    }
    , descriptionChanged: function (e) {
        'use strict';
        var value = $(e.currentTarget).val();
        this.model.set({description: value});
    }
    , urlChanged: function (e) {
        'use strict';
        var value = $(e.currentTarget).val();
        this.model.set({url: value});
        this.$('#preview').attr('src', value);
      }
    , saveImage: function (e) {
        'use strict';
        e.preventDefault();
        var name = this.model.get('name')
          , desc = this.model.get('description')
          , url  = this.model.get('url');

        this.collection.add(this.model);
    }
    , render: function () {
        'use strict';
         var html = $(this.template).tmpl();
         $(this.el).html(html);
    }
  });

ImageGallery.ImageListView = Backbone.View.extend({
    tagName: 'ul'
  
  , initialize: function () {
      'use strict';
      _.bindAll(this, 'renderImage');
      this.collection.bind('add', this.renderImage, this);
    }
  , renderImage: function (image) {
      'use strict';
      var imagePreview = new ImageGallery.ImagePreview({
        model: image
      });
      imagePreview.render();
      $(this.el).prepend(imagePreview.el);
    }
  , render: function () {
      this.collection.each(this.renderImage);
    }

});

ImageGallery.ImagePreview = Backbone.View.extend({
    template: '#image-preview-template'

  , events: {
        'click a': 'imageClicked'
    }

  , initialize: function () {
      this.template = $(this.template);
    }

  , imageClicked: function (e) {
      "use strict";
      e.preventDefault();
      ImageGallery.vent.trigger('image:selected', this.model);
    }

  , render: function () {
      var html = this.template.tmpl(this.model.toJSON());
      $(this.el).html(html);
    }
});

ImageGallery.ImageView = Backbone.View.extend({
    template: '#image-view-template'
  , className: 'image-view'

  , render: function () {
      var html = $(this.template).tmpl(this.model.toJSON());
      $(this.el).html(html);
    }
});

ImageGallery.addImage = function (images) {
  var image = new ImageGallery.Image();
  var addImageView = new ImageGallery.AddImageView({
      model: image
    , collection: images
  });
  addImageView.render();

  $('#main').html(addImageView.el);

};

ImageGallery.showImage = function (image) {
  var imageView = new ImageGallery.ImageView({
    model: image
  });
  imageView.render();
  $('#main').html(imageView.el);
}

$(function(){
  'use strict';
  var imageData = [
    {
        id: 1
      , url: '/images/islands.jpeg'
      , name: 'Some island'
      , description: 'Some islands at sunset'
    },
    {
        id: 2
      , url: '/images/mountain.jpeg'
      , name: 'A mountain top hi'
      , description : 'A mountain with a grassy hill and tree in front.'
    },
    {
        id: 3
      , url: '/images/wrench.jpeg'
      , name: 'A rusty wrench'
      , description: 'A close up view of a rusy wrench, with a great color and texture on it.'
    },
    {
        id: 4
      , url: '/images/flower.jpeg'
      , name: 'A purple flower'
      , description: 'A purple flower with a water drop hanging off another plant'
    }
  ];

  var images = new ImageGallery.ImageCollection(imageData);
  
  ImageGallery.addImage(images);
  images.bind('add', function () {
    ImageGallery.addImage(images);
  });

  ImageGallery.vent.bind('image:selected', ImageGallery.showImage);

  var imageListView = new ImageGallery.ImageListView({
    collection: images
  });

  imageListView.render();

  $('#image-list').html(imageListView.el);
  
});
