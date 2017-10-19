
var screenSizes = {
  xs: 480,
  sm: 768,
  md: 992,
  lg: 1200
};

Template.layout.onCreated(function () {
  var self = this;
  var skin = 'red';
  var fixed = true;
  var sidebarMini = true;

  document.title = 'LOCUS 그룹웨어';

  if (this.data) {
    skin = this.data.skin || skin;
    fixed = this.data.fixed || fixed;
    sidebarMini = this.data.sidebarMini || sidebarMini;
  }

  self.isReady = new ReactiveVar(false);
  self.style = waitOnCSS(cssUrl());
  self.skin = waitOnCSS(skinUrl(skin));

  fixed && $('body').addClass('fixed');
  sidebarMini && $('body').addClass('sidebar-mini');
  self.removeClasses = function () {
    fixed && $('body').removeClass('fixed');
    sidebarMini && $('body').removeClass('sidebar-mini');
  }
  this.autorun(function () {
    if (self.style.ready() && self.skin.ready()) {
      self.isReady.set(true);
    }
  });

});

Template.layout.onDestroyed(function () {
  this.removeClasses();
  this.style.remove();
  this.skin.remove();
});

Template.layout.helpers({
  isReady: function () {
    return Template.instance().isReady.get();
  },

  loadingTemplate: function () {
    return this.loadingTemplate || 'AdminLTE_loading';
  },
  skin: function () {
    console.log(this.skin);
    return this.skin || 'red';
  }
});

Template.layout.events({
  'click [data-toggle=push-menu]': function (e, t) {
    e.preventDefault();

    //Enable sidebar push menu
    if ($(window).width() > (screenSizes.sm - 1)) {
      $("body").toggleClass('sidebar-collapse');
    }
    //Handle sidebar push menu for small screens
    else {
      if ($("body").hasClass('sidebar-open')) {
        $("body").removeClass('sidebar-open');
        $("body").removeClass('sidebar-collapse')
      } else {
        $("body").addClass('sidebar-open');
      }
    }
  },

  'click .content-wrapper': function (e, t) {
    //Enable hide menu when clicking on the content-wrapper on small screens
    if ($(window).width() <= (screenSizes.sm - 1) && $("body").hasClass("sidebar-open")) {
      $("body").removeClass('sidebar-open');
    }
  },

  'click .sidebar li a': function (e, t) {
    //Get the clicked link and the next element
    var $this = $(e.currentTarget);
    var checkElement = $this.next();

    //Check if the next element is a menu and is visible
    if ((checkElement.is('.treeview-menu')) && (checkElement.is(':visible'))) {
      //Close the menu
      checkElement.slideUp('normal', function () {
        checkElement.removeClass('menu-open');
      });
      checkElement.parent("li").removeClass("active");
    }
    //If the menu is not visible
    else if ((checkElement.is('.treeview-menu')) && (!checkElement.is(':visible'))) {
      //Get the parent menu
      var parent = $this.parents('ul').first();
      //Close all open menus within the parent
      var ul = parent.find('ul:visible').slideUp('normal');
      //Remove the menu-open class from the parent
      ul.removeClass('menu-open');
      //Get the parent li
      var parent_li = $this.parent("li");

      //Open the target menu and add the menu-open class
      checkElement.slideDown('normal', function () {
        //Add the class active to the parent li
        checkElement.addClass('menu-open');
        // parent.find('li.active').removeClass('active');
        parent_li.addClass('active');
      });
    }
    else{
      var parent = $this.parents('ul').first();
      var ul = parent.find('ul:visible').slideUp('normal');
      //Remove the menu-open class from the parent
      ul.removeClass('menu-open');
      parent.find('li.active').removeClass('active');
      var parent_li = $this.parent("li");
      parent_li.addClass('active');
    }
    //if this isn't a link, prevent the page from being redirected
    if (checkElement.is('.treeview-menu')) {
      e.preventDefault();
      return;
    }
    // 모바일에서 닫기.
    if ($("body").hasClass('sidebar-open')) {
      $("body").removeClass('sidebar-open');
      $("body").removeClass('sidebar-collapse')
    } else {
      $("body").addClass('sidebar-open');
    }
  },
  'click #logout' : function (e, t) {
    Meteor.logout();
    FlowRouter.go('/login');
  }
});

function cssUrl () {
  return Meteor.absoluteUrl('packages/supaseca_admin-lte/css/AdminLTE.min.css');
}

function skinUrl (name) {
  return Meteor.absoluteUrl(
    'packages/supaseca_admin-lte/css/skins/skin-' + name + '.min.css');
}

function waitOnCSS (url, timeout) {
  var isLoaded = new ReactiveVar(false);
  timeout = timeout || 5000;

  var link = document.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.href = url;

  link.onload = function () {
    isLoaded.set(true);
  };

  if (link.addEventListener) {
    link.addEventListener('load', function () {
      isLoaded.set(true);
    }, false);
  }

  link.onreadystatechange = function () {
    var state = link.readyState;
    if (state === 'loaded' || state === 'complete') {
      link.onreadystatechange = null;
      isLoaded.set(true);
    }
  };

  var cssnum = document.styleSheets.length;
  var ti = setInterval(function () {
    if (document.styleSheets.length > cssnum) {
      isLoaded.set(true);
      clearInterval(ti);
    }
  }, 10);

  setTimeout(function () {
    isLoaded.set(true);
  }, timeout);

  $(document.head).append(link);

  return {
    ready: function () {
      return isLoaded.get();
    },

    remove: function () {
      $('link[href="' + url + '"]').remove();
    }
  };
}