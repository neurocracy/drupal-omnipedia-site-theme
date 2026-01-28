// -----------------------------------------------------------------------------
//   Pitch component
// -----------------------------------------------------------------------------

AmbientImpact.on(['fastdom'], function(aiFastDom) { 'use strict';
AmbientImpact.addComponent('OmnipediaPitch', (component, $) => {

  /**
   * FastDom instance.
   *
   * @type {FastDom}
   */
  const fastdom = aiFastDom.getInstance();

  // This makes heading permalinks visually hidden unless focused. These can't
  // be set to display: none; because they're used as the targets for the table
  // of contents and thus would not allow scrolling to them if they were fully
  // removed.
  component.addBehaviour(
    'OmnipediaPitchHeadingPermalinks',
    'omnipedia-pitch-heading-permalinks',
    '.layout-content:has(.omnipedia-pitch)',
    async function(context, settings) {

      await fastdom.mutate(() => {

        $('.heading-permalink').addClass(['focusable', 'visually-hidden']);

      });

    },
    async function(context, settings, trigger) {

      if (trigger === 'refreshless:before-cache') {

        return;

      }

      await fastdom.mutate(() => {

        $('.heading-permalink').removeClass(['focusable', 'visually-hidden']);

      });

    },
  );

});
});
