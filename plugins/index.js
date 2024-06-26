import { registerFn } from '../common/plugin-element-cache';
import pluginInfo from '../plugin-manifest.json';
import cssString from 'inline:./styles/style.css';
import { handleGridPlugin } from './grid-renderers';
import { handleManagePlugin } from './manage-modal';

registerFn(pluginInfo, (handler, client, globals) => {
  /**
   * Add plugin styles to the head of the document
   */
  if (!document.getElementById(`${pluginInfo.id}-styles`)) {
    const style = document.createElement('style');
    style.id = `${pluginInfo.id}-styles`;
    style.textContent = cssString;
    document.head.appendChild(style);
  }
  const { getLanguage } = globals;

  handler.on('flotiq.grid.cell::render', (data) =>
    handleGridPlugin(data, client, pluginInfo, globals),
  );
  handler.on('flotiq.plugins.manage::form-schema', (data) =>
    handleManagePlugin(data, pluginInfo, getLanguage),
  );
});
