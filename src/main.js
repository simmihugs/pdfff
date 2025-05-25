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
