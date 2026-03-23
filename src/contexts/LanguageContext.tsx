import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'my' | 'th';

const translations = {
  en: {
    // Nav
    public: 'Public', jobs: 'Jobs', marketplace: 'Marketplace',
    matchmaking: 'Matchmaking', profile: 'Profile',
    // Auth
    signIn: 'Sign In', signUp: 'Create Account', email: 'Email',
    password: 'Password', name: 'Full Name', phone: 'Phone',
    loginSuccess: 'Welcome back!', registerSuccess: 'Account created!',
    invalidCredentials: 'Invalid credentials', logout: 'Sign Out',
    alreadyAccount: 'Already have an account?', noAccount: "Don't have an account?",
    register: 'Register', jobSeeker: 'Job Seeker', recruiter: 'Recruiter',
    signingIn: 'Signing in...', creating: 'Creating account...',
    // Jobs
    findJob: 'Find your dream job', postJob: 'Post a Job', applyNow: 'Apply Now',
    applied: 'Applied', savedJobs: 'Saved Jobs', myApplications: 'My Applications',
    myPostedJobs: 'My Posted Jobs', applications: 'Applications',
    jobsFound: 'jobs found', searchJobs: 'Search jobs, companies...',
    location: 'Location', salary: 'Salary', jobType: 'Job Type',
    category: 'Category', description: 'Description', requirements: 'Requirements',
    coverLetter: 'Cover Letter', submitApplication: 'Submit Application',
    cancel: 'Cancel', save: 'Save', edit: 'Edit', delete: 'Delete',
    fullTime: 'Full-Time', partTime: 'Part-Time', contract: 'Contract',
    freelance: 'Freelance', remote: 'Remote', views: 'views',
    applicants: 'applicants', postedOn: 'Posted on', active: 'Active', inactive: 'Inactive',
    // Marketplace
    marketplace_title: 'Marketplace', sellItem: 'Sell Item', myListings: 'My Listings',
    talkToSeller: 'Talk to Seller', promote: 'Promote', itemsAvailable: 'items available',
    searchItems: 'Search items...', condition: 'Condition', brandNew: 'Brand New',
    likeNew: 'Like New', good: 'Good', fair: 'Fair', price: 'Price',
    // Matchmaking
    findMatch: 'Find Your Match', startMatching: 'Start Matching!',
    myMatches: 'My Matches', noMatches: 'No matches yet. Keep swiping!',
    itIsAMatch: "It's a Match!", sendMessage: 'Send Message', keepSwiping: 'Keep Swiping',
    bio: 'Bio', interests: 'Your Interests', photos: 'Add Photos',
    preferences: 'Your Preferences', preferredLocation: 'Preferred Location',
    ageRange: 'Age Range', workField: 'Preferred Work Field',
    peopleNearby: 'people nearby • Swipe or use buttons',
    allCaughtUp: "All caught up!", checkBackLater: 'Check back later for new profiles',
    // Profile
    myProfile: 'My Profile', profileCompletion: 'Profile Completion',
    personalInfo: 'Personal Information', education: 'Education',
    experience: 'Experience', skills: 'Skills', reviews: 'Reviews',
    matchingPrefs: 'Matching Preferences', language: 'Language',
    saving: 'Saving...', updateSuccess: 'Profile updated!',
    birthday: 'Birthday', address: 'Address', company: 'Company Name',
    companyDesc: 'Company Description', addSkill: 'Add skill',
    noReviews: 'No reviews yet', boostProfile: 'Boost Match Profile',
    // Common
    search: 'Search', back: 'Back', next: 'Continue →', skip: 'Skip for now →',
    loading: 'Loading...', retry: 'Refresh', contact: 'Contact',
    like: 'Like', comment: 'Comment', share: 'Share', sponsored: 'Sponsored',
  },
  my: {
    // Nav
    public: 'မိတ်ဆက်', jobs: 'အလုပ်များ', marketplace: 'ကုန်ပစ္စည်း',
    matchmaking: 'ချစ်သူရှာ', profile: 'ကိုယ်ရေး',
    // Auth
    signIn: 'ဝင်ရောက်မည်', signUp: 'အကောင့်ဖွင့်မည်', email: 'အီးမေးလ်',
    password: 'လျှို့ဝှက်နံပါတ်', name: 'အမည်အပြည့်အစုံ', phone: 'ဖုန်းနံပါတ်',
    loginSuccess: 'ကြိုဆိုပါသည်!', registerSuccess: 'အကောင့်ဖွင့်ပြီးပါပြီ!',
    invalidCredentials: 'အချက်အလက်မှားနေသည်', logout: 'ထွက်မည်',
    alreadyAccount: 'အကောင့်ရှိပြီးသားလား?', noAccount: 'အကောင့်မရှိသေးဘူးလား?',
    register: 'မှတ်ပုံတင်မည်', jobSeeker: 'အလုပ်ရှာသူ', recruiter: 'အလုပ်ရှင်',
    signingIn: 'ဝင်ရောက်နေသည်...', creating: 'ဖွင့်နေသည်...',
    // Jobs
    findJob: 'အိပ်မက်ထဲက အလုပ်ရှာမည်', postJob: 'အလုပ်ကြော်ငြာတင်မည်', applyNow: 'လျှောက်မည်',
    applied: 'လျှောက်ပြီး', savedJobs: 'သိမ်းထားသောအလုပ်', myApplications: 'ကျွန်ုပ်လျှောက်ထားချက်',
    myPostedJobs: 'ကျွန်ုပ်တင်ထားသောအလုပ်', applications: 'လျှောက်လွှာများ',
    jobsFound: 'အလုပ်ရှိသည်', searchJobs: 'အလုပ်၊ ကုမ္ပဏီရှာပါ...',
    location: 'နေရာ', salary: 'လစာ', jobType: 'အလုပ်အမျိုးအစား',
    category: 'အမျိုးအစား', description: 'ဖော်ပြချက်', requirements: 'လိုအပ်ချက်',
    coverLetter: 'လျှောက်လွှာစာ', submitApplication: 'တင်မည်',
    cancel: 'မလုပ်တော့', save: 'သိမ်းမည်', edit: 'ပြင်မည်', delete: 'ဖျက်မည်',
    fullTime: 'အချိန်ပြည့်', partTime: 'အချိန်ပိုင်း', contract: 'စာချုပ်',
    freelance: 'လွတ်လပ်သော', remote: 'အဝေးမှ', views: 'ကြည့်ရှုမှု',
    applicants: 'လျှောက်ထားသူ', postedOn: 'တင်သည့်ရက်', active: 'တက်ကြွသည်', inactive: 'ရပ်ဆိုင်းထား',
    // Marketplace
    marketplace_title: 'ကုန်ပစ္စည်းဈေးကွက်', sellItem: 'ပစ္စည်းရောင်းမည်', myListings: 'ကျွန်ုပ်ကြော်ငြာ',
    talkToSeller: 'ရောင်းသူနှင့်ဆက်သွယ်', promote: 'မြှင့်တင်မည်', itemsAvailable: 'ပစ္စည်းများရှိသည်',
    searchItems: 'ပစ္စည်းရှာပါ...', condition: 'အခြေအနေ', brandNew: 'အသစ်ဆုံး',
    likeNew: 'အသစ်နှင့်တူသည်', good: 'ကောင်းသည်', fair: 'သင့်တင့်သည်', price: 'စျေးနှုန်း',
    // Matchmaking
    findMatch: 'ချစ်သူရှာမည်', startMatching: 'စတင်မည်!',
    myMatches: 'ကျွန်ုပ်တို့ကိုက်ညီသူများ', noMatches: 'မကိုက်ညီသေးပါ။ ဆက်ကြည့်ပါ!',
    itIsAMatch: 'ကိုက်ညီသည်!', sendMessage: 'မက်ဆေ့ပို့မည်', keepSwiping: 'ဆက်ကြည့်မည်',
    bio: 'မိမိအကြောင်း', interests: 'ဝါသနာများ', photos: 'ဓာတ်ပုံများ',
    preferences: 'ဦးစားပေးချက်', preferredLocation: 'နှစ်သက်သောနေရာ',
    ageRange: 'အသက်အပိုင်းအခြား', workField: 'လုပ်ငန်းနယ်ပယ်',
    peopleNearby: 'ဦးရေ • ပွတ်ဆွဲ သို့မဟုတ် ခလုတ်နှိပ်ပါ',
    allCaughtUp: 'အားလုံးကြည့်ပြီး!', checkBackLater: 'နောက်မှ ပြန်စစ်ဆေးပါ',
    // Profile
    myProfile: 'ကိုယ်ရေးအချက်အလက်', profileCompletion: 'ပရိုဖိုင်ပြည့်စုံမှု',
    personalInfo: 'ကိုယ်ရေးအချက်အလက်', education: 'ပညာရေး',
    experience: 'အတွေ့အကြုံ', skills: 'ကျွမ်းကျင်မှုများ', reviews: 'သုံးသပ်ချက်',
    matchingPrefs: 'ကိုက်ညီမှုဦးစားပေး', language: 'ဘာသာစကား',
    saving: 'သိမ်းနေသည်...', updateSuccess: 'ပရိုဖိုင်အပ်ဒိတ်ပြီး!',
    birthday: 'မွေးနေ့', address: 'လိပ်စာ', company: 'ကုမ္ပဏီအမည်',
    companyDesc: 'ကုမ္ပဏီဖော်ပြချက်', addSkill: 'ကျွမ်းကျင်မှုထည့်မည်',
    noReviews: 'သုံးသပ်ချက်မရှိသေးပါ', boostProfile: 'ပရိုဖိုင်မြှင့်တင်မည်',
    // Common
    search: 'ရှာပါ', back: 'နောက်သို့', next: 'ဆက်မည် →', skip: 'ကျော်မည် →',
    loading: 'ခဏစောင့်...', retry: 'ပြန်လည်ကြည့်မည်', contact: 'ဆက်သွယ်မည်',
    like: 'နှစ်သက်', comment: 'မှတ်ချက်', share: 'မျှဝေ', sponsored: 'ကြော်ငြာ',
  },
  th: {
    // Nav
    public: 'สาธารณะ', jobs: 'งาน', marketplace: 'ตลาด',
    matchmaking: 'จับคู่', profile: 'โปรไฟล์',
    // Auth
    signIn: 'เข้าสู่ระบบ', signUp: 'สร้างบัญชี', email: 'อีเมล',
    password: 'รหัสผ่าน', name: 'ชื่อ-นามสกุล', phone: 'เบอร์โทรศัพท์',
    loginSuccess: 'ยินดีต้อนรับกลับ!', registerSuccess: 'สร้างบัญชีสำเร็จ!',
    invalidCredentials: 'ข้อมูลไม่ถูกต้อง', logout: 'ออกจากระบบ',
    alreadyAccount: 'มีบัญชีแล้วใช่ไหม?', noAccount: 'ยังไม่มีบัญชี?',
    register: 'ลงทะเบียน', jobSeeker: 'ผู้หางาน', recruiter: 'นายจ้าง',
    signingIn: 'กำลังเข้าสู่ระบบ...', creating: 'กำลังสร้างบัญชี...',
    // Jobs
    findJob: 'ค้นหางานในฝัน', postJob: 'โพสต์งาน', applyNow: 'สมัครเลย',
    applied: 'สมัครแล้ว', savedJobs: 'งานที่บันทึก', myApplications: 'ใบสมัครของฉัน',
    myPostedJobs: 'งานที่โพสต์', applications: 'ใบสมัคร',
    jobsFound: 'ตำแหน่งงาน', searchJobs: 'ค้นหางาน บริษัท...',
    location: 'ที่ตั้ง', salary: 'เงินเดือน', jobType: 'ประเภทงาน',
    category: 'หมวดหมู่', description: 'รายละเอียด', requirements: 'คุณสมบัติ',
    coverLetter: 'จดหมายสมัครงาน', submitApplication: 'ส่งใบสมัคร',
    cancel: 'ยกเลิก', save: 'บันทึก', edit: 'แก้ไข', delete: 'ลบ',
    fullTime: 'เต็มเวลา', partTime: 'พาร์ทไทม์', contract: 'สัญญาจ้าง',
    freelance: 'ฟรีแลนซ์', remote: 'ทำงานจากที่บ้าน', views: 'ครั้งที่ดู',
    applicants: 'ผู้สมัคร', postedOn: 'โพสต์เมื่อ', active: 'เปิดรับ', inactive: 'ปิดรับ',
    // Marketplace
    marketplace_title: 'ตลาดซื้อขาย', sellItem: 'ลงขาย', myListings: 'รายการของฉัน',
    talkToSeller: 'ติดต่อผู้ขาย', promote: 'โปรโมต', itemsAvailable: 'รายการที่มี',
    searchItems: 'ค้นหาสินค้า...', condition: 'สภาพ', brandNew: 'ของใหม่',
    likeNew: 'เหมือนใหม่', good: 'ดี', fair: 'พอใช้', price: 'ราคา',
    // Matchmaking
    findMatch: 'หาคู่ชีวิต', startMatching: 'เริ่มจับคู่!',
    myMatches: 'คู่ที่ตรงกัน', noMatches: 'ยังไม่มีคู่ที่ตรงกัน ปัดต่อไปเลย!',
    itIsAMatch: 'จับคู่สำเร็จ!', sendMessage: 'ส่งข้อความ', keepSwiping: 'ปัดต่อ',
    bio: 'เกี่ยวกับฉัน', interests: 'ความสนใจ', photos: 'รูปภาพ',
    preferences: 'ความชอบ', preferredLocation: 'พื้นที่ที่ต้องการ',
    ageRange: 'ช่วงอายุ', workField: 'สาขางาน',
    peopleNearby: 'คน • ปัดหรือกดปุ่ม',
    allCaughtUp: 'ดูครบทุกคนแล้ว!', checkBackLater: 'กลับมาดูใหม่ภายหลัง',
    // Profile
    myProfile: 'โปรไฟล์ของฉัน', profileCompletion: 'ความสมบูรณ์โปรไฟล์',
    personalInfo: 'ข้อมูลส่วนตัว', education: 'การศึกษา',
    experience: 'ประสบการณ์', skills: 'ทักษะ', reviews: 'รีวิว',
    matchingPrefs: 'การตั้งค่าจับคู่', language: 'ภาษา',
    saving: 'กำลังบันทึก...', updateSuccess: 'อัพเดทโปรไฟล์แล้ว!',
    birthday: 'วันเกิด', address: 'ที่อยู่', company: 'ชื่อบริษัท',
    companyDesc: 'รายละเอียดบริษัท', addSkill: 'เพิ่มทักษะ',
    noReviews: 'ยังไม่มีรีวิว', boostProfile: 'บูสต์โปรไฟล์',
    // Common
    search: 'ค้นหา', back: 'กลับ', next: 'ต่อไป →', skip: 'ข้ามก่อน →',
    loading: 'กำลังโหลด...', retry: 'รีเฟรช', contact: 'ติดต่อ',
    like: 'ถูกใจ', comment: 'ความคิดเห็น', share: 'แชร์', sponsored: 'โฆษณา',
  }
};

export type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
  return (localStorage.getItem('yk_lang') as Language) || 'my';
});

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('yk_lang', lang);
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
