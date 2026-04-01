const fs = require('fs');

const updateJson = (filePath, key, value) => {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        data[key] = value;
        // Clean up the test key if it exists
        delete data.NOT_FOUND_TEMP;
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Updated ${filePath}`);
    } catch (e) {
        console.error(`Error updating ${filePath}: ${e.message}`);
    }
};

const enData = {
    TITLE: "404 - Page Not Found",
    SUBTITLE: "Oops! It seems you've wandered into a digital void.",
    DESCRIPTION: "The page you're looking for doesn't exist or has been moved. Don't worry, even the best explorers get lost sometimes.",
    BACK_TO_HOME: "Return to Base",
    EXPLORE_SOLUTIONS: "Explore Our Solutions",
    NEED_HELP: "Still Need Assistance?",
    LATEST_UPDATES: "Check Our Latest Highlights",
    CONTACT_US: "Contact Support",
    SEARCH_READY: "Our team is ready to help you find what you need.",
    HOME_BUTTON: "Home"
};

const arData = {
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

updateJson("C:\\Users\\91790\\Desktop\\sharp-innovation-frontend\\public\\i18n\\en.json", "NOT_FOUND", enData);
updateJson("C:\\Users\\91790\\Desktop\\sharp-innovation-frontend\\public\\i18n\\ar.json", "NOT_FOUND", arData);
