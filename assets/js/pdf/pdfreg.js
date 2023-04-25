class PDFReg {
    generateForm() {
        const form = document.getElementById('form');
        form.innerHTML = '';
        for (const groupKey in this.FIELDS) {
            if (Object.hasOwnProperty.call(this.FIELDS, groupKey)) {
                const fieldGroup = this.FIELDS[groupKey];

                let inputGroup = document.createElement('div');
                inputGroup.classList.add('is-grouped', 'control');
                let inputGroupTitle = document.createElement('h4');
                inputGroupTitle.innerText = fieldGroup.name;
                inputGroup.appendChild(inputGroupTitle);
                
                let qty = typeof(fieldGroup['quantity']) === 'undefined' ? 1 : fieldGroup.quantity;

                for (let index = 0; index < qty; index++) {
                    let elementToAppend = inputGroup;
                    let groupField = document.createElement('div');
                    if (qty > 1) {
                        groupField.classList.add('is-grouped', 'control');

                        let groupFieldTitle = document.createElement('h6');
                        groupFieldTitle.innerText = 'Line ' + (index + 1);
                        groupField.appendChild(groupFieldTitle);

                        elementToAppend = groupField;
                    }
                    for (const fieldKey in fieldGroup.fields) {
                        if (Object.hasOwnProperty.call(fieldGroup.fields, fieldKey)) {
                            const field = fieldGroup.fields[fieldKey];
                            let fieldBlock;
                            if (typeof(field['check']) !== 'undefined') {
                                fieldBlock = this.generateCheckInput(index, groupKey, fieldKey, field.name, field.check);
                            } else {
                                fieldBlock = this.generateTextInput(index, groupKey, fieldKey, field.name);
                            }
                            elementToAppend.appendChild(fieldBlock);
                        }
                    }
                    if (qty > 1) {
                        inputGroup.appendChild(groupField);
                    }
                }

                form.appendChild(inputGroup);
            }
        }
    }

    generateTextInput(number, group, name, placeholder) {
        let container = document.createElement('div');
        container.classList.add('field', 'is-horizontal');

        let labelContainer = document.createElement('div')
        labelContainer.classList.add('field-label', 'is-normal')

        let fieldContainer = document.createElement('div')
        fieldContainer.classList.add('field-body')

        let label = document.createElement('label');
        label.classList.add('label');
        label.setAttribute('for', name+number);
        label.innerText = placeholder;

        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('name', name+number);
        input.setAttribute('id', name+number);
        input.setAttribute('placeholder', placeholder);
        input.classList.add('input');
        input.dataset.group = group;

        labelContainer.appendChild(label);
        fieldContainer.appendChild(input);

        container.appendChild(labelContainer);
        container.appendChild(fieldContainer);

        return container;
    }

    generateCheckInput(number, group, name, prettyName, values) {
        let container = document.createElement('div');
        container.classList.add('field', 'is-horizontal');

        let labelContainer = document.createElement('div')
        labelContainer.classList.add('field-label', 'is-normal')
        
        let labelCheck = document.createElement('label');
        labelCheck.classList.add('label');
        labelCheck.setAttribute('for', name+number);
        labelCheck.innerText = prettyName;

        labelContainer.appendChild(labelCheck);

        let fieldContainer = document.createElement('div')
        fieldContainer.classList.add('field-body')

        let field = document.createElement('div')
        field.classList.add('control')

        for (const valueKey in values) {
            if (Object.hasOwnProperty.call(values, valueKey)) {
                let label = document.createElement('label');
                label.classList.add('radio');
                
                let input = document.createElement('input');
                input.setAttribute('type', 'radio');
                input.setAttribute('name', name+number);
                input.setAttribute('value', valueKey);
                input.dataset.group = group;

                label.appendChild(input)
                label.innerHTML += valueKey;

                field.appendChild(label)
            }
        }

        fieldContainer.appendChild(field);

        container.appendChild(labelContainer);
        container.appendChild(fieldContainer);

        return container;
    }

    async generatePDF() {
        const url = "assets/pdf/"+this.PDF
        const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())
        const bytes = new Uint8Array(existingPdfBytes)
    
        const pdfDoc = await PDFDocument.load(bytes)
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    
        const pages = pdfDoc.getPages()
        const firstPage = pages[0]
        document.querySelectorAll('#form input').forEach(elem => {
            let position = this.getPositionFromField(elem);
            if (position) {
                let [x,y] = position.split(',');
    
                if (elem.type === 'radio') {
                    if (elem.checked) {
                        firstPage.drawText('x', {
                            x: parseInt(x),
                            y: parseInt(y),
                            size: 10,
                            font: helveticaFont,
                        })
                    }
                } else {
                    let value = elem.name.match(/^coll/) && elem.value.length === 1 ? '  ' + elem.value : elem.value;
                    firstPage.drawText(value, {
                        x: parseInt(x),
                        y: parseInt(y),
                        size: 10,
                        font: helveticaFont,
                    })
                }
            }
        });

        const pdfBytes = await pdfDoc.save()

        download(pdfBytes, "pdf-lib_modification_example.pdf", "application/pdf");
    }

    getPositionFromField(element) {
        let group = element.dataset.group;
        let matchGroups = element.name.match(/^(.+)(\d+)$/);
        let position = null;

        if (typeof(this.FIELDS[group]['fields'][matchGroups[1]]) !== 'undefined') {
            if (typeof(this.FIELDS[group]['fields'][matchGroups[1]]['check']) !== "undefined") {
                position = this.FIELDS[group]['fields'][matchGroups[1]]['check'][element.value];
            } else {
                position = this.FIELDS[group]['fields'][matchGroups[1]]['position'];
            }
        }

        if (position) {
            let [x,y] = position.split(',');
            y = parseInt(y) - (this.LINE_HEIGHT * parseInt(matchGroups[2]));
            position = x + ',' + y;
        }

        return position;
    }

    exportJSON() {
        let data = {};
        document.querySelectorAll('#form input').forEach(elem => {
            if (elem.type === 'radio') {
                if (elem.checked) {
                    data[elem.name] = elem.value;
                }
            } else {
                data[elem.name] = elem.value;
            }
        });
        download(JSON.stringify(data), 'pokemon-tcg-pdf-data-' + (new Date()).getTime() + '.json', 'application/json');
    }

    importJSON() {
        let input = document.createElement('input');
        input.type = 'file';
        input.addEventListener('change', e => {
            let file = e.target.files[0]; 
            let reader = new FileReader();
            reader.readAsText(file,'UTF-8');

            reader.addEventListener('load', readerEvent => {
                let content = readerEvent.target.result;
                let json = JSON.parse(content);
                for (const jsonKey in json) {
                    if (Object.hasOwnProperty.call(json, jsonKey)) {
                        const element = json[jsonKey];
                        let elementBlock = document.querySelector('input[name="'+jsonKey+'"]');
                        if (elementBlock.type === 'radio') {
                            document.querySelector('input[name="'+jsonKey+'"][value="'+element+'"]').checked = true;
                        } else {
                            document.getElementById(jsonKey).value = element;
                        }
                    }
                }
            });
        });
        input.click();
    }
}