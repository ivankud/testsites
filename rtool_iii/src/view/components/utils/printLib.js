import config from '../config';

export function openPreviewWindow(html, pageTitle, pageSize, print) {
  try {
    let preview = window.open('about:blank', '', 'menubar=no, toolbar=no, left=0, top=0, width=900, height=0');
    let document = preview.document;
    document.open();
    document.write(html);
    document.close();
    document.title = (pageTitle || 'Предварительный просмотр') + ' - ' + config.siteTitle;
    if (pageSize) {
      const style = document.createElement('style');
      style.type = 'text/css';
      style.media = 'print';
      style.appendChild(document.createTextNode(`@page { size: ${pageSize || 'landscape'}; }`));
      document.head.appendChild(style);
    }
    if (print) preview.print();
  } catch (error) {
    console.error('Unable to print report', error);
    throw new Error(
      'Окно предварительного просмотра заблокировано браузером. Отключите блокировку всплывающих окон в настроках браузера и попробуйте снова.'
    );
  }
}
