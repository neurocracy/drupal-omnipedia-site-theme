<?php

declare(strict_types=1);

namespace Drupal\omnipedia_site_theme\Hook;

use Drupal\Core\Hook\Attribute\Hook;

/**
 * Block hooks.
 */
class BlockHooks {

  /**
   * Attach libraries to the help block.
   */
  #[Hook('preprocess_block__help_block')]
  public function attachLibrariesToHelpBlock(array &$variables): void {

    $variables['#attached']['library'][] = 'omnipedia_site_theme/help';

  }

  /**
   * Attach libraries to the Omnipedia current date block.
   */
  #[Hook('preprocess_block__omnipedia_current_date')]
  public function attachLibrariesToCurrentDateBlock(array &$variables): void {

    $variables['#attached']['library'][] = 'omnipedia_site_theme/current_date';

  }

  /**
   * Attach libraries to the Omnipedia join block.
   */
  #[Hook('preprocess_block__omnipedia_join')]
  public function attachLibrariesToJoinBlock(array &$variables): void {

    $variables['#attached']['library'][] = 'omnipedia_site_theme/join';

  }

  /**
   * Attach libraries to the Omnipedia page revision history block.
   */
  #[Hook('preprocess_block__omnipedia_page_revision_history')]
  public function attachLibrariesToPageRevisionHistoryBlock(
    array &$variables,
  ): void {

    $variables['#attached'][
      'library'
    ][] = 'omnipedia_site_theme/page_revision_history';

  }

}
