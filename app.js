// =====================================================
// MARKETING TOOL CARGOMII
// =====================================================
// Sistem:
// - Tidak menggunakan database
// - Menggunakan localStorage
// - SMS = follow up wajib
// - WhatsApp = opsional
// - Call = opsional
// =====================================================


const DATA_KEY = "marketingToolData";
const NAME_KEY = "marketingToolName";
const PHONE_KEY = "marketingToolPhone";
const TARGET_KEY = "marketingToolTarget";


let data =
    JSON.parse(
        localStorage.getItem(DATA_KEY)
    ) || [];


// =====================================================
// ELEMENT
// =====================================================

const dataForm =
    document.getElementById("dataForm");

const marketingName =
    document.getElementById("marketingName");

const marketingPhone =
    document.getElementById("marketingPhone");

const marketingTarget =
    document.getElementById("marketingTarget");

const saveProfileBtn =
    document.getElementById("saveProfileBtn");

const statTarget =
    document.getElementById("statTarget");

const statData =
    document.getElementById("statData");

const statFollowUp =
    document.getElementById("statFollowUp");

const statInterested =
    document.getElementById("statInterested");

const progressText =
    document.getElementById("progressText");

const progressBar =
    document.getElementById("progressBar");

const dataTable =
    document.getElementById("dataTable");

const searchInput =
    document.getElementById("searchInput");

const exportBtn =
    document.getElementById("exportBtn");

const companySelect =
    document.getElementById("companySelect");

const templateSelect =
    document.getElementById("templateSelect");

const customerPhone =
    document.getElementById("customerPhone");

const message =
    document.getElementById("message");

const copyPhoneBtn =
    document.getElementById("copyPhoneBtn");

const copyBtn =
    document.getElementById("copyBtn");

const phoneLinkBtn =
    document.getElementById("phoneLinkBtn");

const whatsappBtn =
    document.getElementById("whatsappBtn");

const callBtn =
    document.getElementById("callBtn");

const phoneLinkStatus =
    document.getElementById("phoneLinkStatus");

const smsStatus =
    document.getElementById("smsStatus");

const waStatus =
    document.getElementById("waStatus");

const callStatus =
    document.getElementById("callStatus");

const toast =
    document.getElementById("toast");


// =====================================================
// SAVE DATA
// =====================================================

function saveData() {

    localStorage.setItem(
        DATA_KEY,
        JSON.stringify(data)
    );

}


// =====================================================
// TOAST
// =====================================================

function showToast(text) {

    if (!toast) return;


    toast.textContent =
        text;


    toast.classList.remove(
        "hidden"
    );


    setTimeout(
        () => {

            toast.classList.add(
                "hidden"
            );

        },
        2500
    );

}


// =====================================================
// NAVIGATION
// =====================================================

document
    .querySelectorAll(".nav-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const tab =
                    button.dataset.tab;


                document
                    .querySelectorAll(".tab-content")
                    .forEach(section => {

                        section.classList.add(
                            "hidden"
                        );

                    });


                const target =
                    document.getElementById(
                        tab
                    );


                if (target) {

                    target.classList.remove(
                        "hidden"
                    );

                }


                document
                    .querySelectorAll(".nav-btn")
                    .forEach(nav => {

                        nav.classList.remove(
                            "bg-brand-700"
                        );

                    });


                button.classList.add(
                    "bg-brand-700"
                );

            }
        );

    });


// =====================================================
// LOAD PROFILE
// =====================================================

function loadProfile() {

    if (marketingName) {

        marketingName.value =
            localStorage.getItem(
                NAME_KEY
            ) || "";

    }


    if (marketingPhone) {

        marketingPhone.value =
            localStorage.getItem(
                PHONE_KEY
            ) || "";

    }


    if (marketingTarget) {

        marketingTarget.value =
            localStorage.getItem(
                TARGET_KEY
            ) || "";

    }

}


// =====================================================
// SAVE PROFILE
// =====================================================

