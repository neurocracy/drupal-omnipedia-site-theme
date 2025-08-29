// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Header Headroom.js functionality
// -----------------------------------------------------------------------------

// This initializes Headroom.js instances for the branding region, the primary
// menu region, and the search anchor, and handles syncing various events
// between them.

AmbientImpact.onGlobals(['once'], function() {
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

  /**
   * Class added to prevent transitions when switching from preview to fresh.
   *
   * This is primarily to prevent the header shadow briefly being shown and then
   * disappearing if initialized at the top.
   *
   * @type {String}
   */
  const lockTopClass = 'headroom--lock-top';

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

  /**
   * Attach to the provided context element.
   *
   * @param {HTMLElement} context
   */
  const attach = (context) => {

    /**
     * Elements to have Headroom.js applied, wrapped in a jQuery collection.
     *
     * @type {jQuery}
     */
    const $elements = $(headroomElementsSelector, context);

    for (let i = 0; i < $elements.length; i++) {

      aiHeadroom.init($elements[i], {
        // The headroom component has trouble setting a correct top offset, so
        // this ensures that the top/not top classes get set when expected.
        offset: 0,
      });

    }

    // Remove the lock top class if present.
    $elements.removeClass(lockTopClass);

    // Synchronize pin, freeze, and unfreeze between the elements. This is
    // needed so that both elements are pinned and frozen at the same time
    // when focus is inside one of them.
    $elements.on(`headroomPin.${eventNamespace}`, (event) => {

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
    .on(`headroomFreeze.${eventNamespace}`, (event) => {

      // The Headroom component will not apply freeze and will not trigger the
      // event if the element is already frozen so no checks are needed here.
      for (let i = 0; i < $elements.length; i++) {
        $elements[i].headroom.freeze();
      }

    })
    .on(`headroomUnfreeze.${eventNamespace}`, (event) => {

      // The Headroom component will not unfreeze and will not trigger the
      // event if the element is already unfrozen so no checks are needed
      // here.
      for (let i = 0; i < $elements.length; i++) {
        $elements[i].headroom.unfreeze();
      }

    });

  };

  /**
   * Detach from the provided context element.
   *
   * @param {HTMLElement} context
   */
  const detach = (context) => {

    /**
     * Elements that have Headroom.js applied, wrapped in a jQuery collection.
     *
     * @type {jQuery}
     */
    const $elements = $(headroomElementsSelector, context);

    $elements.off(`.${eventNamespace}`);

    // Destroy Headroom.js instances if found.
    for (let i = 0; i < $elements.length; i++) {

      if (
        AmbientImpact.objectPathExists('headroom.destroy', $elements[i]) &&
        typeof $elements[i].headroom.destroy === 'function'
      ) {
        $elements[i].headroom.destroy();
      }

    }

  };

  this.addBehaviour(
    'OmnipediaSiteThemeHeaderHeadroom',
    'omnipedia-site-theme-header-headroom',
    headerElements.getHeaderBehaviourSelector(),
    triggers,
    function(context, settings) {

      attach(context);

    },
    function(context, settings, trigger) {

      detach(context);

    },
  );

  /**
   * Sync Headroom element states from the current context to a new context.
   *
   * This copies all the existing classes of header Headroom elements from a
   * preview to their counterparts in the freshly loaded (non-preview) context
   * so that the initial state of the non-preview elements when Headroom is
   * attached is identical to the preview. This is primarily intended to
   * prevent unpinned elements suddenly being pinned if they're unpinned in the
   * preview when the swap occurs, but also applies to all the other states.
   *
   * @param {HTMLElement} currentContext
   *   The current context element, usually the <html> element of the preview
   *   currently displayed.
   *
   * @param {HTMLElement} newContext
   *   The new context element about to be swapped, usually the <body> element.
   */
  const syncHeadroomStates = (currentContext, newContext) => {

    /**
     * Current context's elements that have Headroom.js applied.
     *
     * @type {jQuery}
     */
    const $newElements = $(headroomElementsSelector, newContext);

    /**
     * New contexts elements that will have Headroom.js applied.
     *
     * @type {jQuery}
     */
    const $currentElements = $(headroomElementsSelector, currentContext);

    for (let i = 0; i < $currentElements.length; i++) {

      if (!('headroom' in $currentElements[i])) {
        continue;
      }

      const currentHeadroom = $currentElements[i].headroom;

      // Only sync these but not the top/bottom classes because those can
      // occasionally get stuck and Headroom won't update them after loading.
      for (const key of ['initial', 'pinned', 'unpinned']) {

        if (!currentHeadroom.hasClass(key)) {
          continue;
        }

        // @todo Don't assume both current and new collections have the same
        //  elements at the same index; split selectors array into find them
        //  individually.
        $newElements.eq(i).addClass(currentHeadroom.classes[key]);

      }

      // Add the lock top class if element is at the top at this moment.
      if (currentHeadroom.hasClass('top')) {
        $newElements.eq(i).addClass(lockTopClass);
      }

    }

  };

  // Attach Headroom to preview for a more seamless experience.
  //
  // This also syncs the state of Headroom elements when the fresh copy is
  // swapped in.
  //
  // @see syncHeadroomStates()
  $(once(
    'omnipedia-site-theme-header-headroom-refreshless-preview',
    'html',
  )).on(`refreshless:render.${eventNamespace}`, (event) => {

    // We only care about previews.
    if (event.detail.isPreview === false) {
      return;
    }

    attach(event.target);

  }).on(`refreshless:before-render.${eventNamespace}`, async (event) => {

    // We only care about non-previews that have replaced a preview.
    if (event.detail.previousPreview === false) {
      return;
    }

    await event.detail.delay((resolve, reject) => {

      // Sync preview Headroom states to the fresh copy that will be swapped in.
      syncHeadroomStates(event.target, event.detail.newBody);

      // Detach from the preview after states have been copied.
      detach(event.target);

      resolve();

    });

  });

});
});
});
