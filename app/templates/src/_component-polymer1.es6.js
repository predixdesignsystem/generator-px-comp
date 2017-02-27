(function() {
  'use strict';

  class <%= camelName %> {
    /* Name for the component */
    get is() { return '<%= name %>'; }

    /* Behaviors to import for this component */
    <% if (mixinNames) {%>get behaviors() { return [<%= mixinNames.join(',') %>]; <% } %>

    /* Properties for this component */
    get properties() {
      return {
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
      };
    }

    /**
    * Handles click on the element defined in 'on-click' on the template.
    *
    * @method handleClick
    */
    handleClick() {
      this.increment();
    }

    /**
    * Increments the counter
    *
    * @method increment
    */
    increment() {
      this.counterValue++;
    }

  }

  /* Register this element with the Polymer constructor */
  Polymer(<%= camelName %>);
})();
