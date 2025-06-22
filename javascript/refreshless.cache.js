// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - RefreshLess cache fixes
// -----------------------------------------------------------------------------

AmbientImpact.onGlobals(['once'], function() {
AmbientImpact.addComponent(
  'OmnipediaSiteThemeRefreshLessCache',
(component, $) => {

  'use strict';

  /**
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = component.getName();

  /**
   * Selectors to not be saved to RefreshLess cache.
   *
   * These elements are not saved to cache because they're intended to be
   * singletons and inserted via JavaScript, which means each time a snapshot
   * is restored, these start to multiply.
   *
   * @type {Array}
   *
   * @todo Maybe RefreshLess should run a detach before caching after all?
   */
  const selectors = [
    '#overlay-scroll-scrollbar-measure',
    '.content-popup-offcanvas',
    '.content-popup-offcanvas-button',
    '.eu-cookie-compliance-popup',
    '.offcanvas-overlay',
    '.overlay--eu-cookie-compliance-popup',
    '.overlay--layout-sidebars',
    '.pswp',
    '.to-top',
  ];

  $(once(
    'omnipedia-refreshless-cache', 'html',
  )).on(`refreshless:before-cache.${eventNamespace}`, (event) => {

    // Note that we're not using FastDom as this is inside of an event
    // subscriber which we can't delay at the time of writing.
    $(selectors.join(','), event.target).attr(
      'data-refreshless-temporary', true,
    );

  });

});
});
