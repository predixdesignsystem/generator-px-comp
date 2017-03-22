(function() {
  Polymer({

    is: '<%= name %>', <% if (mixinNames) {%> behaviors: [<%= mixinNames.join(',') %>], <% } %>

    properties: {
      /**
      * This property keeps track of the number of clicks.
      *
      * @property counterValue
      */
      counterValue: {
        type: Number,
        value: 0,
        notify: true
      }
    },

    /**
    * Handles click on the element defined in 'on-click' on the template.
    *
    * @method handleClick
    */
    handleClick: function(event, detail, sender) {
      this.increment();
    },

    /**
    * Increments the counter
    *
    * @method increment
    */
    increment: function() {
      this.counterValue++;
    }
  });
})();
