<?php

declare(strict_types=1);

namespace Drupal\omnipedia_site_theme\Hook;

use Drupal\Core\DependencyInjection\AutowireTrait;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Hook\Attribute\Hook;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Wiki search hooks.
 */
class WikiSearchHooks implements ContainerInjectionInterface {

  use AutowireTrait;

  /**
   * Constructor; saves dependencies.
   *
   * @param \Symfony\Component\DependencyInjection\ContainerInterface $container
   *   The service container.
   */
  public function __construct(
    protected readonly ContainerInterface $container,
  ) {}

  /**
   * Prepares variables for the page template.
   *
   * This adds the 'omnipedia_is_search_page' boolean variable if the wiki
   * search service exists.
   *
   * @see \Drupal\omnipedia_search\Service\WikiSearchInterface::isCurrentRouteSearchPage()
   */
  // #[Hook('preprocess_page')]
  public function preprocessPage(array &$variables): void {

    if ($this->container->has('omnipedia.wiki_search') === true) {

      /** @var bool */
      $variables['omnipedia_is_search_page'] = $this->container->get(
        'omnipedia.wiki_search',
      )->isCurrentRouteSearchPage();

    }

  }

  /**
   * Prepares variables for views exposed form templates.
   *
   * Default template: views-exposed-form.html.twig.
   *
   * This attaches the 'omnipedia_site_theme/search_form' library to to the
   * wiki search page view exposed form.
   */
  #[Hook('preprocess_views_exposed_form')]
  public function preprocessViewsExposedForm(array &$variables): void {

    if ($variables['form']['#id'] !== 'views-exposed-form-wiki-search-page') {

      return;

    }

    $variables['form']['#attached'][
      'library'
    ][] = 'omnipedia_site_theme/search_form';

  }

  /**
   * Implements hook_form_FORM_ID_alter.
   *
   * This alters the submit button for the wiki search view exposed form:
   *
   * - Sets '#use_button_element' to true so that the ambientimpact_base theme
   *   replaces the <input> with a <button> element as the latter can contain
   *   markup.
   *
   * - Wraps the button content in an icon, with visually hidden text. This is
   *   dependent on the previous point.
   *
   * - Sets the 'plain-button' class on the button.
   *
   * @see ambientimpact_base/templates/form/input--button-element.html.twig
   *   Template suggestion that outputs a <button> element rather than an
   *   <input>. Also documents rationale and links.
   */
  #[Hook('form_views_exposed_form_alter')]
  public function alterViewsExposedForm(
    array &$form, FormStateInterface $formState, string $formId,
  ): void {

    if ($form['#id'] !== 'views-exposed-form-wiki-search-page') {

      return;

    }

    $submit = &$form['actions']['submit'];

    $submit['#use_button_element'] = true;

    $submit['content'] = [
      '#type'         => 'ambientimpact_icon',
      '#bundle'       => 'libricons',
      '#icon'         => 'loupe',
      '#text'         => $submit['#value'],
      '#textDisplay'  => 'visuallyHidden',
    ];

    $submit['#attributes']['class'][] = 'plain-button';

    // Set the HTML required attribute on the field. Note that using '#required'
    // here causes Views/Drupal to output an empty error message for some
    // strange reason when generating the form, so we're setting the attribute
    // directly. We're primarily doing this for UX reasons: so that browsers
    // refuse to submit the form if terms are empty and thus avoiding a page
    // load, and not for data validation, which must be server-side. If the
    // browser is really old and doesn't support the required attribute, users
    // just get the empty search results page.
    if (isset($form['terms']['#type'])) {

      $form['terms']['#attributes']['required'] = 'required';

    }
  }

}
