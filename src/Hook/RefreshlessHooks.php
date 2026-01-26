<?php

declare(strict_types=1);

namespace Drupal\omnipedia_site_theme\Hook;

use Drupal\Core\Hook\Attribute\Hook;

/**
 * RefreshLess hooks.
 */
class RefreshlessHooks {

  /**
   * Opt into RefreshLess lazy link preloading.
   */
  #[Hook('preprocess_menu__footer')]
  #[Hook('preprocess_menu__main')]
  #[Hook('preprocess_node')]
  public function optIntoLazyPreloading(array &$variables): void {

    $variables['attributes']['data-refreshless-lazy-preload'] = true;

  }

}
