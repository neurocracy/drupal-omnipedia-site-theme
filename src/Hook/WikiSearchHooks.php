<?php

declare(strict_types=1);

namespace Drupal\omnipedia_site_theme\Hook;

use Drupal\Core\DependencyInjection\AutowireTrait;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
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

}
