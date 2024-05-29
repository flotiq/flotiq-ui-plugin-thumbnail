import {
  addElementToCache,
  getCachedElement,
} from "../../common/plugin-element-cache";

export const handleManagePlugin = ({ plugin }, pluginInfo) => {
  const cacheKey = `${pluginInfo.id}-manage-render`;
  let element = getCachedElement(cacheKey)?.element;

  if (!element) {
    element = document.createElement("div");
    element.textContent = `Plugin with id ${plugin.id} does not have any settings`;
  }

  addElementToCache(element, cacheKey);
  return element;
};
