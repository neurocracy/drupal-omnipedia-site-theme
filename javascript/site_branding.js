// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Site branding component
// -----------------------------------------------------------------------------

// This adds a class to the header element when it's been unpinned at least once
// by Headroom, so that we can apply styles and animations after the page has
// loaded and has been interacted with. One example is the shimmer animation
// for the logo in compact mode: adding this class allows that to play the
// shimmer when the header becomes pinned after being unpinned, without playing
// the reveal animation as it does by default.

AmbientImpact.on([
  'OmnipediaSiteThemeHeaderHeadroom',
], function(
  headerHeadroom,
) {
AmbientImpact.addComponent('OmnipediaSiteThemeSiteBranding', function(
  siteBranding, $,
) {

  'use strict';

  /**
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = this.getName();

  /**
   * The selector to find the header element by.
   *
   * @type {String}
   */
  const headerSelector = 'header[role="banner"]';

  /**
   * Class applied to the header when immerse has been entered at least once.
   *
   * @type {String}
   */
  const immersedOnceClass = 'header-immersed-once';

  /**
   * Class applied to the header element when it's been unpinned at least once.
   *
   * @type {String}
   */
  const unpinnedOnceClass = 'headroom--unpinned-once';

  /**
   * Class added to the header when not transitioning in or out of view.
   *
   * @type {String}
   */
  const settledClass = 'headroom--settled';

  this.addBehaviour(
    'OmnipediaSiteThemeSiteBrandingHeadroom',
    'omnipedia-site-theme-site-branding-headroom',
    headerSelector,
    function(context, settings) {

      $(this).on(`headroomUnpin.${eventNamespace}`, (event) => {

        $(this).addClass(unpinnedOnceClass);

      }).on([
        `headroomPin.${eventNamespace}`,
        `headroomUnpin.${eventNamespace}`,
      ].join(' '), (event) => {

        $(event.target).removeClass(settledClass);

      }).on(`transitionend.${eventNamespace}`, (event) => {

        if (event.originalEvent.propertyName !== 'transform') {
          return;
        }

        $(event.target).addClass(settledClass);

      });

    },
    function(context, settings, trigger) {

      // Note that we don't want to remove the classes so that they're preserved
      // when restoring from RefreshLess' cache.
      $(this).off(`.${eventNamespace}`);

    }
  );

  this.addBehaviour(
    'OmnipediaSiteThemeSiteBrandingImmersedOnce',
    'omnipedia-site-theme-site-branding-immersed-once',
    'body',
    function(context, settings) {

      $(this).on(`immerseEnter.${eventNamespace}`, function(event) {
        $(this).find(headerSelector).addClass(immersedOnceClass);
      });

    },
    function(context, settings, trigger) {

      // Note that we don't want to remove the class so that it's preserved when
      // restoring from RefreshLess' cache.
      $(this).off(`immerseEnter.${eventNamespace}`);

    }
  );

});
});
