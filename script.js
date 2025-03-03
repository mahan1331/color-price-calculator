// لود کردن داده‌ها از فایل‌های JSON
let pastes = [];
let bases = [];
let formulas = [];

Promise.all([
    fetch('pastes.json').then(response => response.json()),
    fetch('bases.json').then(response => response.json()),
    fetch('formulas.json').then(response => response.json())
]).then(([pastesData, basesData, formulasData]) => {
    pastes = pastesData.pastes;
    bases = basesData.bases;
    formulas = formulasData.formulas;

    // تابع محاسبه و نمایش فاکتور
    function calculateAndShowInvoice() {
        const colorCode = document.getElementById("colorCode").value.trim().toUpperCase();
        const resultDiv = document.getElementById("result");
        const priceDetails = document.getElementById("priceDetails");
        const invoiceDiv = document.getElementById("invoice");
        const basePriceElement = document.getElementById("basePrice");
        const pastePriceElement = document.getElementById("pastePrice");
        const laborPriceElement = document.getElementById("laborPrice");
        const totalPriceElement = document.getElementById("totalPrice");

        // پیدا کردن فرمول بر اساس کد رنگ
        const formula = formulas.find(f => f.colourCode === colorCode);
        if (!formula) {
            resultDiv.style.display = "none";
            invoiceDiv.style.display = "none";
            alert("کد رنگ معتبر نیست! (مثلاً BS 00 A 01 وارد کن)");
            return;
        }

        // پیدا کردن کد پایه و قیمتش
        const base = bases.find(b => b.code === formula.baseCode);
        let basePrice = base ? base.unitPrice : 0;

        // محاسبه قیمت خمیرها (بر اساس مقدار و قیمت هر لیتر)
        let totalPastePrice = 0;
        formula.pastes.forEach(paste => {
            const pasteData = pastes.find(p => p.code === paste.code);
            if (pasteData) {
                totalPastePrice += paste.amount * pasteData.pricePerLiter;
            }
        });

        // فرض می‌کنیم دستمزد ثابت باشه (مثلاً 1000 تومان، می‌تونی تغییر بدی)
        const laborPrice = 1000;

        // محاسبه قیمت نهایی (مثلاً با 20% سود)
        const totalPrice = (basePrice + totalPastePrice + laborPrice) * 1.2; // با 20% سود

        // نمایش جزئیات محاسبه
        priceDetails.textContent = `کد رنگ: ${colorCode}\nقیمت پایه: ${basePrice} تومان\nقیمت خمیر: ${totalPastePrice.toFixed(2)} تومان\nدستمزد: ${laborPrice} تومان\nقیمت کل (با 20% سود): ${totalPrice.toFixed(2)} تومان`;
        resultDiv.style.display = "block";

        // پر کردن جدول فاکتور
        basePriceElement.textContent = `${basePrice} تومان`;
        pastePriceElement.textContent = `${totalPastePrice.toFixed(2)} تومان`;
        laborPriceElement.textContent = `${laborPrice} تومان`;
        totalPriceElement.textContent = `${totalPrice.toFixed(2)} تومان`;
        invoiceDiv.style.display = "block";
    }

    // تابع چاپ فاکتور
    function printInvoice() {
        window.print();
    }

    // تابع بازگشت (ریست کردن فرم)
    function resetForm() {
        document.getElementById("colorCode").value = "";
        document.getElementById("result").style.display = "none";
        document.getElementById("invoice").style.display = "none";
    }
}).catch(error => console.error('Error loading data:', error));