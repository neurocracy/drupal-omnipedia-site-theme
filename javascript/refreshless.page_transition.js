// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - RefreshLess page transition
// -----------------------------------------------------------------------------

AmbientImpact.on(['fastdom'], function(aiFastDom) {
AmbientImpact.addComponent(
  'OmnipediaSiteThemeRefreshLessPageTransition',
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
   * Base class for the overlay.
   *
   * @type {String}
   */
  const overlayClass = 'refreshless-page-transition-overlay';

  /**
   * Class added to the overlay when it's visible.
   *
   * @type {String}
   */
  const overlayActiveClass = `${overlayClass}--active`;

  /**
   * Name of the property on the <html> element we save the instance to.
   *
   * @type {String}
   */
  const overlayPropertyName = 'OmnipediaRefreshlessPageTransition';

  /**
   * Class applied to the <html> element when RefreshLess handling transitions.
   *
   * This is intended to disable the CSS reveal animation that otherwise plays
   * both on a full page load and would also play when the <body> contents are
   * replaced.
   *
   * @type {String}
   */
  const pageTransitionHandledClass = 'refreshless--page-transition-handled';

  /**
   * The maximum amount of time in milliseconds the transition may take.
   *
   * This is the failsafe timeout to ensure rendering continues if this time
   * has passed without the transition finishing. Defensive programming and all
   * that.
   *
   * @type {Number}
   */
  const failsafeTimeout = 500;

  /**
   * Name of the root element attribute that we write the current state to.
   *
   * This is primarily intended for styling and is only one way; changing it
   * doesn't affect the behaviour of the overlay itself.
   *
   * @type {String}
   */
  const transitionStateAttrName = 'data-refreshless-page-transition-state';

  /**
   * Represents a RefreshLess page transition sequence.
   */
  class TransitionSequence {

    /**
     * The sequence order for transition states.
     *
     * @type {Set}
     */
    #sequence = new Set([
      'revealed',
      'hiding',
      'hidden',
      'revealing',
    ]);

    /**
     * The current state.
     *
     * @type {String}
     */
    #current;

    /**
     * The current iterable from this.#sequence.
     *
     * @type {Iterator}
     */
    #iterable;

    constructor() {

      this.restart();

    }

    /**
     * Advance the sequence to the next state, restarting if necessary.
     *
     * @return {this}
     *   The current instance for chaining.
     */
    advance() {

      const value = this.#iterable.next().value;

      if (typeof value !== 'undefined') {

        this.#current = value;

        return this;

      }

      this.#restart();

      this.#current = this.#iterable.next().value;

      return this;

    }

    /**
     * Restart the sequence.
     *
     * This is separate from the public this.restart() method to avoid infinite
     * recursion when we call it in this.advance().
     *
     * @return {this}
     *   The current instance for chaining.
     */
    #restart() {

      // Note that built-in iterators don't allow for restarting once consumed,
      // so we have to create a new one.
      this.#iterable = this.#sequence[Symbol.iterator]();

      return this;

    }

    /**
     * Restart the sequence.
     *
     * This is a wrapper around and this.#restart() and this.advance().
     *
     * @return {this}
     *   The current instance for chaining.
     */
    restart() {
      return this.#restart().advance();
    }

    /**
     * Get the current sequence state.
     *
     * @return {String}
     *
     * @see this.#sequence
     *   Lists available state values.
     */
    get current() {
      return this.#current;
    }

    /**
     * Assert that the current state matches an expected state.
     *
     * @param {String} current
     *   The expected state to assert against.
     *
     * @return {this}
     *   The current instance for chaining.
     *
     * @see this.#sequence
     *   Lists available state values.
     */
    assertCurrent(current) {

      if (this.#current === current) {
        return this;
      }

      console.error(
        'RefreshLess page transition: Expected state "%s" but found "%s"!',
        current, this.#current,
      );

      return this;

    }

    /**
     * Determine if the current state is in the process of revealing.
     *
     * This means that the page is currently transitioning into view but has not
     * finished transitioning in.
     *
     * @return {Boolean}
     */
    isRevealing() {
      return this.#current === 'revealing';
    }

    /**
     * Determione if the current state is fully revealed.
     *
     * This means that the page is visible and that it's not in the process of
     * transitioning in nor out.
     *
     * @return {Boolean}
     */
    isRevealed() {
      return this.#current === 'revealed';
    }

    /**
     * Determine if the current state is revealing or revealed.
     *
     * @return {Boolean}
     */
    isRevealingOrRevealed() {
      return (this.isRevealing() || this.isRevealed());
    }

    /**
     * Determine if the current state is in the process of hiding.
     *
     * This means that the page is currently transitioning out of to view but
     * has not finished transitioning out.
     *
     * @return {Boolean}
     */
    isHiding() {
      return this.#current === 'hiding';
    }

    /**
     * Determione if the current state is fully hidden.
     *
     * This means that the page is not visible visible and that it's not in
     * the process of transitioning in nor out.
     *
     * @return {Boolean}
     */
    isHidden() {
      return this.#current === 'hidden';
    }

    /**
     * Determine if the current state is hiding or hidden.
     *
     * @return {Boolean}
     */
    isHidingOrHidden() {
      return (this.isHiding() || this.isHidden());
    }

  }

  /**
   * Represents the RefreshLess page transition overlay.
   */
  class TransitionOverlay {

    /**
     * The overlay element wrapped in a jQuery collection.
     *
     * @type {jQuery}
     */
    #$overlay;

    /**
     * The root (<html>) element wrapped in a jQuery collection.
     *
     * @type {jQuery}
     */
    #$root;

    /**
     * RefreshLess transition sequence instance.
     *
     * @type {TransitionSequence}
     */
    #sequence;

    /**
     * A resolve function from 'refreshless:before-render' event.detail.delay().
     *
     * This is set to undefined when the transition out is finished or the
     * failsafe is triggered.
     *
     * @type {undefined|Function}
     */
    #resolveTransitionOut;

    constructor($root) {

      this.#$root = $root;

      this.#$overlay = $(`<div class="${overlayClass}"></div>`);

      this.#bindEventHandlers();

      this.#sequence = new TransitionSequence();

      this.#updateRootAttribute();

    }

    /**
     * Destroy this instance.
     *
     * @return {Promise}
     *   A Promise that resolves when various DOM tasks are complete.
     */
    destroy() {

      this.#unbindEventHandlers();

      return fastdom.mutate(() => {

        this.#$overlay.remove();

        this.#$root
        .removeClass(pageTransitionHandledClass)
        .removeAttr(transitionStateAttrName);

      });

    }

    /**
     * Bind all of our event handlers.
     *
     * @see this~#unbindEventHandlers()
     */
    #bindEventHandlers() {

      this.#$root.on({
        [`refreshless:before-render.${eventNamespace}`]: async (event) => {
          await this.#beforeRenderHandler(event);
        },
        [`refreshless:render.${eventNamespace}`]: async (event) => {
          await this.#renderHandler(event);
        },
        [`refreshless:load.${eventNamespace}`]: async (event) => {
          await this.#loadHandler(event);
        },
      });

      this.#$overlay.on(`transitionend.${eventNamespace}`, (event) => {
        this.#transitionEndHandler(event);
      });

    }

    /**
     * Unbind all of our event handlers.
     *
     * @see this~#bindEventHandlers()
     */
    #unbindEventHandlers() {

      this.#$root.add(this.#$overlay).off(`.${eventNamespace}`);

    }

    /**
     * Update the root attribute with the current state.
     *
     * @return {Promise}
     *   A Promise that resolves when the DOM changes are complete.
     */
    async #updateRootAttribute() {

      await fastdom.mutate(() => {

        this.#$root.attr(transitionStateAttrName, this.#sequence.current);

      });

    }

    /**
     * 'refreshless:before-render' event handler.
     *
     * @param {jQuery.Event} event
     */
    async #beforeRenderHandler(event) {

      // If this is a fresh page that replaced a cached preview, do nothing
      // because the page will have already been transitioned in when the
      // preview was rendered.
      if (
        event.detail.isPreview === false &&
        event.detail.previousPreview === true
      ) {
        return;
      }

      await event.detail.delay(async (resolve, reject) => {

        this.#resolveTransitionOut = resolve;

        // This acts as a failsafe to resolve the delay if too much time has
        // passed if our transitionend event handler does not resolve in a
        // reasonable amount of time (or at all), the next page still renders,
        // even if a bit less smoothly.
        setTimeout(async () => {

          if (this.#sequence.isRevealingOrRevealed() === true) {
            return;
          }

          // Resolve here explicitly using the function instead of relying on
          // this.#endTransitionOut() in case the reference to resolve() got
          // out of sync or there's some other error.
          resolve();

          console.warn('RefreshLess page transition: Failsafe triggered!');

          await this.#endTransitionOut();

          await this.#startTransitionIn();

        }, failsafeTimeout);

        // Insert the overlay and indicate it's active only at this point, so
        // that we don't do it too early and risk it removing the full page load
        // fade in.
        await fastdom.mutate(() => {

          this.#$overlay.insertBefore(this.#$root.find('body'));

          this.#$root.addClass(pageTransitionHandledClass);

        });

        await this.#startTransitionOut();

      });

    }

    /**
     * 'refreshless:render' event handler.
     *
     * @param {jQuery.Event} event
     */
    async #renderHandler(event) {

      if (event.detail.isPreview === false) {
        return;
      }

      await this.#loadHandler();

    }

    /**
     * 'refreshless:load' event handler.
     *
     * @param {jQuery.Event} event
     */
    async #loadHandler(event) {

      if (this.#sequence.isRevealingOrRevealed() === true) {
        return;
      }

      await this.#startTransitionIn();

    }

    /**
     * Overlay 'transitionend' event handler.
     *
     * @param {jQuery.Event} event
     */
    async #transitionEndHandler(event) {

      if (event.originalEvent.propertyName !== 'opacity') {
        return;
      }

      const opacity = await fastdom.measure(() => {
        return this.$overlay.css('opacity');
      });

      if (opacity === '1') {
        await this.#endTransitionOut();
      } else {
        await this.#endTransitionIn();
      }

    }

    /**
     * Start revealing.
     */
    async #startTransitionIn() {

      if (this.#sequence.isRevealingOrRevealed() === true) {
        this.#endTransitionIn();
      }

      console.debug('🌐 Start transition in');

      // Let any rendering/layout/etc. settle for a frame before proceeding.
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);

      await fastdom.mutate(() => {

        this.#$overlay.removeClass(overlayActiveClass);

      });

      this.#sequence.advance().assertCurrent('revealing');

      await this.#updateRootAttribute();

    }

    /**
     * Finish revealing in if currently in the process of revealing.
     */
    async #endTransitionIn() {

      if (this.#sequence.isRevealing() !== true) {
        return;
      }

      console.debug('🌐 Page visible!');

      this.#sequence.advance().assertCurrent('revealed');

      await this.#updateRootAttribute();

    }

    /**
     * Start hiding if not already hiding or hidden.
     */
    async #startTransitionOut() {

      if (this.#sequence.isHidingOrHidden() === true) {
        return;
      }

      console.debug('🌐 Start transition out');

      // Let any rendering/layout/etc. settle for a frame before proceeding.
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);

      await fastdom.mutate(() => {
        this.#$overlay.addClass(overlayActiveClass);
      });

      this.#sequence.restart().advance().assertCurrent('hiding');

      await this.#updateRootAttribute();

    }

    /**
     * Finishing hiding.
     */
    async #endTransitionOut() {

      if (this.#sequence.isHiding() !== true) {
        return;
      }

      console.debug('🌐 Page hidden!');

      this.#sequence.advance().assertCurrent('hidden');

      await this.#updateRootAttribute();

      if (typeof this.#resolveTransitionOut !== 'function') {
        return;
      }

      this.#resolveTransitionOut();

      this.#resolveTransitionOut = undefined;

    }

    /**
     * Get the overlay element jQuery collection.
     *
     * @return {jQuery}
     */
    get $overlay() {
      return this.#$overlay;
    }

  }

  // Note that this must be wrapped in this closure to ensure it only gets
  // instantiated if once() actually returns an element, otherwise this could
  // get instantiated more than once even if once() doesn't return an element.
  // This can occur due to RefreshLess' additive aggregation still requiring
  // more work because it can sometimes still include a library more than once
  // in different aggregates.
  $(once('omnipedia-refreshless-page-transition', 'html')).each((i, html) => {
    $(html).prop(overlayPropertyName, new TransitionOverlay($(html)));
  });

});
});
