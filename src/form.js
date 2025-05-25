export function renderForm(formFields, mapping) {
  const formContainer = document.getElementById("dynamic-form");
  formContainer.innerHTML = "";

  const form = document.createElement("form");
  form.id = "pdf-form";

  // Submit-Button zuerst erzeugen
  const submitBtn = document.createElement("button");
  submitBtn.type = "button";
  submitBtn.textContent = "Send to backend";
  submitBtn.disabled = true;
  submitBtn.style.marginTop = "1em";

  // Für die Signatur
  let signatureDataUrl = "";

  mapping.forEach(({ index, label }) => {
    const field = formFields[index];
    if (!field) return;

    // Signature special handling
    if (label.toLowerCase().includes("signature")) {
      // Container
      const sigContainer = document.createElement("div");
      sigContainer.className = "signature-container";

      // Canvas
      const canvas = document.createElement("canvas");
      canvas.width = 350;
      canvas.height = 120;
      canvas.className = "signature-canvas";

      // Placeholder
      const placeholder = document.createElement("div");
      placeholder.className = "signature-placeholder";
      placeholder.textContent = "Draw your signature here";

      sigContainer.appendChild(canvas);
      sigContainer.appendChild(placeholder);
      form.appendChild(sigContainer);

      // Canvas drawing logic
      let drawing = false;
      let hasDrawn = false;

      canvas.addEventListener("mousedown", (e) => {
        drawing = true;
        hasDrawn = true;
        placeholder.style.display = "none";
        const ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
      });

      canvas.addEventListener("mousemove", (e) => {
        if (!drawing) return;
        const ctx = canvas.getContext("2d");
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
      });

      canvas.addEventListener("mouseup", () => {
        drawing = false;
        signatureDataUrl = canvas.toDataURL("image/png");
        checkAllFieldsFilled(form, submitBtn, hasDrawn);
      });

      canvas.addEventListener("mouseleave", () => {
        drawing = false;
      });

      // Optional: Clear button
      const clearBtn = document.createElement("button");
      clearBtn.type = "button";
      clearBtn.textContent = "Clear signature";
      clearBtn.style.marginBottom = "1em";
      clearBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        signatureDataUrl = "";
        hasDrawn = false;
        placeholder.style.display = "";
        checkAllFieldsFilled(form, submitBtn, hasDrawn);
      });
      form.appendChild(clearBtn);

      return;
    }

    // Normale Felder
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
      checkAllFieldsFilled(form, submitBtn, signatureDataUrl !== "");
    });

    row.appendChild(labelEl);
    row.appendChild(input);
    form.appendChild(row);
  });

  form.appendChild(submitBtn);
  formContainer.appendChild(form);

  // Initial check
  checkAllFieldsFilled(form, submitBtn, false);

  // Submit handler
  submitBtn.addEventListener("click", async () => {
    // Remove signature field from formFields (if present)
    const filteredFields = mapping
      .map(({ index, label }) =>
        label.toLowerCase().includes("signature") ? null : formFields[index]
      )
      .filter(Boolean);

    // Build payload
    const payload = {
      ...formData,
      form_fields: filteredFields,
    };

    // Prepare form data for multipart (JSON + image)
    const formDataToSend = new FormData();
    formDataToSend.append(
      "json",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );
    if (signatureDataUrl) {
      const res = await fetch(signatureDataUrl);
      const blob = await res.blob();
      formDataToSend.append("signature", blob, "signature.png");
    }

    // Send to backend as POST (adjust the URL to your endpoint)
    fetch("http://192.168.178.22:8000/pdf/submit", {
      method: "POST",
      body: formDataToSend,
    })
      .then((resp) => {
        if (resp.ok) {
          alert("Successfully sent!");
        } else {
          alert("Error sending data!");
        }
      })
      .catch(() => alert("Network error!"));
  });
}

function checkAllFieldsFilled(form, submitBtn, hasSignature) {
  const inputs = form.querySelectorAll("input[type='text']");
  const allFilled = Array.from(inputs).every(
    (input) => input.value.trim() !== ""
  );
  submitBtn.disabled = !(allFilled && hasSignature);
}
