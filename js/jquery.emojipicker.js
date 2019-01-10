;(function($) {

  var pluginName = "emojiPicker",
      defaults = {
        width: '200',
        height: '350',
        position: 'right',
        fadeTime: 100,
        iconColor: 'black',
        iconBackgroundColor: '#eee',
        recentCount: 36,
        emojiSet: 'apple',
        container: 'body',
        button: true,
        richInput: true
      };

  var MIN_WIDTH = 280,
      MAX_WIDTH = 600,
      MIN_HEIGHT = 100,
      MAX_HEIGHT = 350,
      MAX_ICON_HEIGHT = 50;

  // These are the tabs in the emoji picker for the different categories of emoji
  var categories = [
    { name: 'people', label: 'People' },
    { name: 'nature', label: 'Nature' },
    { name: 'food', label: 'Food' },
    { name: 'activity', label: 'Activities' },
    { name: 'travel', label: 'Travel & Places' },
    { name: 'object', label: 'Objects' },
    { name: 'symbol', label: 'Symbols' },
    { name: 'flag', label: 'Flags' }
  ];

  function EmojiPicker( element, options ) {

    this.element = element;
    this.$el = $(element);

    // This will either be the element or the rich text area.
    this.$input = this.$el;

    this.settings = $.extend( {}, defaults, options );

    this.$container = $(this.settings.container);

    // (type) Safety first
    this.settings.width = parseInt(this.settings.width);
    this.settings.height = parseInt(this.settings.height);

    // Check for valid width/height
    if(this.settings.width >= MAX_WIDTH) {
      this.settings.width = MAX_WIDTH;
    } else if (this.settings.width < MIN_WIDTH) {
      this.settings.width = MIN_WIDTH;
    }
    if (this.settings.height >= MAX_HEIGHT) {
      this.settings.height = MAX_HEIGHT;
    } else if (this.settings.height < MIN_HEIGHT) {
      this.settings.height = MIN_HEIGHT;
    }

    var possiblePositions = [
                              'left',
                              'right',
                            ];
    if($.inArray(this.settings.position,possiblePositions) == -1) {
      this.settings.position = defaults.position; //current default
    }

    // Do not enable if on mobile device (emojis already present)
    if(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      this.init();
    } else {
      this.isMobile = true;
    }

  }

  $.extend(EmojiPicker.prototype, {

    init: function() {
      this.active = false;
      if (this.settings.richInput) {
        this.emojifyInput();
      }
      this.addPickerIcon();
      this.createPicker();
      this.listen();
    },

    // TODO : Placeholder http://stackoverflow.com/questions/20726174/placeholder-for-contenteditable-div

    emojifyInput: function() {
      this.$emojiArea = $('<div>', {
        class: 'emojiArea',
        contenteditable: 'true'
      })

      this.$emojiArea.width( this.$el.width() );
      this.$emojiArea.height( this.$el.height() );

      this.$emojiArea.copyCSS( this.$el, [
        /^(padding|font|color|background|border|margin)/
      ]);

      // TODO : remove visual debugging aid
      // this.$emojiArea.css( 'background-color', '#c8fccf' );

      // Replace the textarea
      this.$el.hide()
        .after(this.$emojiArea);

      this.$input = this.$emojiArea;
    },

    addPickerIcon: function() {
<<<<<<< HEAD
      // The wrapper is not needed if they have chosen to not use a button
      if (this.settings.button) {
        var elementHeight = this.$el.outerHeight();
        var iconHeight = elementHeight > MAX_ICON_HEIGHT ?
          MAX_ICON_HEIGHT :
          elementHeight;

        // This can cause issues if the element is not visible when it is initiated
        var objectWidth = this.$el.width();

        this.$el.width(objectWidth);

        this.$wrapper = this.$el
          .wrap("<div class='emojiPickerIconWrap'></div>")
          .parent();
=======
      var elementHeight = this.$input.outerHeight();
      var iconHeight = elementHeight > MAX_ICON_HEIGHT ?
        MAX_ICON_HEIGHT :
        elementHeight;
      var objectWidth = this.$input.width();

      this.$input.width(objectWidth)

      this.$wrapper = this.$input
        .wrap("<div class='emojiPickerIconWrap'></div>")
        .parent()
>>>>>>> content-editable

        this.$icon = $('<div class="emojiPickerIcon"></div>')
          .height(iconHeight)
          .width(iconHeight)
          .addClass(this.settings.iconColor)
          .css('backgroundColor', this.settings.iconBackgroundColor);
          this.$wrapper.append( this.$icon );
      }

    },

    createPicker: function() {

      // Show template
      this.$picker = $( getPickerHTML() )
        .appendTo( this.$container )
        .width(this.settings.width)
        .height(this.settings.height)
        .css('z-index',10000);

      // Picker height
      this.$picker.find('.sections')
        .height(parseInt(this.settings.height) - 40); // 40 is height of the tabs

      // Tab size based on width
      if (this.settings.width < 240) {
        this.$picker.find('.emoji').css({'width':'1em', 'height':'1em'});
      }

    },

    destroyPicker: function() {
      if (this.isMobile) return this;

      this.$picker.unbind('mouseover');
      this.$picker.unbind('mouseout');
      this.$picker.unbind('click');
      this.$picker.remove();

      $.removeData(this.$el.get(0), 'emojiPicker');

      return this;
    },

    listen: function() {
      // If the button is being used, wrapper has not been set,
      //    and will not need a listener
      if (this.settings.button){
        // Clicking on the picker icon
        this.$wrapper.find('.emojiPickerIcon')
          .click( $.proxy(this.iconClicked, this) );
      }

      // Click event for emoji
      this.$picker.on('click', 'em', $.proxy(this.emojiClicked, this));

      // Hover event for emoji
      this.$picker.on('mouseover', 'em', $.proxy(this.emojiMouseover, this) );
      this.$picker.on('mouseout',  'em', $.proxy(this.emojiMouseout, this) );

      // Click event for active tab
      this.$picker.find('nav .tab')
        .click( $.proxy(this.emojiCategoryClicked, this) )
        .mouseover( $.proxy(this.emojiTabMouseover, this) )
        .mouseout( $.proxy(this.emojiMouseout, this) );

      // Scroll event for active tab
      this.$picker.find('.sections')
        .scroll($.proxy(this.emojiScroll, this));

      // Clicking inside and outside of the picker
      this.$picker
        .click( $.proxy(this.pickerClicked, this) );
      $(document.body)
        .click( $.proxy(this.clickOutside, this) );
    },

    updatePosition: function() {
      var top, left;
      if (this.settings.container === 'body') {
          top = this.$input.offset().top + this.$input.height();
          left = this.$input.offset().left;
      }
      else {
          top = this.$input.position().top + this.$input.height();
          left = this.$input.position().left;
      }
      elOffset.top += this.$el.outerHeight();

      // Step 3
      var diffOffset = {
        top: (elOffset.top - parentOffset.top),
        left: (elOffset.left - parentOffset.top)
      };

      this.$picker.css({
        top: diffOffset.top,
        left: diffOffset.left
      });

      return this;
    },

    hide: function() {
      this.$picker.hide(this.settings.fadeTime, 'linear', function() {
        this.active = false;
        if (this.settings.onHide) {
          this.settings.onHide( this.$picker, this.settings, this.active );
        }
      }.bind(this));
    },

    show: function() {
      this.$input.focus();
      this.updatePosition();
      this.$picker.show(this.settings.fadeTime, 'linear', function() {
        this.active = true;
        if (this.settings.onShow) {
          this.settings.onShow( this.$picker, this.settings, this.active );
        }
      }.bind(this));
    },

    /************
     *  EVENTS  *
     ************/

    iconClicked : function() {
      if ( this.$picker.is(':hidden') ) {
        this.show();
        if( this.$picker.find('.search input').length > 0 ) {
          this.$picker.find('.search input').focus();
        }
      } else {
        this.hide();
      }
    },

    emojiClicked: function(e) { var clickTarget = $(e.target);
      var emojiSpan;
      if (clickTarget.is('em')) {
        emojiSpan = clickTarget.find('span');
      } else {
        emojiSpan = clickTarget.parent().find('.emoji');
      }

      var emojiShortcode = emojiSpan.attr('class').split('emoji-')[1];
      var emojiUnicode = toUnicode(findEmoji(emojiShortcode).unicode[defaults.emojiSet]);

      if (this.settings.richInput) {
        var emoji = $(emojiHTML( emojiShortcode, emojiUnicode ));
        this.$input.focus();
        insertTextAtCursor( emoji );

      } else {
        insertAtCaret(this.element, emojiUnicode);
      }
      addToLocalStorage(emojiShortcode);
      updateRecentlyUsed(emojiShortcode);

      // For anyone who is relying on the keyup event
      $(this.element).trigger("keyup");

      // trigger change event on input
      var event = document.createEvent("HTMLEvents");
      event.initEvent("input", true, true);
      this.element.dispatchEvent(event);
    },

    emojiCategoryClicked: function(e) {
      var section = '';

      // Update tab
      this.$picker.find('nav .tab').removeClass('active');
      if ($(e.target).parent().hasClass('tab')) {
        section = $(e.target).parent().attr('data-tab');
        $(e.target).parent('.tab').addClass('active');
      }
      else {
        section = $(e.target).attr('data-tab');
        $(e.target).addClass('active');
      }

      var $section = this.$picker.find('section.' + section);

      var heightOfSectionsHidden = $section.parent().scrollTop();
      var heightOfSectionToPageTop = $section.offset().top;
      var heightOfSectionsToPageTop = $section.parent().offset().top;

      var scrollDistance = heightOfSectionsHidden
                           + heightOfSectionToPageTop
                           - heightOfSectionsToPageTop;

      $('.sections').off('scroll'); // Disable scroll event until animation finishes

      var that = this;
      $('.sections').animate({
        scrollTop: scrollDistance
      }, 250, function() {
        that.$picker.find('.sections').on('scroll', $.proxy(that.emojiScroll, that) ); // Enable scroll event
      });
    },

    emojiTabMouseover: function(e) {
      var section = '';
      if ($(e.target).parent().hasClass('tab')) {
        section = $(e.target).parent().attr('data-tab');
      }
      else {
        section = $(e.target).attr('data-tab');
      }

      var categoryTitle = '';
      for (var i = 0; i < categories.length; i++) {
        if (categories[i].name == section) { categoryTitle = categories[i].label; }
      }
      if (categoryTitle == '') { categoryTitle = 'Recently Used'; }

      var categoryCount = $('section.' + section).attr('data-count');
      var categoryHtml = '<em class="tabTitle">' + categoryTitle + ' <span class="count">(' + categoryCount + ' emojis)</span></em>';

      var $shortcode = $(e.target).parents('.emojiPicker').find('.shortcode');
      $shortcode.find('.random').hide();
      $shortcode.find('.info').show().html(categoryHtml);
    },

    emojiScroll: function(e) {
      var sections = $('section');
      $.each(sections, function(key, value) {
        var section = sections[key];
        var offsetFromTop = $(section).position().top;

        if (section.className == 'search' || (section.className == 'people' && offsetFromTop > 0)) {
          $(section).parents('.emojiPicker').find('nav tab.recent').addClass('active');
          return;
        }

        if (offsetFromTop <= 0) {
          $(section).parents('.emojiPicker').find('nav .tab').removeClass('active');
          $(section).parents('.emojiPicker').find('nav .tab[data-tab=' + section.className + ']').addClass('active');
        }
      });
    },

    pickerClicked: function(e) {
      e.stopPropagation();
    },

    clickOutside: function(e) {
      if ( this.active ) {
        this.hide();
      }
    },

    searchCharEntered: function(e) {
      var searchTerm = $(e.target).val();
      var searchEmojis = $(e.target).parents('.sections').find('section.search');
      var searchEmojiWrap = searchEmojis.find('.wrap');
      var sections = $(e.target).parents('.sections').find('section');

      // Clear if X is clicked within input
      if (searchTerm == '') {
        sections.show();
        searchEmojiWrap.hide();
      }

      if (searchTerm.length > 0) {
        sections.hide();
        searchEmojis.show();
        searchEmojiWrap.show();

        var results = [];
        searchEmojiWrap.find('em').remove();

        $.each($.fn.emojiPicker.emojis, function(i, emoji) {
          var shortcode = emoji.shortcode;
          if ( shortcode.indexOf(searchTerm) > -1 ) {
            results.push('<em><div class="emoji emoji-' + shortcode + '"></div></em>');
          }
        });
        searchEmojiWrap.append(results.join(''));
      } else {
        sections.show();
        searchEmojiWrap.hide();
      }
    }
  });

  $.fn[ pluginName ] = function ( options ) {

    // Calling a function
    if (typeof options === 'string') {
      this.each(function() {
        var plugin = $.data( this, pluginName );
        switch(options) {
          case 'toggle':
            plugin.iconClicked();
            break;
          case 'destroy':
            plugin.destroyPicker();
            break;
        }
      });
      return this;
    }

    this.each(function() {
      // Don't attach to the same element twice
      if ( !$.data( this, pluginName ) ) {
        $.data( this, pluginName, new EmojiPicker( this, options ) );
      }
    });
    return this;
  };

  /* ---------------------------------------------------------------------- */

  /*
   * getStyleObject Plugin for jQuery JavaScript Library
   * From: http://upshots.org/?p=112
   */
  $.fn.getStyleObject = function(){
      var dom = this.get(0);
      var style;
      var returns = {};
      if(window.getComputedStyle){
          var camelize = function(a,b){
              return b.toUpperCase();
          };
          style = window.getComputedStyle(dom, null);
          for(var i = 0, l = style.length; i < l; i++){
              var prop = style[i];
              var camel = prop.replace(/\-([a-z])/g, camelize);
              var val = style.getPropertyValue(prop);
              returns[camel] = val;
          };
          return returns;
      };
      if(style = dom.currentStyle){
          for(var prop in style){
              returns[prop] = style[prop];
          };
          return returns;
      };
      return this.css();
  }

  $.fn.copyCSS = function(source, attributes){
    var styles = $(source).getStyleObject();
    var copiedStyles = {};
    for (var i in attributes) {
      var attr = attributes[i];
      if ( attr instanceof RegExp ) {
        for (prop in styles) {
          if (prop.match(attr))
            copiedStyles[ prop ] = styles[ prop ];
        }
      } else {
        if (attr in styles)
          copiedStyles[ attr ] = styles[ attr ];
      }
    };
    this.css(copiedStyles);
  }

  function emojiHTML(shortcode,unicode) {
    return '<span class="emoji emoji-' + shortcode + '">' + unicode + '</span>';
  }

  function getPickerHTML() {
    var nodes = [];
    var aliases = {
      'undefined': 'object'
    }
    var items = {};
    var localStorageSupport = (typeof(Storage) !== 'undefined') ? true : false;

    // Re-Sort Emoji table
    $.each($.fn.emojiPicker.emojis, function(i, emoji) {
      var category = aliases[ emoji.category ] || emoji.category;
      items[ category ] = items[ category ] || [];
      items[ category ].push( emoji );
    });

    nodes.push('<div class="emojiPicker">');
    nodes.push('<nav>');

    // Recent Tab, if localstorage support
    if (localStorageSupport) {
      nodes.push('<div class="tab active" data-tab="recent"><div class="emoji emoji-tab-recent"></div></div>');
    }

    // Emoji category tabs
    var categories_length = categories.length;
    for (var i = 0; i < categories_length; i++) {
      nodes.push('<div class="tab' +
      ( !localStorageSupport && i == 0 ? ' active' : '' ) +
      '" data-tab="' +
      categories[i].name +
      '"><div class="emoji emoji-tab-' +
      categories[i].name +
      '"></div></div>');
    }
    nodes.push('</nav>');
    nodes.push('<div class="sections">');

    // Search
    nodes.push('<section class="search">');
    nodes.push('<input type="search" placeholder="Search...">');
    nodes.push('<div class="wrap" style="display:none;"><h1>Search Results</h1></div>');
    nodes.push('</section>');

    // Recent Section, if localstorage support
    if (localStorageSupport) {
      var recentlyUsedEmojis = [];
      var recentlyUsedCount = 0;
      var displayRecentlyUsed = ' style="display:none;"';

      if (localStorage.emojis) {
        recentlyUsedEmojis = JSON.parse(localStorage.emojis);
        recentlyUsedCount = recentlyUsedEmojis.length;
        displayRecentlyUsed = ' style="display:block;"';
      }

      nodes.push('<section class="recent" data-count="' + recentlyUsedEmojis.length + '"' + displayRecentlyUsed + '>');
      nodes.push('<h1>Recently Used</h1><div class="wrap">');

      for (var i = recentlyUsedEmojis.length-1; i > -1 ; i--) {
        nodes.push('<em><span class="emoji emoji-' + recentlyUsedEmojis[i] + '"></span></em>');
      }
      nodes.push('</div></section>');
    }

    // Emoji sections
    for (var i = 0; i < categories_length; i++) {
      var category_length = items[ categories[i].name ].length;
      nodes.push('<section class="' + categories[i].name + '" data-count="' + category_length + '">');
      nodes.push('<h1>' + categories[i].label + '</h1><div class="wrap">');
      for (var j = 0; j < category_length; j++) {
        var emoji = items[ categories[i].name ][ j ];
        nodes.push('<em><span class="emoji emoji-' + emoji.shortcode + '"></span></em>');
      }
      nodes.push('</div></section>');
    }
    nodes.push('</div>');

    // Shortcode section
    nodes.push('<div class="shortcode"><span class="random">');
    nodes.push('<em class="tabTitle">' + generateEmojiOfDay() + '</em>');
    nodes.push('</span><span class="info"></span></div>');

    nodes.push('</div>');
    return nodes.join("\n");
  }

  function generateEmojiOfDay() {
    var emojis = $.fn.emojiPicker.emojis;
    var i = Math.floor(Math.random() * (364 - 0) + 0);
    var emoji = emojis[i];
    return 'Daily Emoji: <span class="eod"><span class="emoji emoji-' + emoji.name + '"></span> <span class="emojiName">' + emoji.name + '</span></span>';
  }

  function findEmoji(emojiShortcode) {
    var emojis = $.fn.emojiPicker.emojis;
    for (var i = 0; i < emojis.length; i++) {
      if (emojis[i].shortcode == emojiShortcode) {
        return emojis[i];
      }
    }
  }

  // For contenteditable
  function insertTextAtCursor(text) {
    var sel, range, html;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode( document.createTextNode(text) );
        }
    } else if (document.selection && document.selection.createRange) {
        document.selection.createRange().text = text;
    }
  }

  // For text area
  function insertAtCaret(inputField, myValue) {
    if (document.selection) {
      //For browsers like Internet Explorer
      inputField.focus();
      var sel = document.selection.createRange();
      sel.text = myValue;
      inputField.focus();
    }
    else if (inputField.selectionStart || inputField.selectionStart == '0') {
      //For browsers like Firefox and Webkit based
      var startPos = inputField.selectionStart;
      var endPos = inputField.selectionEnd;
      var scrollTop = inputField.scrollTop;
      inputField.value = inputField.value.substring(0, startPos)+myValue+inputField.value.substring(endPos,inputField.value.length);
      inputField.focus();
      inputField.selectionStart = startPos + myValue.length;
      inputField.selectionEnd = startPos + myValue.length;
      inputField.scrollTop = scrollTop;
    } else {
      inputField.focus();
      inputField.value += myValue;
    }
  }

  function toUnicode(code) {
    var codes = code.split('-').map(function(value, index) {
      return parseInt(value, 16);
    });
    return String.fromCodePoint.apply(null, codes);
  }

  function addToLocalStorage(emoji) {
    var recentlyUsedEmojis = [];
    if (localStorage.emojis) {
      recentlyUsedEmojis = JSON.parse(localStorage.emojis);
    }

    // If already in recently used, move to front
    var index = recentlyUsedEmojis.indexOf(emoji);
    if (index > -1) {
      recentlyUsedEmojis.splice(index, 1);
    }
    recentlyUsedEmojis.push(emoji);

    if (recentlyUsedEmojis.length > defaults.recentCount) {
      recentlyUsedEmojis.shift();
    }

    localStorage.emojis = JSON.stringify(recentlyUsedEmojis);
  }

  function updateRecentlyUsed(emoji) {
    var recentlyUsedEmojis = JSON.parse(localStorage.emojis);
    var emojis = [];
    var recent = $('section.recent');

    for (var i = recentlyUsedEmojis.length-1; i >= 0; i--) {
      emojis.push('<em><span class="emoji emoji-' + recentlyUsedEmojis[i] + '"></span></em>');
    }

    // Fix height as emojis are added
    var prevHeight = recent.outerHeight();
    $('section.recent .wrap').html(emojis.join(''));
    var currentScrollTop = $('.sections').scrollTop();
    var newHeight = recent.outerHeight();
    var newScrollToHeight = 0;

    if (!$('section.recent').is(':visible')) {
      recent.show();
      newScrollToHeight = newHeight;
    } else if (prevHeight != newHeight) {
      newScrollToHeight = newHeight - prevHeight;
    }

    $('.sections').animate({
      scrollTop: currentScrollTop + newScrollToHeight
    }, 0);
  }

  if (!String.fromCodePoint) {
    // ES6 Unicode Shims 0.1 , © 2012 Steven Levithan http://slevithan.com/ , MIT License
    String.fromCodePoint = function fromCodePoint () {
        var chars = [], point, offset, units, i;
        for (i = 0; i < arguments.length; ++i) {
            point = arguments[i];
            offset = point - 0x10000;
            units = point > 0xFFFF ? [0xD800 + (offset >> 10), 0xDC00 + (offset & 0x3FF)] : [point];
            chars.push(String.fromCharCode.apply(null, units));
        }
        return chars.join("");
    }
  }

})(jQuery);