if (saveProfileBtn) {

    saveProfileBtn.addEventListener(
        "click",
        () => {

            localStorage.setItem(
                NAME_KEY,
                marketingName.value.trim()
            );


            localStorage.setItem(
                PHONE_KEY,
                marketingPhone.value.trim()
            );


            localStorage.setItem(
                TARGET_KEY,
                marketingTarget.value
            );


            updateDashboard();


            showToast(
                "Profil berhasil disimpan."
            );

        }
    );

}


// =====================================================
// DASHBOARD
// =====================================================

function updateDashboard() {

    const target =
        Number(
            localStorage.getItem(
                TARGET_KEY
            )
        ) || 0;


    const totalData =
        data.length;


    // SMS menjadi indikator utama
    // karena SMS adalah follow up wajib.

    const totalFollowUp =
        data.filter(
            item =>
                item.smsSent === true
        ).length;


    const totalInterested =
        data.filter(
            item =>
                item.status === "Tertarik"
        ).length;


    statTarget.textContent =
        target;


    statData.textContent =
        totalData;


    statFollowUp.textContent =
        totalFollowUp;


    statInterested.textContent =
        totalInterested;


    progressText.textContent =
        `${totalData} / ${target}`;


    let progress =
        0;


    if (target > 0) {

        progress =
            (totalData / target) * 100;

    }


    if (progress > 100) {

        progress = 100;

    }


    progressBar.style.width =
        `${progress}%`;

}


// =====================================================
// TAMBAH DATA
// =====================================================

if (dataForm) {

    dataForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const newData = {

                id:
                    Date.now(),

                company:
                    document.getElementById(
                        "company"
                    ).value.trim(),

                phone:
                    document.getElementById(
                        "phone"
                    ).value.trim(),

                region:
                    document.getElementById(
                        "region"
                    ).value.trim(),

                pic:
                    document.getElementById(
                        "pic"
                    ).value.trim(),

                address:
                    document.getElementById(
                        "address"
                    ).value.trim(),

                notes:
                    document.getElementById(
                        "notes"
                    ).value.trim(),

                status:
                    "Belum Follow Up",

                followup:
                    "",

                followupType:
                    "",

                smsSent:
                    false,

                waSent:
                    false,

                callDone:
                    false,

                smsDate:
                    "",

                waDate:
                    "",

                callDate:
                    "",

                created:
                    new Date()
                        .toLocaleDateString(
                            "id-ID"
                        )

            };


            data.push(
                newData
            );


            saveData();

            renderTable();

            updateDashboard();

            renderFollowUpCustomers();


            dataForm.reset();


            showToast(
                "Data berhasil ditambahkan."
            );

        }
    );

}


// =====================================================
// MIGRATE DATA LAMA
// =====================================================

