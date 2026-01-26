<?php

declare(strict_types=1);

namespace Drupal\omnipedia_site_theme\Hook;

use Drupal\Core\Hook\Attribute\Hook;

/**
 * Page title hooks.
 */
class PageTitleHooks {

  /**
   * Attach libraries to the page title.
   */
  #[Hook('preprocess_page_title')]
  public function attachLibraries(array &$variables): void {

    $variables['#attached']['library'][] = 'omnipedia_site_theme/page_title';

  }

}
