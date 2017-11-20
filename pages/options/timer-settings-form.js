/* global document:true */
import Settings from '../../src/Settings.js';
import Storage from '../../src/Storage.js';

(() => {
  const getFormElements = () => ({
    numFacuetsToOpenInput: document.getElementById('num-facuets-to-open'),
    openIntervalInMinutesInput: document.getElementById('open-interval-in-minutes'),
  });

  const updateForm = async () => {
    Storage.get(async (storage) => {
      const {
        numFacuetsToOpen,
        openIntervalInMinutes,
      } = await Settings.fromStoreage(storage);

      const {
        numFacuetsToOpenInput,
        openIntervalInMinutesInput,
      } = getFormElements();

      numFacuetsToOpenInput.value = numFacuetsToOpen;
      openIntervalInMinutesInput.value = openIntervalInMinutes;
    });
  };

  Storage.addonChangedListener(updateForm);
  document.addEventListener('DOMContentLoaded', updateForm);

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('timer-settings-form').addEventListener('submit', (event) => {
      event.preventDefault();

      const {
        numFacuetsToOpenInput,
        openIntervalInMinutesInput,
      } = getFormElements();

      Storage.set({
        numFacuetsToOpen: Number(numFacuetsToOpenInput.value),
        openIntervalInMinutes: Number(openIntervalInMinutesInput.value),
      }, () => {
        document.getElementById('form-saved-alert').style.display = 'block';
      });
    });
  });
})();
