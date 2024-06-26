import { getRelationData } from '../../common/api-helpers';
import {
  addElementToCache,
  getCachedElement,
} from '../../common/plugin-element-cache';
import i18n from '../i18n';

export function handleGridPlugin(
  { accessor, contentObject, inputType, data },
  client,
  pluginInfo,
  global,
) {
  if (!['datasource'].includes(inputType)) return;
  const settings = JSON.parse(global.getPluginSettings() || '{}');
  if (!settings.content_types?.includes(contentObject.internal?.contentType)) {
    return;
  }
  if (data.length > 1) {
    return;
  }
  const language = global.getLanguage();
  if (language !== i18n.language) {
    i18n.changeLanguage(language);
  }

  const cacheKey = `${pluginInfo.id}-${contentObject.id}-${accessor}`;

  let element = getCachedElement(cacheKey)?.element;
  if (!element) {
    element = document.createElement('img');
    const imageRelation = data[0];
    if (!imageRelation?.dataUrl?.includes('_media')) {
      return;
    }
    const objectDataPromise = getRelationData(
      client,
      imageRelation.dataUrl,
      accessor,
    );

    objectDataPromise.then((objectData) => {
      if (objectData?.internal?.contentType !== '_media') {
        return;
      }

      element.setAttribute('src', client.getMediaUrl(objectData, 40, 80));

      element.style.borderRadius = '5px';
      element.style.cursor = 'pointer';
      element.addEventListener(
        'click',
        function () {
          const contentElement = document.createElement('div');
          contentElement.className = 'thumbnails-plugin-image-container';
          const image = document.createElement('img');
          image.setAttribute('src', client.getMediaUrl(objectData, 0, 0));
          image.className = 'thumbnails-plugin-image';
          contentElement.appendChild(image);
          const imageName = document.createElement('p');
          imageName.className = 'thumbnails-plugin-image-name';
          imageName.textContent = objectData.fileName;
          contentElement.appendChild(imageName);
          const arrow = document.createElement('div');
          arrow.className = 'thumbnails-plugin-open-arrow';
          arrow.addEventListener(
            'click',
            function () {
              window.open(client.getMediaUrl(objectData, 0, 0));
            },
            false,
          );
          contentElement.appendChild(arrow);

          global.openModal({
            title: '',
            size: 'lg',
            content: contentElement,
            hideClose: false,
            buttons: [
              {
                key: 'close',
                label: i18n.t('Close'),
              },
            ],
          });
        },
        false,
      );
    });
  }

  addElementToCache(element, cacheKey);

  return element;
}
