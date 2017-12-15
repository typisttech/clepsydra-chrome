/* global document:true */
import Settings from '../../src/Settings.js';

(() => {
  const getFormElements = () => ({
    numFacuetsToOpenInput: document.getElementById('num-facuets-to-open'),
    openIntervalInMinutesInput: document.getElementById('open-interval-in-minutes'),
  });

  const updateForm = async () => {
    const {
      numFacuetsToOpen,
      openIntervalInMinutes,
    } = await Settings.get();

    const {
      numFacuetsToOpenInput,
      openIntervalInMinutesInput,
    } = getFormElements();

    numFacuetsToOpenInput.value = numFacuetsToOpen;
    openIntervalInMinutesInput.value = openIntervalInMinutes;
  };

  Settings.addOnChangedListener(updateForm);
  document.addEventListener('DOMContentLoaded', updateForm);

  document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('timer-settings-form').addEventListener('submit', async (event) => {
      event.preventDefault();

      const {
        numFacuetsToOpenInput,
        openIntervalInMinutesInput,
      } = getFormElements();

      await Settings.set({
        numFacuetsToOpen: Number(numFacuetsToOpenInput.value),
        openIntervalInMinutes: Number(openIntervalInMinutesInput.value),
      });

      document.getElementById('form-saved-alert').style.display = 'block';
    });
  });
})();
