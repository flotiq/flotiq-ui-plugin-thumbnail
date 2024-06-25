import i18n from '../i18n';

let configCache = null;

export const handleManagePlugin = ({ plugin, contentTypes, modalInstance }, pluginInfo, getLanguage) => {
  if (plugin?.id !== pluginInfo.id) return null;

  if (configCache) return configCache;

  const ctds = (contentTypes || [])
    .filter((ctd) => !ctd.internal || ctd.name === '_media')
    .map(({ name, label }) => ({ value: name, label }));

  const language = getLanguage();
  if (language !== i18n.language) {
    i18n.changeLanguage(language);
  }

  configCache = {};

  configCache.schema = {
    id: pluginInfo.id,
    name: 'thumbnails',
    label: 'Thumbnails',
    workflowId: 'generic',
    internal: false,
    schemaDefinition: {
      type: 'object',
      allOf: [
        {
          $ref: '#/components/schemas/AbstractContentTypeSchemaDefinition',
        },
        {
          type: 'object',
          properties: {
            settings: {
              type: 'array',
              items: {
                type: 'object',
                required: ['content_types'],
                properties: {
                  content_types: {
                    type: 'array',
                  },
                },
              },
              minItems: 1,
            },
          },
        },
      ],
      required: [],
      additionalProperties: false,
    },
    metaDefinition: {
      order: ['settings'],
      propertiesConfig: {
        settings: {
          items: {
            order: ['content_types'],
            propertiesConfig: {
              content_types: {
                label: i18n.t('ContentTypes'),
                unique: false,
                helpText: '',
                inputType: 'select',
                isMultiple: true,
                useOptionsWithLabels: true,
                optionsWithLabels: ctds,
              },
            },
          },
          label: i18n.t('Settings'),
          unique: false,
          helpText: '',
          inputType: 'object',
        },
      },
    },
  };

  modalInstance.promise.then(() => (configCache = null));

  return configCache;
};
