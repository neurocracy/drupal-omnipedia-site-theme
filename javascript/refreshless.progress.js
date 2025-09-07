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

    await fastdom.mutate(() => {

      $(event.target).removeClass(progressBarActiveClass);

    });

  });

});
});
});
