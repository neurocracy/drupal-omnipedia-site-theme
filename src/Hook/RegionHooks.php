<?php

declare(strict_types=1);

namespace Drupal\omnipedia_site_theme\Hook;

use Drupal\Core\Hook\Attribute\Hook;

/**
 * Page region hooks.
 */
class RegionHooks {

  /**
   * Attach libraries to sidebar regions.
   */
  #[Hook('preprocess_region__sidebar_first')]
  #[Hook('preprocess_region__sidebar_second')]
  public function attachLibrariesToSidebars(array &$variables): void {

    $variables['#attached']['library'][] = 'omnipedia_site_theme/sidebars';

  }

}
