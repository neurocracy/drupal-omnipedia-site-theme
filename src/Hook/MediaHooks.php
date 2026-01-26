<?php

declare(strict_types=1);

namespace Drupal\omnipedia_site_theme\Hook;

use Drupal\Core\DependencyInjection\AutowireTrait;
use Drupal\Core\DependencyInjection\ClassResolverInterface;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Hook\Attribute\Hook;
use Drupal\Core\Render\Element;
use Drupal\omnipedia_site_theme\Hook\MediaSubtitleTracks;

/**
 * Media hooks.
 */
class MediaHooks implements ContainerInjectionInterface {

  use AutowireTrait;

  /**
   * Constructor; saves dependencies.
   *
   * @param \Drupal\Core\DependencyInjection\ClassResolverInterface $classResolver
   *   The class resolver service.
   */
  public function __construct(
    protected readonly ClassResolverInterface $classResolver,
  ) {}

  /**
   * Prepares variables for media entities.
   *
   * Drupal core currently only supports one implementation of an OOP
   * preprocess hook per extension (module, theme, profile) and will throw a
   * fatal error if we try to provide more than one. This method currently
   * exists to work around that.
   *
   * @see https://www.drupal.org/project/drupal/issues/3558998
   *   Drupal core issue regarding this problem and why it's not intuitive.
   *
   * @todo Remove this and uncomment the attributes on the called methods
   *   if/when that's fixed.
   */
  #[Hook('preprocess_media')]
  public function preprocessMedia(array &$variables): void {

    $this->classResolver->getInstanceFromDefinition(
      MediaSubtitleTracks::class,
    )->preprocessMedia($variables);

  }

  /**
   * Revert forced 'image_caption_formatter' on embedded image media.
   *
   * ambientimpact_media forces the use of image_caption_formatter regardless
   * of what's set in the field display. That whole module needs to be
   * reworked, with many things like that removed or improved. In the
   * meanwhile, script card image media fields are expected to not display a
   * caption so undo the ambientimpact_media formatter change.
   *
   * @see \Drupal\ambientimpact_media\Plugin\Field\FieldFormatter\ImageFormatter::viewElements()
   *
   * @todo Remove when ambientimpact_media is reworked, broken up, etc.
   */
  #[Hook('preprocess_media__image')]
  public function revertImageMediaImageCaptionFormatter(
    array &$variables,
  ): void {

    if (
      !isset($variables['elements']['#embed']) ||
      $variables['elements']['#embed'] !== true
    ) {
      return;
    }

    $imageField = &$variables['content']['field_media_image'];

    foreach (Element::children($imageField) as $key) {
      if ($imageField[$key]['#theme'] === 'image_caption_formatter') {
        $imageField[$key]['#theme'] = 'image_formatter';
      }
    }

  }

}
