var viewModel = {
  flash: ko.observable(),
  shownOnce: ko.observable(),
  coffeeName: ko.observable(),
  coffeeDescription: ko.observable(),
  coffeePlace: ko.observable(),
  currentPage: ko.observable(),
  errors: ko.observableArray(),
  items: ko.observableArray(),
  comments: ko.observableArray(),
  selectedItem: ko.observable(),
  newcontent: ko.observable(),
  id_bean: ko.observable(0),
  filter: ko.observable(""),
  

  ItemDetails: {
    updated_at: ko.observable(),
    created_at: ko.observable()
    id: ko.observable(),
    name: ko.observable(),
    description: ko.observable(),
    place: ko.observable(),
    likes: ko.observable(),
  },

  newcomment: {
    coffeebean_id: "",
    content: ""
  },

  newCoffeeBean: {
    name: "",
    description: "",
    place: "",
    likes: 0
  },

  setFlash: function(flash) {
    this.flash(flash);
    this.shownOnce(false);
  },

  checkFlash: function() {
    if (this.shownOnce() == true) {
      this.flash('');
    }
  },
  
  deleteItemDetails: function() {
    this.ItemDetails.id('');
    this.ItemDetails.name('');
    this.ItemDetails.description('');
    this.ItemDetails.place('');
    this.ItemDetails.likes('');
    this.ItemDetails.updated_at('');
    this.ItemDetails.created_at('');
  },
  
  prepareItemDetails : function() {
    this.ItemDetails.id(ko.utils.unwrapObservable(this.selectedItem().id));
    this.ItemDetails.name(ko.utils.unwrapObservable(this.selectedItem().name));
    this.ItemDetails.description(ko.utils.unwrapObservable(this.selectedItem().description));
    this.ItemDetails.place(ko.utils.unwrapObservable(this.selectedItem().place));
    this.ItemDetails.likes(ko.utils.unwrapObservable(this.selectedItem().likes));
    this.ItemDetails.updated_at(ko.utils.unwrapObservable(this.selectedItem().updated_at));
    this.ItemDetails.created_at(ko.utils.unwrapObservable(this.selectedItem().created_at));
  },

  deleteComments: function() {
    this.comments('');
  },
  
  indexBean: function() {
    this.checkFlash();
    this.errors([]);
    this.flash('');
    this.deleteComments();
    $.getJSON('/coffeebeans.json', function(data) {
      viewModel.items(data);
      viewModel.currentPage('index');
      viewModel.shownOnce(true);
    });
  },

  displayBean: function(itemToShow) {
    this.checkFlash();
    this.errors([]);
    this.newcontent('');
    this.selectedItem(itemToShow);
    this.prepareItemDetails();
    var url = '/coffeebeans/' + itemToShow.id + '/comments.json';
    $.getJSON(url, function(data) {
      viewModel.comments(data);
    });
    this.currentPage('show');
    this.shownOnce(true);
    this.id_bean(itemToShow.id);
  },

  newAction: function() {
    this.checkFlash();
    this.currentPage('new');
    this.deleteItemDetails();
    this.shownOnce(true);
  },

  changeBean: function(itemToEdit) {
    this.checkFlash();
    this.selectedItem(itemToEdit);
    this.prepareItemDetails();
    this.currentPage('edit');
    this.shownOnce(true);
  },

  addComment: function() {
    
    this.newcomment.coffeebean_id = this.id_bean();
    this.newcomment.content = this.newcontent();
    var json_data = ko.toJS(this.newcomment);
    
    $.ajax({
      type: 'POST',
      url: '/coffeebeans/' + this.id_bean() + '/comments.json',
      data: {
        // /// 17
        comment: json_data
      },
      dataType: "json",
      success: function(createdItem) {
        viewModel.errors([]);
      
        viewModel.comments.push(viewModel.newcomment);
        viewModel.newcontent('');
      },
      error: function(msg) {
        viewModel.errors(JSON.parse(msg.responseText));
      }
    });
  },

  addNewBean: function() {
    this.newCoffeeBean.name = this.coffeeName();
    this.newCoffeeBean.description = this.coffeeDescription();
    this.newCoffeeBean.place = this.coffeePlace();
    var json_data = ko.toJS(this.newCoffeeBean);
    
    $.ajax({
      type: 'POST',
      url: '/coffeebeans.json',
      data: {
        // /// 17
        coffeebean: json_data
      },
      dataType: "json",
      success: function(createdItem) {
        viewModel.errors([]);
      
        viewModel.items.push(viewModel.newCoffeeBean);
        viewModel.coffeeName('');
        viewModel.coffeeDescription('');
        viewModel.coffeePlace('');
      },
      error: function(msg) {
        viewModel.errors(JSON.parse(msg.responseText));
      }
    });
  },
  // /// 16
  createBean: function(itemToCreate) {
    var json_data = ko.toJS(itemToCreate);
    $.ajax({
      type: 'POST',
      url: '/coffeebeans.json',
      data: {
        // /// 17
        coffeebean: json_data
      },
      dataType: "json",
      success: function(createdItem) {
        viewModel.errors([]);
        viewModel.setFlash('Post successfully created.');
        viewModel.displayBean(createdItem);
      },
      error: function(msg) {
        viewModel.errors(JSON.parse(msg.responseText));
      }
    });
  },

  tryBean: function(itemToUpdate) {
    itemToUpdate.likes(itemToUpdate.likes() + 1);
    var temp = 0;
    var json_data = ko.toJS(itemToUpdate);
    delete json_data.id;
    delete json_data.created_at;
    delete json_data.updated_at;

    $.ajax({
      type: 'PUT',
      url: '/coffeebeans/' + itemToUpdate.id() + '.json',
      data: {
        coffeebean: json_data
      },
      dataType: "json",
      success: function(updatedItem) {
        viewModel.errors([]);
        viewModel.setFlash('Coffee successfully tried');
        viewModel.showAction(updatedItem);
        this.temp(1);
      },
      error: function(msg) {
        viewModel.errors(JSON.parse(msg.responseText));
      }
    });  

  },
  // /// 18
  updateBean: function(itemToUpdate) {
    var json_data = ko.toJS(itemToUpdate);
    delete json_data.id;
    delete json_data.created_at;
    delete json_data.updated_at;

    $.ajax({
      type: 'PUT',
      url: '/coffeebeans/' + itemToUpdate.id() + '.json',
      data: {
        coffeebean: json_data
      },
      dataType: "json",
      success: function(updatedItem) {
        viewModel.errors([]);
        viewModel.setFlash('Post successfully updated.');
        viewModel.displayBean(updatedItem);
      },
      error: function(msg) {
        viewModel.errors(JSON.parse(msg.responseText));
      }
    });
  },
  // /// 19
  deleteBean: function(itemToDestroy) {
    if (confirm('Are you sure?')) {
      $.ajax({
        type: "DELETE",
        url: '/coffeebeans/' + itemToDestroy.id + '.json',
        dataType: "json",
        success: function(){
          viewModel.errors([]);
          viewModel.setFlash('Post successfully deleted.');
          viewModel.indexBean();
        },
        error: function(msg) {
          viewModel.errors(JSON.parse(msg.responseText));
        }
      });
    }
  }
};

ko.utils.stringStartsWith = function (string, startsWith) {         
  string = string || "";
  if (startsWith.length > string.length)
      return false;
  return string.substring(0, startsWith.length) === startsWith;
};

viewModel.filteredItems = ko.computed(function() {
    var filter = this.filter().toLowerCase();
    if (!filter) {
        return this.items();
    } else {
        return ko.utils.arrayFilter(this.items(), function(item) {
            return ko.utils.stringStartsWith(item.name.toLowerCase(), filter);
        });
    }
}, viewModel);


// /// 20
$(document).ready(function() {
  ko.applyBindings(viewModel);
  viewModel.indexBean();
  viewModel.deleteItemDetails();
});
