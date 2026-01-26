<?php

declare(strict_types=1);

namespace Drupal\omnipedia_site_theme\Hook;

use Drupal\Core\Hook\Attribute\Hook;

/**
 * Element hooks.
 */
class ElementHooks {

  /**
   * Attach libraries to more links.
   */
  #[Hook('element_info_alter')]
  public function attachLibrariesToRadios(array &$info): void {

    $info['radios']['#attached'][
      'library'
    ][] = 'omnipedia_site_theme/form_radios';

  }

}
