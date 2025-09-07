// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - RefreshLess progress
// -----------------------------------------------------------------------------

AmbientImpact.onGlobals(['once'], function() {
AmbientImpact.on(['fastdom'], (aiFastDom) => {
AmbientImpact.addComponent(
  'OmnipediaSiteThemeRefreshLessProgress',
(component, $) => {

  'use strict';

  /**
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = component.getName();

  /**
   * FastDom instance.
   *
   * @type {FastDom}
   */
  const fastdom = aiFastDom.getInstance();

  /**
   * The selector to find the header element by.
   *
   * @type {String}
   */
  const headerSelector = 'header[role="banner"]';

  /**
   * Class applied to the <html> element when the progress bar is active.
   *
   * @type {String}
   *
   * @todo Port this to the RefreshLess module and remove from here.
   */
  const progressBarActiveClass = 'refreshless-progress-bar-active';

  $(once(
    'omnipedia-site-theme-refreshless-progress-active', 'html',
  )).on(`refreshless:progress-bar-active.${eventNamespace}`, async (event) => {

    await fastdom.mutate(() => {

      $(event.target).addClass(progressBarActiveClass);

    });

  }).on(`refreshless:progress-bar-inactive.${eventNamespace}`, async (event) => {

    const headroom = $(event.target).find(headerSelector).prop('headroom');

    // Pin right before removing the class so that the header remains in view
    // unless the user scrolls after this. This feels better than using just the
    // class because if the progress bar is only visible for a very short time,
    // this causes the header to pop into view and then out of view quickly.
    headroom.pin();

    await fastdom.mutate(() => {

      $(event.target).removeClass(progressBarActiveClass);

    });

  });

});
});
});
