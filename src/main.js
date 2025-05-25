import { mapping } from "./mapping.js";
import { fetchData } from "./dataFetcher.js";
import { renderForm } from "./form.js";
import "./style.css";
import beer from "/beer.svg";

document.querySelector("#app").innerHTML = `
<div>
  <h1>Pdf form filler</h1>  
  <a href="https://vite.dev" target="_blank">
    <img src="${beer}" class="logo" alt="Vite logo" />
  </a>
  <div id="dynamic-form"></div>
</div>
`;

let formData = await fetchData("http://192.168.178.22:8000/pdf/");

renderForm(formData.form_fields, mapping, formData);

/*
function renderForm(formFields, mapping) {
  const formContainer = document.getElementById("dynamic-form");
  formContainer.innerHTML = ""; // clear previous

  const form = document.createElement("form");
  form.id = "pdf-form";

  // Submit-Button zuerst erzeugen, damit er im Event-Handler existiert
  const submitBtn = document.createElement("button");
  submitBtn.type = "button";
  submitBtn.textContent = "Download filled JSON";
  submitBtn.disabled = true;
  submitBtn.style.marginTop = "1em";
  submitBtn.addEventListener("click", () => {
    downloadJSON(formData);
  });

  mapping.forEach(({ index, label }) => {
    const field = formFields[index];
    if (!field) {
      console.warn(`No form field at index ${index}!`);
      return; // skip
    }

    // Create a row container
    const row = document.createElement("div");
    row.className = "form-row";

    const labelEl = document.createElement("label");
    labelEl.textContent = label;
    labelEl.htmlFor = `field-${index}`;

    const input = document.createElement("input");
    input.type = "text";
    input.id = `field-${index}`;
    input.name = label;
    input.value = field.field_value || "";

    input.addEventListener("input", (e) => {
      field.field_value = e.target.value;
      checkAllFieldsFilled(form, submitBtn);
    });

    row.appendChild(labelEl);
    row.appendChild(input);
    form.appendChild(row);
  });

  form.appendChild(submitBtn);
  formContainer.appendChild(form);

  checkAllFieldsFilled(form, submitBtn);
}

function checkAllFieldsFilled(form, submitBtn) {
  const inputs = form.querySelectorAll("input[type='text']");
  const allFilled = Array.from(inputs).every(
    (input) => input.value.trim() !== ""
  );
  submitBtn.disabled = !allFilled;
}

function downloadJSON(data) {
  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "filled_form.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

renderForm(formData.form_fields, mapping);
*/
