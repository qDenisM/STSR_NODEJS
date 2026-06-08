document.addEventListener('DOMContentLoaded', () => {
  const editInputs = document.querySelectorAll('.edit-input');
  const deleteBtn = document.getElementById('delete-btn');

  if (!deleteBtn || editInputs.length === 0) {
    return;
  }

  const initialValues = Array.from(editInputs).map((input) => input.value);

  editInputs.forEach((input) => {
    input.addEventListener('input', () => {
      const changed = Array.from(editInputs).some(
        (field, index) => field.value !== initialValues[index],
      );
      deleteBtn.disabled = changed;
    });
  });
});
