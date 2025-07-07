// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Header Headroom.js functionality
// -----------------------------------------------------------------------------

// This initializes Headroom.js instances for the branding region, the primary
// menu region, and the search anchor, and handles syncing various events
// between them.

AmbientImpact.on([
  'headroom', 'OmnipediaSiteThemeHeaderElements'
], function(aiHeadroom, headerElements, $) {
AmbientImpact.addComponent('OmnipediaSiteThemeHeaderHeadroom', function(
  headerHeadroom, $
) {

  'use strict';

  /**
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = this.getName();

  /**
   * The selector to match elements to apply Headroom.js to.
   *
   * The first two should be self explanatory. The reason we also apply to
   * .search-anchor is that we need that element to also hide when the primary
   * menu region does, so that the clickable space isn't on screen but
   * invisible.
   *
   * @type {String}
   */
  const headroomElementsSelector = [
    'header[role="banner"]',
    '.region-primary-menu',
    '.search-anchor',
  ].join(',');

  // We want this to be detached on leaving a page and before rendering a
  // cached snapshot, but critically we should not detach
  // on 'refreshless:before-cache' because that will cause the header to pop
  // in to view before the page has transitioned out.
  //
  // @todo Fix delaying caching not working in RefreshLess and remove this?
  const triggers = AmbientImpact.defaults.detachTriggers.filter(
    (trigger) => trigger !== 'refreshless:before-cache',
  );

  triggers.push('refreshless:cached-snapshot');

  this.addBehaviour(
    'OmnipediaSiteThemeHeaderHeadroom',
    'omnipedia-site-theme-header-headroom',
    headerElements.getHeaderBehaviourSelector(),
    triggers,
    function(context, settings) {

      /**
       * Elements to have Headroom.js applied, wrapped in a jQuery collection.
       *
       * @type {jQuery}
       */
      let $elements = $(headroomElementsSelector, context);

      for (let i = 0; i < $elements.length; i++) {
        aiHeadroom.init($elements[i], {
          // The headroom component has trouble setting a correct top offset, so
          // this ensures that the top/not top classes get set when expected.
          offset: 0
        });
      }

      // Synchronize pin, freeze, and unfreeze between the elements. This is
      // needed so that both elements are pinned and frozen at the same time
      // when focus is inside one of them.
      $elements
      .on('headroomPin.' + eventNamespace, function(event) {

        for (let i = 0; i < $elements.length; i++) {

          const currentHeadroom = $elements.eq(i).prop('headroom');

          // Use Headroom's method that abstracts whatever classes are
          // configured so we don't have to fetch those ourselves. This is
          // necessary to ensure we don't trigger the event unnecessarily and/or
          // recursively because neither the component nor Headroom actually
          if (currentHeadroom.hasClass('pinned')) {
            continue;
          }

          currentHeadroom.pin();

        }

      })
      .on('headroomFreeze.' + eventNamespace, function(event) {
        // The Headroom component will not apply freeze and will not trigger the
        // event if the element is already frozen so no checks are needed here.
        for (let i = 0; i < $elements.length; i++) {
          $elements[i].headroom.freeze();
        }
      })
      .on('headroomUnfreeze.' + eventNamespace, function(event) {
        // The Headroom component will not unfreeze and will not trigger the
        // event if the element is already unfrozen so no checks are needed
        // here.
        for (let i = 0; i < $elements.length; i++) {
          $elements[i].headroom.unfreeze();
        }
      });

    },
    function(context, settings, trigger) {

      /**
       * Elements that have Headroom.js applied, wrapped in a jQuery collection.
       *
       * @type {jQuery}
       */
      let $elements = $(headroomElementsSelector, context);

      $elements.off([
        'headroomPin.'      + eventNamespace,
        'headroomFreeze.'   + eventNamespace,
        'headroomUnfreeze.' + eventNamespace,
      ].join(' '));

      // Destroy Headroom.js instances if found.
      for (let i = 0; i < $elements.length; i++) {
        if (
          AmbientImpact.objectPathExists('headroom.destroy', $elements[i]) &&
          typeof $elements[i].headroom.destroy === 'function'
        ) {
          $elements[i].headroom.destroy();
        }
      }

    }
  );

});
});
