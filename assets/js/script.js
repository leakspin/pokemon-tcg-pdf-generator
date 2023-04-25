const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib

const PDF_REG = {
    'svi': new SVIPDF()
};

let REG_CLASS;

document.addEventListener("DOMContentLoaded", function(event) { 
    document.getElementById('pdf-origin').addEventListener('change', e => {
        generateForm(e.target);
    });

    generateForm(document.getElementById('pdf-origin'));

    document.getElementById('top').addEventListener('click', e => {
        document.documentElement.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    document.addEventListener('scroll', e => {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            document.getElementById('top').style.display = "block";
        } else {
            document.getElementById('top').style.display = "none";
        }
    });
});

generateForm = function(elem) {
    if (elem.value in PDF_REG) {
        REG_CLASS = PDF_REG[elem.value];
        REG_CLASS.generateForm();

        document.getElementById('download').removeEventListener('click', generatePDF);
        document.getElementById('export').removeEventListener('click', exportJSON);
        document.getElementById('import').removeEventListener('click', importJSON);

        document.getElementById('download').addEventListener('click', generatePDF);

        document.getElementById('export').addEventListener('click', exportJSON);

        document.getElementById('import').addEventListener('click', importJSON);
    }
}

generatePDF = function() {
    REG_CLASS.generatePDF();
}

exportJSON = function() {
    REG_CLASS.exportJSON();
}

importJSON = function() {
    REG_CLASS.importJSON();
}