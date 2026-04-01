import json

def update_json(file_path, not_found_data):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    data['NOT_FOUND'] = not_found_data
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

en_data = {
    "TITLE": "404 - Page Not Found",
    "SUBTITLE": "Oops! It seems you've wandered into a digital void.",
    "DESCRIPTION": "The page you're looking for doesn't exist or has been moved. Don't worry, even the best explorers get lost sometimes.",
    "BACK_TO_HOME": "Return to Base",
    "EXPLORE_SOLUTIONS": "Explore Our Solutions",
    "NEED_HELP": "Still Need Assistance?",
    "LATEST_UPDATES": "Check Our Latest Highlights",
    "CONTACT_US": "Contact Support",
    "SEARCH_READY": "Our team is ready to help you find what you need.",
    "HOME_BUTTON": "Home"
}

ar_data = {
    "TITLE": "404 - الصفحة غير موجودة",
    "SUBTITLE": "عذراً! يبدو أنك تهت في فضاء رقمي غير معروف.",
    "DESCRIPTION": "الصفحة التي تبحث عنها غير موجودة أو تم نقلها. لا تقلق، حتى أفضل المستكشفين يضيعون أحياناً.",
    "BACK_TO_HOME": "العودة إلى الرئيسية",
    "EXPLORE_SOLUTIONS": "استكشف حلولنا",
    "NEED_HELP": "هل ما زلت بحاجة للمساعدة؟",
    "LATEST_UPDATES": "تحقق من آخر أخبارنا",
    "CONTACT_US": "اتصل بالدعم",
    "SEARCH_READY": "فريقنا مستعد لمساعدتك في العثور على ما تحتاجه.",
    "HOME_BUTTON": "الرئيسية"
}

update_json(r"c:\Users\91790\Desktop\sharp-innovation-frontend\public\i18n\en.json", en_data)
update_json(r"c:\Users\91790\Desktop\sharp-innovation-frontend\public\i18n\ar.json", ar_data)
print("Updated successfully")
