import { emmet } from "emmet-elem";

function locationSearch() {
  const outer = emmet(`div#locationSearch`);

  const form = emmet("form[novalidation]");
  const input = emmet(`input[type="search" minlength="3"]`);
  const btn = emmet(`button.submit[type="button"]`);
  form.append(input, btn);

  input.addEventListener("change", (e) => {
    if (inputElem.validity.valueMissing) {
      return `Input cannot be empty`;
    } else if (inputElem.validity.tooShort) {
      return `Input should be at least ${inputElem.minLength} characters. You entered ${inputElem.value.length} characters.`;
    }
  });

  outer.append(form);
  return outer;
}

export { locationSearch };