function migrateOldData() {

    let changed =
        false;


    data.forEach(item => {


        // SMS

        if (
            typeof item.smsSent !==
            "boolean"
        ) {

            item.smsSent =
                item.followupType === "SMS";

            changed =
                true;

        }


        // WA

        if (
            typeof item.waSent !==
            "boolean"
        ) {

            item.waSent =
                item.followupType === "WA" ||
                item.followupType === "WHATSAPP";

            changed =
                true;

        }


        // CALL

        if (
            typeof item.callDone !==
            "boolean"
        ) {

            item.callDone =
                item.followupType === "CALL" ||
                item.followupType === "CALLING" ||
                item.followupType === "TELEPON";

            changed =
                true;

        }


        // DATE SMS

        if (!item.smsDate) {

            item.smsDate =
                item.smsSent
                    ? item.followup || ""
                    : "";

            changed =
                true;

        }


        // DATE WA

        if (!item.waDate) {

            item.waDate =
                item.waSent
                    ? item.followup || ""
                    : "";

            changed =
                true;

        }


        // DATE CALL

        if (!item.callDate) {

            item.callDate =
                item.callDone
                    ? item.followup || ""
                    : "";

            changed =
                true;

        }

    });


    if (changed) {

        saveData();

    }

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// =====================================================
// FOLLOW UP BADGES
// =====================================================

function followUpBadges(item) {

    const sms =
        item.smsSent
            ? `<span class="inline-flex px-2 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-bold">✓ SMS</span>`
            : `<span class="inline-flex px-2 py-1 rounded-lg bg-gray-100 text-gray-500 text-xs font-semibold">SMS</span>`;


    const wa =
        item.waSent
            ? `<span class="inline-flex px-2 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-bold">✓ WA</span>`
            : `<span class="inline-flex px-2 py-1 rounded-lg bg-gray-100 text-gray-500 text-xs font-semibold">WA</span>`;


    const call =
        item.callDone
            ? `<span class="inline-flex px-2 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-bold">✓ CALL</span>`
            : `<span class="inline-flex px-2 py-1 rounded-lg bg-gray-100 text-gray-500 text-xs font-semibold">CALL</span>`;


    return `
        <div class="flex flex-wrap gap-1">
            ${sms}
            ${wa}
            ${call}
        </div>
    `;

}


// =====================================================
// RENDER TABLE
// =====================================================

function renderTable(
    keyword = ""
) {

    if (!dataTable) return;


    dataTable.innerHTML =
        "";


    const search =
        String(
            keyword || ""
        ).toLowerCase();


    const filteredData =
        data.filter(item => {

            return (

                String(
                    item.company || ""
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    item.phone || ""
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    item.region || ""
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    item.pic || ""
                )
                    .toLowerCase()
                    .includes(search)

            );

        });


    if (
        filteredData.length === 0
    ) {

        dataTable.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="p-5 text-center text-gray-500">

                    Belum ada data.

                </td>

            </tr>

        `;

        return;

    }


    filteredData.forEach(
        (
            item,
            index
        ) => {

            const row =
                document.createElement(
                    "tr"
                );


            row.className =
                "border-b hover:bg-gray-50";


            row.innerHTML = `

                <td class="p-3">
                    ${index + 1}
                </td>


                <td class="p-3 font-semibold">
                    ${escapeHTML(
                        item.company
                    )}
                </td>


                <td class="p-3">
                    ${escapeHTML(
                        item.phone
                    )}
                </td>


                <td class="p-3">
                    ${escapeHTML(
                        item.region
                    )}
                </td>


                <td class="p-3">
                    ${escapeHTML(
                        item.pic || "-"
                    )}
                </td>


                <td class="p-3">
                    ${followUpBadges(item)}
                </td>


                <td class="p-3">

                    <select
                        onchange="changeStatus(${item.id}, this.value)"
                        class="border border-gray-300 rounded-lg px-2 py-1 text-sm">

                        <option
                            value="Belum Follow Up"
                            ${
                                item.status ===
                                "Belum Follow Up"
                                    ? "selected"
                                    : ""
                            }>
                            Belum Follow Up
                        </option>


                        <option
                            value="Sudah Follow Up"
                            ${
                                item.status ===
                                "Sudah Follow Up"
                                    ? "selected"
                                    : ""
                            }>
                            Sudah Follow Up
                        </option>


                        <option
                            value="Respon"
                            ${
                                item.status ===
                                "Respon"
                                    ? "selected"
                                    : ""
                            }>
                            Respon
                        </option>


                        <option
                            value="Tertarik"
                            ${
                                item.status ===
                                "Tertarik"
                                    ? "selected"
                                    : ""
                            }>
                            Tertarik
                        </option>


                        <option
                            value="Tidak Tertarik"
                            ${
                                item.status ===
                                "Tidak Tertarik"
                                    ? "selected"
                                    : ""
                            }>
                            Tidak Tertarik
                        </option>


                        <option
                            value="Tidak Bisa Dihubungi"
                            ${
                                item.status ===
                                "Tidak Bisa Dihubungi"
                                    ? "selected"
                                    : ""
                            }>
                            Tidak Bisa Dihubungi
                        </option>

                    </select>

                </td>


                <td class="p-3">

                    <button
                        onclick="deleteData(${item.id})"
                        class="text-red-600 hover:text-red-800 font-bold">

                        Hapus

                    </button>

                </td>

            `;


            dataTable.appendChild(
                row
            );

        }
    );

}


// =====================================================
// CHANGE STATUS
// =====================================================

function changeStatus(
    id,
    status
) {

    const item =
        data.find(
            item =>
                item.id === id
        );


    if (!item) return;


    item.status =
        status;


    saveData();


    renderTable(
        searchInput
            ? searchInput.value
            : ""
    );


    updateDashboard();


    showToast(
        "Status berhasil diperbarui."
    );

}


window.changeStatus =
    changeStatus;


// =====================================================
// DELETE DATA
// =====================================================

function deleteData(
    id
) {

    if (
        !confirm(
            "Yakin ingin menghapus data ini?"
        )
    ) {

        return;

    }


    data =
        data.filter(
            item =>
                item.id !== id
        );


    saveData();


    renderTable(
        searchInput
            ? searchInput.value
            : ""
    );


    updateDashboard();

    renderFollowUpCustomers();


    showToast(
        "Data berhasil dihapus."
    );

}


window.deleteData =
    deleteData;


// =====================================================
// SEARCH
// =====================================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            renderTable(
                searchInput.value
            );

        }
    );

}


// =====================================================
// FOLLOW UP CUSTOMER LIST
// =====================================================

function renderFollowUpCustomers() {

    if (!companySelect) return;


    const currentValue =
        companySelect.value;


    companySelect.innerHTML = `

        <option value="">
            -- Pilih Customer --
        </option>

    `;


    data.forEach(item => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            item.id;


        option.textContent =
            item.company ||
            "Tanpa Nama";


        companySelect.appendChild(
            option
        );

    });


    if (
        data.some(
            item =>
                String(item.id) ===
                String(currentValue)
        )
    ) {

        companySelect.value =
            currentValue;

    }

}


// =====================================================
// GET SELECTED CUSTOMER
// =====================================================

function getSelectedCustomer() {

    if (!companySelect) {

        return null;

    }


    const id =
        Number(
            companySelect.value
        );


    if (!id) {

        return null;

    }


    return data.find(
        item =>
            item.id === id
    ) || null;

}


// =====================================================
// UPDATE FOLLOW UP STATUS
// =====================================================

function updateFollowUpStatus() {

    const customer =
        getSelectedCustomer();


    if (!customer) {

        smsStatus.textContent =
            "— SMS";


        waStatus.textContent =
            "— WhatsApp";


        callStatus.textContent =
            "— Call";


        setStatusStyle(
            smsStatus,
            false
        );


        setStatusStyle(
            waStatus,
            false
        );


        setStatusStyle(
            callStatus,
            false
        );


        return;

    }


    smsStatus.textContent =
        customer.smsSent
            ? "✓ SMS"
            : "— SMS";


    waStatus.textContent =
        customer.waSent
            ? "✓ WhatsApp"
            : "— WhatsApp";


    callStatus.textContent =
        customer.callDone
            ? "✓ Call"
            : "— Call";


    setStatusStyle(
        smsStatus,
        customer.smsSent
    );


    setStatusStyle(
        waStatus,
        customer.waSent
    );


    setStatusStyle(
        callStatus,
        customer.callDone
    );

}


// =====================================================
// STATUS STYLE
// =====================================================

function setStatusStyle(
    element,
    active
) {

    if (!element) return;


    element.classList.remove(
        "bg-gray-100",
        "text-gray-500",
        "bg-green-100",
        "text-green-700"
    );


    if (active) {

        element.classList.add(
            "bg-green-100",
            "text-green-700"
        );

    }
    else {

        element.classList.add(
            "bg-gray-100",
            "text-gray-500"
        );

    }

}


// =====================================================
// SELECT CUSTOMER
// =====================================================

if (companySelect) {

    companySelect.addEventListener(
        "change",
        () => {

            const customer =
                getSelectedCustomer();


            if (!customer) {

                customerPhone.value =
                    "";

                message.value =
                    "";

                updateFollowUpStatus();

                return;

            }


            customerPhone.value =
                customer.phone || "";


            updateFollowUpMessage();

            updateFollowUpStatus();

        }
    );

}


// =====================================================
// TEMPLATE CHANGE
// =====================================================

if (templateSelect) {

    templateSelect.addEventListener(
        "change",
        () => {

            updateFollowUpMessage();

        }
    );

}


// =====================================================
// MESSAGE TEMPLATE
// =====================================================

function updateFollowUpMessage() {

    const customer =
        getSelectedCustomer();


    if (!customer) {

        return;

    }


    const template =
        templateSelect.value;


    const name =
        customer.pic ||
        customer.company ||
        "Bapak/Ibu";


    let text =
        "";


    if (
        template === "first"
    ) {

        text =
`Halo Bapak/Ibu ${name},

Perkenalkan, saya dari Cargomii.

Kami ingin menawarkan solusi cargo & logistik untuk kebutuhan pengiriman perusahaan Bapak/Ibu.

Cargomii melayani pengiriman ke berbagai wilayah Indonesia dengan layanan yang aman, cepat, dan terpercaya.

Apabila ada kebutuhan pengiriman, kami siap membantu memberikan estimasi tarif.

Terima kasih.`;

    }


    else if (
        template === "second"
    ) {

        text =
`Halo Bapak/Ibu ${name},

Saya follow up kembali terkait layanan cargo Cargomii.

Saat ini kami memiliki promo pengiriman mulai dari 1 KG untuk beberapa tujuan seperti Jakarta–Sorong, Jakarta–Manokwari, dan Jakarta–Jayapura.

Jika ada kebutuhan pengiriman barang, saya siap membantu cek estimasi pengirimannya.

Terima kasih.`;

    }


    else if (
        template === "offer"
    ) {

        text =
`Halo Bapak/Ibu ${name},

Perkenalkan, saya dari Cargomii.

Kami siap membantu kebutuhan cargo dan logistik perusahaan Bapak/Ibu untuk pengiriman ke berbagai wilayah Indonesia.

Jika saat ini ada kebutuhan pengiriman barang, saya dapat membantu memberikan estimasi tarif dan pilihan layanan yang sesuai.

Silakan informasikan kebutuhan pengirimannya kepada saya.

Terima kasih.`;

    }


    else if (
        template === "reminder"
    ) {

        text =
`Halo Bapak/Ibu ${name},

Izin follow up kembali terkait informasi layanan cargo dari Cargomii.

Apakah saat ini ada kebutuhan pengiriman barang yang dapat kami bantu?

Jika ada, saya siap membantu memberikan estimasi tarif dan informasi pengiriman.

Terima kasih.`;

    }


    message.value =
        text;

}


// =====================================================
// CURRENT DATE
// =====================================================

function getCurrentDate() {

    return new Date()
        .toLocaleDateString(
            "id-ID"
        );

}


// =====================================================
// NORMALIZE PHONE
// =====================================================

function normalizePhone(
    phone
) {

    let clean =
        String(
            phone || ""
        ).replace(
            /[^\d+]/g,
            ""
        );


    if (
        clean.startsWith("+62")
    ) {

        return clean;

    }


    if (
        clean.startsWith("62")
    ) {

        return "+" + clean;

    }


    if (
        clean.startsWith("0")
    ) {

        return (
            "+62" +
            clean.substring(1)
        );

    }


    return clean;

}


// =====================================================
// COPY PHONE
// =====================================================

if (copyPhoneBtn) {

    copyPhoneBtn.addEventListener(
        "click",
        async () => {

            const phone =
                customerPhone.value.trim();


            if (!phone) {

                showToast(
                    "Pilih customer terlebih dahulu."
                );

                return;

            }


            try {

                await navigator.clipboard.writeText(
                    phone
                );


                showToast(
                    "Nomor berhasil disalin."
                );

            }
            catch (error) {

                showToast(
                    "Gagal menyalin nomor."
                );

            }

        }
    );

}


// =====================================================
// COPY MESSAGE
// =====================================================

if (copyBtn) {

    copyBtn.addEventListener(
        "click",
        async () => {

            const text =
                message.value.trim();


            if (!text) {

                showToast(
                    "Pesan belum tersedia."
                );

                return;

            }


            try {

                await navigator.clipboard.writeText(
                    text
                );


                showToast(
                    "Pesan berhasil disalin."
                );

            }
            catch (error) {

                showToast(
                    "Gagal menyalin pesan."
                );

            }

        }
    );

}


// =====================================================
// SMS
// =====================================================

if (phoneLinkBtn) {

    phoneLinkBtn.addEventListener(
        "click",
        () => {

            const customer =
                getSelectedCustomer();


            if (!customer) {

                showToast(
                    "Pilih customer terlebih dahulu."
                );

                return;

            }


            const phone =
                customerPhone.value.trim();


            const text =
                message.value.trim();


            if (!phone) {

                showToast(
                    "Nomor customer belum tersedia."
                );

                return;

            }


            if (!text) {

                showToast(
                    "Pesan belum tersedia."
                );

                return;

            }


            const cleanPhone =
                normalizePhone(
                    phone
                );


            const smsURL =
                `sms:${cleanPhone}?body=${encodeURIComponent(text)}`;


            // =========================================
            // OTOMATIS CATAT SMS TERKIRIM
            // =========================================

            customer.smsSent =
                true;


            customer.smsDate =
                getCurrentDate();


            customer.followup =
                customer.smsDate;


            customer.followupType =
                "SMS";


            customer.status =
                "Sudah Follow Up";


            saveData();


            updateFollowUpStatus();

            renderTable(
                searchInput.value
            );

            updateDashboard();


            phoneLinkStatus.textContent =
                "SMS siap dikirim melalui Phone Link / aplikasi SMS.";


            phoneLinkStatus.classList.remove(
                "hidden"
            );


            showToast(
                "Membuka SMS..."
            );


            window.location.href =
                smsURL;

        }
    );

}


// =====================================================
// WHATSAPP
// =====================================================

if (whatsappBtn) {

    whatsappBtn.addEventListener(
        "click",
        () => {

            const customer =
                getSelectedCustomer();


            if (!customer) {

                showToast(
                    "Pilih customer terlebih dahulu."
                );

                return;

            }


            // SMS harus dilakukan terlebih dahulu.

            if (
                customer.smsSent !== true
            ) {

                showToast(
                    "Kirim SMS terlebih dahulu."
                );

                return;

            }


            const phone =
                customerPhone.value.trim();


            const text =
                message.value.trim();


            if (!phone || !text) {

                showToast(
                    "Nomor atau pesan belum tersedia."
                );

                return;

            }


            const cleanPhone =
                normalizePhone(
                    phone
                ).replace(
                    "+",
                    ""
                );


            const whatsappURL =
                `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;


            // Catat WA

            customer.waSent =
                true;


            customer.waDate =
                getCurrentDate();


            saveData();


            updateFollowUpStatus();

            renderTable(
                searchInput.value
            );


            window.open(
                whatsappURL,
                "_blank"
            );


            showToast(
                "WhatsApp dibuka."
            );

        }
    );

}


