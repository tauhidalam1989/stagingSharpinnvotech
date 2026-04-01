const fs = require('fs');
const filePath = 'C:\\Users\\91790\\Desktop\\sharp-innovation-frontend\\public\\i18n\\ar.json';
try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.NOT_FOUND = {
        TITLE: "404 - الصفحة غير موجودة",
        SUBTITLE: "عذراً! يبدو أنك تهت في فضاء رقمي غير معروف.",
        DESCRIPTION: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها. لا تقلق، حتى أفضل المستكشفين يضيعون أحياناً.",
        BACK_TO_HOME: "العودة إلى الرئيسية",
        EXPLORE_SOLUTIONS: "استكشف حلولنا",
        NEED_HELP: "هل ما زلت بحاجة للمساعدة؟",
        LATEST_UPDATES: "تحقق من آخر أخبارنا",
        CONTACT_US: "اتصل بالدعم",
        SEARCH_READY: "فريقنا مستعد لمساعدتك في العثور على ما تحتاجه.",
        HOME_BUTTON: "الرئيسية"
    };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log('Arabic Updated');
} catch (e) {
    console.error('Error:', e.message);
}
