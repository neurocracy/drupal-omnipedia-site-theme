// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Sidebars state
// -----------------------------------------------------------------------------

// This provides a centralized API and events for the sidebars state. Note that
// this assumes there is only once instance of the sidebars container on the
// page, and in the edge case that more than one is present, only the first will
// be used.

AmbientImpact.on([
  'hashMatcher',
  'OmnipediaSiteThemeSidebarsElements',
  'responsiveStyleProperty',
], function(aiHashMatcher, sidebarsElements, aiResponsiveStyleProperty, $) {
AmbientImpact.addComponent('OmnipediaSiteThemeSidebarsState', function(
  sidebarsState, $
) {

  'use strict';

  /**
   * Whether we've attached the behaviour.
   *
   * @type {Boolean}
   */
  let behaviourAttached = false;

  /**
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = this.getName();

  /**
   * The CSS custom property name that we watch for the off-canvas state.
   *
   * The expected value should be a string of either:
   *
   * - 'true': the layout is in compact mode with the anchor visible.
   *
   * - 'false': the layout has the sidebars beside the content column, so the
   *   anchor is hidden.
   *
   * This allows us to detect the current state of the sidebars, which
   * delegates the state to CSS without having to hard code any media queries
   * in JavaScript.
   *
   * @type {String}
   */
  const offCanvasStatePropertyName = '--omnipedia-sidebars-off-canvas';

  /**
   * The name that the responsive property instance is saved under.
   *
   * This should be unique so it doesn't potentially colide with another
   * instance saved to the same element.
   *
   * @type {String}
   */
  const responsivePropertyInstanceName = 'offCanvasResponsiveStyleProperty';

  /**
   * Whether the sidebars are currently off-canvas, i.e. on a narrow screen.
   *
   * @return {Boolean}
   */
  this.isOffCanvas = function() {

    if (behaviourAttached === false) {
      return false;
    }

    return (
      sidebarsElements.getSidebarsContainer()
      .prop(responsivePropertyInstanceName).getValue() === 'true'
    );

  };

  /**
   * Whether the off-canvas sidebars menu is currently open.
   *
   * Note that this doesn't consider whether the sidebars are actually in
   * off-canvas mode. This method should be used in conjuction with
   * this.isOffCanvas() for that purpose.
   *
   * @return {Boolean}
   *
   * @see this.isOffCanvas()
   */
  this.isMenuOpen = function() {
    return sidebarsElements.getSidebarsMenuOpen().prop('hashMatcher').matches();
  };

  /**
   * Open the menu.
   */
  this.openMenu = function() {
    sidebarsElements.getSidebarsMenuOpen().prop('hashMatcher').setActive();
  };

  /**
   * Close the menu.
   */
  this.closeMenu = function() {
    sidebarsElements.getSidebarsMenuOpen().prop('hashMatcher').setInactive();
  };

  /**
   * Menu close control click event handler.
   *
   * @param {jQuery.Event} event
   *   The jQuery Event object.
   */
  function menuCloseClickHandler(event) {

    if (sidebarsState.isOffCanvas() === true) {
      sidebarsState.closeMenu();
    }

    event.preventDefault();

  };

  this.addBehaviour(
    'OmnipediaSiteThemeSidebarsState',
    'omnipedia-site-theme-sidebars-state',
    sidebarsElements.getSidebarsBehaviourSelector(),
    function(context, settings) {

      if (behaviourAttached === true) {
        return;
      }

      /**
       * The menu open control jQuery collection.
       *
       * @type {jQuery}
       */
      let $menuOpen = sidebarsElements.getSidebarsMenuOpen();

      /**
       * The hash value stored in the open link's 'hash' property.
       *
       * @type {USVString}
       */
      const menuOpenHash = $menuOpen.prop('hash');

      /**
       * Hash matcher instance.
       *
       * @type {hashMatcher}
       */
      let hashMatcher = aiHashMatcher.create(menuOpenHash);

      $menuOpen.prop('hashMatcher', hashMatcher);

      $(document).on('hashMatchChange.' + eventNamespace, function(
        event, hash, matches
      ) {

        if (hash !== menuOpenHash) {
          return;
        }

        if (matches === true) {
          sidebarsElements.getSidebarsContainer().trigger(
            'omnipediaSidebarsMenuOpen'
          );

        } else {
          sidebarsElements.getSidebarsContainer().trigger(
            'omnipediaSidebarsMenuClose'
          );
        }

      });

      sidebarsElements.getSidebarsMenuClose().on(
        'click.' + eventNamespace, menuCloseClickHandler
      );

      /**
       * A responsive style property instance; watches off canvas state.
       *
       * @type {responsiveStyleProperty}
       */
      let responsiveStyleProperty = aiResponsiveStyleProperty.create(
        offCanvasStatePropertyName, sidebarsElements.getSidebarsContainer()
      );

      // If the menu is open and the viewport is resized so the sidebars are no
      // longer off-canvas, close the menu so that the page isn't left in a
      // state that may make it unusable.
      sidebarsElements.getSidebarsContainer()
      .on('responsivePropertyChange.' + eventNamespace, function(
        event, instance
      ) {

        // Ignore any other instance's events.
        if (instance.getPropertyName() !== offCanvasStatePropertyName) {
          return;
        }

        if (sidebarsState.isOffCanvas() === false) {
          sidebarsState.closeMenu();
        }

      });

      sidebarsElements.getSidebarsContainer().prop(
        responsivePropertyInstanceName, responsiveStyleProperty
      );

      behaviourAttached = true;

    },
    function(context, settings, trigger) {

      if (behaviourAttached === false) {
        return;
      }

      /**
       * The sidebars container jQuery collection.
       *
       * @type {jQuery}
       */
      let $sidebarsContainer = sidebarsElements.getSidebarsContainer();

      /**
       * The menu open control jQuery collection.
       *
       * @type {jQuery}
       */
      let $menuOpen = sidebarsElements.getSidebarsMenuOpen();

      sidebarsElements.getSidebarsMenuClose().off(
        'click.' + eventNamespace, menuCloseClickHandler
      );

      $(document).off('hashMatchChange.' + eventNamespace);

      $menuOpen.prop('hashMatcher').destroy();

      $menuOpen.removeProp('hashMatcher');

      $sidebarsContainer.off('responsivePropertyChange.' + eventNamespace);

      $sidebarsContainer.prop(responsivePropertyInstanceName).destroy();

      $sidebarsContainer.removeProp(responsivePropertyInstanceName);

      behaviourAttached = false;

    }
  );

});
});