// =====================================================
// CALL
// =====================================================

if (callBtn) {

    callBtn.addEventListener(
        "click",
        () => {

            const customer =
                getSelectedCustomer();


            if (!customer) {

                showToast(
                    "Pilih customer terlebih dahulu."
                );

                return;

            }


            // SMS harus dilakukan terlebih dahulu.

            if (
                customer.smsSent !== true
            ) {

                showToast(
                    "Kirim SMS terlebih dahulu."
                );

                return;

            }


            const phone =
                customerPhone.value.trim();


            if (!phone) {

                showToast(
                    "Nomor customer belum tersedia."
                );

                return;

            }


            const cleanPhone =
                normalizePhone(
                    phone
                );


            // Catat Call

            customer.callDone =
                true;


            customer.callDate =
                getCurrentDate();


            saveData();


            updateFollowUpStatus();

            renderTable(
                searchInput.value
            );


            showToast(
                "Membuka telepon..."
            );


            window.location.href =
                `tel:${cleanPhone}`;

        }
    );

}


// =====================================================
// EXCELJS
// =====================================================

function loadExcelJS() {

    return new Promise(
        (resolve, reject) => {

            if (
                window.ExcelJS
            ) {

                resolve(
                    window.ExcelJS
                );

                return;

            }


            const script =
                document.createElement(
                    "script"
                );


            script.src =
                "https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js";


            script.onload =
                () => {

                    if (
                        window.ExcelJS
                    ) {

                        resolve(
                            window.ExcelJS
                        );

                    }
                    else {

                        reject(
                            new Error(
                                "ExcelJS gagal dimuat."
                            )
                        );

                    }

                };


            script.onerror =
                () => {

                    reject(
                        new Error(
                            "Gagal memuat ExcelJS."
                        )
                    );

                };


            document.head.appendChild(
                script
            );

        }
    );

}


