/*jslint  sloppy: true, laxcomma: true, alert: true */
   
  var ImageGallery = {};

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

        // for testing
        //var message = 'Name: ' + name + '\n';
        //message += 'Description: ' + desc + '\n';
        //message += 'Url: '+url;
        
        this.collection.add(this.model);
        //alert(message);
    }
    , render: function () {
        'use strict';
         var html = $(this.template).tmpl();
         $(this.el).html(html);
    }
  });

ImageGallery.ImageListView = Backbone.View.extend({
    tagName: 'ul'
  , template: '#image-preview-template'
  
  , initialize: function () {
      'use strict';
      _.bindAll(this, 'renderImage');
      this.template = $(this.template);
      this.collection.bind('add', this.renderImage, this);
    }
  , renderImage: function (image) {
      'use strict';
      var html = this.template.tmpl(image.toJSON());
      $(this.el).prepend(html);
    }
  , render: function () {
      this.collection.each(this.renderImage);
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

  var imageListView = new ImageGallery.ImageListView({
    collection: images
  });

  imageListView.render();

  $('#image-list').html(imageListView.el);
  
});
