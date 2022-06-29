import { strtoDate, datetoHtmlDate, htmlDateToDate, datetoRestDate } from '../utils';

function dateCellEditor() {}

dateCellEditor.prototype.init = function(params) {
  this.eGui = document.createElement(`div`);
  this.eGui.classList.add('h-100');
  this.eGui.innerHTML = `<input class='h-100' type="date" value=${
    params.value ? datetoHtmlDate(strtoDate(params.value)) : ''
  }> `;
  this.eInput = this.eGui.querySelector('input');
  // this.eInput.addEventListener('input', this.inputChanged.bind(this));
};

// dateCellEditor.prototype.inputChanged = function(event) {
//   let val = event.target.value;
//   if (isEmpty(val)) {
//     this.eGui.classList.add('red-bg');
//   } else {
//     this.eGui.classList.remove('red-bg');
//   }
// };

function isEmpty(val) {
  return val === undefined || val === null || val === '';
}

dateCellEditor.prototype.isCancelAfterEnd = function() {
  let value = this.getValue();
  if (isEmpty(value)) {
    return true;
  }
  return false;
};

dateCellEditor.prototype.afterGuiAttached = function() {
  this.eInput.focus();
};

dateCellEditor.prototype.getValue = function() {
  return datetoRestDate(htmlDateToDate(this.eInput.value));
};

dateCellEditor.prototype.getGui = function() {
  return this.eGui;
};

// dateCellEditor.prototype.destroy = function() {
//   this.eInput.removeEventListener('input', this.inputChanged);
// };

export { dateCellEditor };