// =====================================================
// SAFE FILE NAME
// =====================================================

function safeExcelFileName(
    name
) {

    return String(
        name ||
        "Marketing"
    )
        .replace(
            /[\\/:*?"<>|]/g,
            "-"
        )
        .trim()
        ||
        "Marketing";

}


// =====================================================
// PARSE DATE
// =====================================================

function parseIndonesianDate(
    dateString
) {

    if (!dateString) {

        return new Date();

    }


    const parts =
        String(
            dateString
        )
            .split("/");


    if (
        parts.length === 3
    ) {

        const day =
            Number(
                parts[0]
            );


        const month =
            Number(
                parts[1]
            ) - 1;


        const year =
            Number(
                parts[2]
            );


        return new Date(
            year,
            month,
            day
        );

    }


    const parsed =
        new Date(
            dateString
        );


    return isNaN(
        parsed.getTime()
    )
        ? new Date()
        : parsed;

}


// =====================================================
// EXPORT EXCEL
// =====================================================

if (exportBtn) {

    exportBtn.addEventListener(
        "click",
        async () => {

            if (
                data.length === 0
            ) {

                showToast(
                    "Belum ada data untuk diexport."
                );

                return;

            }


            try {

                showToast(
                    "Menyiapkan Excel..."
                );


                const ExcelJS =
                    await loadExcelJS();


                const workbook =
                    new ExcelJS.Workbook();


                const worksheet =
                    workbook.addWorksheet(
                        "Sheet1"
                    );


                const marketing =
                    localStorage.getItem(
                        NAME_KEY
                    ) ||
                    "Marketing";


                // =================================================
                // TITLE
                // =================================================

                worksheet.mergeCells(
                    "A2:H2"
                );


                worksheet.getCell(
                    "A2"
                ).value =
                    `GOOGLE BUSINESS ${marketing.toUpperCase()}`;


                worksheet.getCell(
                    "A2"
                ).font = {

                    bold:
                        true,

                    size:
                        14

                };


                worksheet.getCell(
                    "A2"
                ).alignment = {

                    horizontal:
                        "center",

                    vertical:
                        "middle"

                };


                // =================================================
                // HEADER
                // =================================================

                worksheet.mergeCells(
                    "A3:A4"
                );

                worksheet.mergeCells(
                    "B3:B4"
                );

                worksheet.mergeCells(
                    "C3:C4"
                );

                worksheet.mergeCells(
                    "D3:D4"
                );

                worksheet.mergeCells(
                    "E3:G3"
                );

                worksheet.mergeCells(
                    "H3:H4"
                );


                worksheet.getCell(
                    "A3"
                ).value =
                    "NO";


                worksheet.getCell(
                    "B3"
                ).value =
                    "NAMA";


                worksheet.getCell(
                    "C3"
                ).value =
                    "TANGGAL";


                worksheet.getCell(
                    "D3"
                ).value =
                    "NOMER WHATSAPP";


                worksheet.getCell(
                    "E3"
                ).value =
                    "FOLLOW UP";


                worksheet.getCell(
                    "E4"
                ).value =
                    "SMS";


                worksheet.getCell(
                    "F4"
                ).value =
                    "WA";


                worksheet.getCell(
                    "G4"
                ).value =
                    "CALL";


                worksheet.getCell(
                    "H3"
                ).value =
                    "KET";


                // =================================================
                // HEADER STYLE
                // =================================================

                for (
                    let row = 3;
                    row <= 4;
                    row++
                ) {

                    for (
                        let col = 1;
                        col <= 8;
                        col++
                    ) {

                        const cell =
                            worksheet.getCell(
                                row,
                                col
                            );


                        cell.font = {

                            bold:
                                true

                        };


                        cell.alignment = {

                            horizontal:
                                "center",

                            vertical:
                                "middle",

                            wrapText:
                                true

                        };


                        cell.border = {

                            top: {
                                style:
                                    "thin"
                            },

                            left: {
                                style:
                                    "thin"
                            },

                            bottom: {
                                style:
                                    "thin"
                            },

                            right: {
                                style:
                                    "thin"
                            }

                        };

                    }

                }


                // =================================================
                // DATA
                // =================================================

                data.forEach(
                    (
                        item,
                        index
                    ) => {

                        const row =
                            worksheet.getRow(
                                index + 5
                            );


                        row.getCell(
                            1
                        ).value =
                            index + 1;


                        row.getCell(
                            2
                        ).value =
                            item.company || "";


                        row.getCell(
                            3
                        ).value =
                            parseIndonesianDate(
                                item.created
                            );


                        row.getCell(
                            3
                        ).numFmt =
                            "dd/mm/yyyy";


                        row.getCell(
                            4
                        ).value =
                            String(
                                item.phone || ""
                            );


                        // SMS

                        row.getCell(
                            5
                        ).value =
                            item.smsSent
                                ? "✓"
                                : "";


                        // WA

                        row.getCell(
                            6
                        ).value =
                            item.waSent
                                ? "✓"
                                : "";


                        // CALL

                        row.getCell(
                            7
                        ).value =
                            item.callDone
                                ? "✓"
                                : "";


                        // KETERANGAN

                        row.getCell(
                            8
                        ).value =
                            item.notes ||
                            item.status ||
                            "";


                        for (
                            let col = 1;
                            col <= 8;
                            col++
                        ) {

                            const cell =
                                row.getCell(
                                    col
                                );


                            cell.alignment = {

                                horizontal:
                                    col === 8
                                        ? "left"
                                        : "center",

                                vertical:
                                    "middle",

                                wrapText:
                                    true

                            };


                            cell.border = {

                                top: {
                                    style:
                                        "thin"
                                },

                                left: {
                                    style:
                                        "thin"
                                },

                                bottom: {
                                    style:
                                        "thin"
                                },

                                right: {
                                    style:
                                        "thin"
                                }

                            };

                        }

                    }
                );


                // =================================================
                // WIDTH
                // =================================================

                worksheet.getColumn(
                    1
                ).width =
                    7;


                worksheet.getColumn(
                    2
                ).width =
                    32;


                worksheet.getColumn(
                    3
                ).width =
                    15;


                worksheet.getColumn(
                    4
                ).width =
                    22;


                worksheet.getColumn(
                    5
                ).width =
                    10;


                worksheet.getColumn(
                    6
                ).width =
                    10;


                worksheet.getColumn(
                    7
                ).width =
                    10;


                worksheet.getColumn(
                    8
                ).width =
                    35;


                // =================================================
                // FREEZE
                // =================================================

                worksheet.views = [

                    {

                        state:
                            "frozen",

                        ySplit:
                            4

                    }

                ];


                // =================================================
                // FILTER
                // =================================================

                worksheet.autoFilter = {

                    from:
                        "A4",

                    to:
                        `H${Math.max(
                            4,
                            data.length + 4
                        )}`

                };


                // =================================================
                // DOWNLOAD
                // =================================================

                const buffer =
                    await workbook.xlsx.writeBuffer();


                const blob =
                    new Blob(
                        [
                            buffer
                        ],
                        {

                            type:
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

                        }
                    );


                const url =
                    URL.createObjectURL(
                        blob
                    );


                const link =
                    document.createElement(
                        "a"
                    );


                link.href =
                    url;


                link.download =
                    `Google Business ${safeExcelFileName(marketing)}.xlsx`;


                document.body.appendChild(
                    link
                );


                link.click();


                document.body.removeChild(
                    link
                );


                URL.revokeObjectURL(
                    url
                );


                showToast(
                    "Excel berhasil dibuat."
                );

            }
            catch (error) {

                console.error(
                    error
                );


                showToast(
                    "Gagal membuat Excel."
                );

            }

        }
    );

}


// =====================================================
// INITIALIZE
// =====================================================

migrateOldData();

loadProfile();

renderTable();

updateDashboard();

renderFollowUpCustomers();

updateFollowUpStatus();