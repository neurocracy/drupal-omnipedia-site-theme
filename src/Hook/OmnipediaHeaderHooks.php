<?php

declare(strict_types=1);

namespace Drupal\omnipedia_site_theme\Hook;

use Drupal\Core\Hook\Attribute\Hook;

/**
 * Omnipedia header hooks.
 */
class OmnipediaHeaderHooks {

  /**
   * Prepares variables for the omnipedia-header.html.twig template.
   *
   * This adds a 'button-placeholder' class to the 'menu_link' element.
   *
   * This attaches the 'omnipedia_site_theme/header' library to this template.
   *
   * @see \Drupal\omnipedia_block\Plugin\Block\Header
   *   Used by this block.
   */
  #[Hook('preprocess_omnipedia_header')]
  public function preprocessHeader(array &$variables): void {

    $variables['menu_link']['#attributes']['class'][] = 'button-placeholder';

    $variables['#attached']['library'][] = 'omnipedia_site_theme/header';

  }

}
