export type Language = "en" | "hi" | "te" | "ur";

export interface Translations {
  scanOrderGrow: string;
  dineIn: string;
  takeaway: string;
  table: string;
  orderingForTable: string;
  menu: string;
  searchPlaceholder: string;
  allCategories: string;
  vegOnly: string;
  bestseller: string;
  customizable: string;
  addToCart: string;
  viewCart: string;
  itemsInCart: string;
  orderSummary: string;
  subtotal: string;
  gstTax: string;
  total: string;
  couponCode: string;
  applyCoupon: string;
  specialInstructions: string;
  choosePayment: string;
  payCash: string;
  payUpi: string;
  payOnline: string;
  placeOrder: string;
  orderPlaced: string;
  trackingOrder: string;
  stepReceived: string;
  stepAccepted: string;
  stepPreparing: string;
  stepReady: string;
  stepCompleted: string;
  callWaiter: string;
  requestBill: string;
  waiterAlerted: string;
  billRequested: string;
  stampsCard: string;
  stampsCollected: string;
  spinAndWin: string;
  spinNow: string;
  congratulations: string;
  soldOut: string;
  mins: string;
  selectVariants: string;
  selectAddons: string;
  yourName: string;
  phoneNumber: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    scanOrderGrow: "Scan. Order. Manage. Grow.",
    dineIn: "Dine-In",
    takeaway: "Takeaway",
    table: "Table",
    orderingForTable: "Ordering for",
    menu: "Digital Menu",
    searchPlaceholder: "Search delicious food, drinks & desserts...",
    allCategories: "All Items",
    vegOnly: "Pure Veg Only",
    bestseller: "Bestseller",
    customizable: "Customizable",
    addToCart: "Add to Order",
    viewCart: "View Cart",
    itemsInCart: "items in cart",
    orderSummary: "Order Bill Summary",
    subtotal: "Item Subtotal",
    gstTax: "Restaurant GST (5%)",
    total: "To Pay Amount",
    couponCode: "Enter promo code",
    applyCoupon: "Apply",
    specialInstructions: "Add cooking or packing instructions...",
    choosePayment: "Select Payment Method",
    payCash: "Pay Cash / Pay at Counter",
    payUpi: "Instant UPI (GPay / PhonePe / Paytm)",
    payOnline: "Online Gateway (Card / NetBanking)",
    placeOrder: "Confirm & Place Order",
    orderPlaced: "Order Placed Successfully!",
    trackingOrder: "Live Kitchen Order Tracking",
    stepReceived: "Order Received",
    stepAccepted: "Kitchen Accepted",
    stepPreparing: "Cooking in Kitchen",
    stepReady: "Ready to Serve",
    stepCompleted: "Delivered & Enjoyed",
    callWaiter: "Call Waiter",
    requestBill: "Request Final Bill",
    waiterAlerted: "Staff notified! A waiter will assist you shortly.",
    billRequested: "Bill request sent to billing counter.",
    stampsCard: "Digital Loyalty Card",
    stampsCollected: "stamps collected",
    spinAndWin: "Spin & Win Daily Treat",
    spinNow: "Spin the Wheel!",
    congratulations: "Congratulations! You won:",
    soldOut: "Sold Out",
    mins: "mins",
    selectVariants: "Choose Portion / Size",
    selectAddons: "Add Extra Toppings & Sides",
    yourName: "Your Name",
    phoneNumber: "Mobile Number (for updates)",
  },
  hi: {
    scanOrderGrow: "स्कैन करें. आर्डर करें. आनंद लें.",
    dineIn: "डाइन-इन (बैठकर खाएं)",
    takeaway: "टेकअवे (पैक कराएं)",
    table: "टेबल",
    orderingForTable: "टेबल के लिए आर्डर",
    menu: "डिजिटल मेनू",
    searchPlaceholder: "स्वादिष्ट व्यंजन, ड्रिंक्स खोजें...",
    allCategories: "सभी व्यंजन",
    vegOnly: "केवल शाकाहारी",
    bestseller: "बेस्टसेलर",
    customizable: "कस्टमाइज़ करें",
    addToCart: "आर्डर में जोड़ें",
    viewCart: "कार्ट देखें",
    itemsInCart: "व्यंजन कार्ट में हैं",
    orderSummary: "बिल का विवरण",
    subtotal: "कुल राशि",
    gstTax: "रेस्तरां जीएसटी (5%)",
    total: "कुल भुगतान राशि",
    couponCode: "कूपन कोड डालें",
    applyCoupon: "लागू करें",
    specialInstructions: "विशेष रसोई निर्देश (कम मिर्च आदि)...",
    choosePayment: "भुगतान का तरीका चुनें",
    payCash: "काउंटर / वेटर को नकद दें",
    payUpi: "तुरंत यूपीआई (GPay / PhonePe / Paytm)",
    payOnline: "ऑनलाइन गेटवे (कार्ड / नेटबैंकिंग)",
    placeOrder: "आर्डर कन्फर्म करें",
    orderPlaced: "आर्डर सफलतापूर्वक स्वीकार हुआ!",
    trackingOrder: "लाइव रसोई आर्डर ट्रैकिंग",
    stepReceived: "आर्डर प्राप्त हुआ",
    stepAccepted: "रसोई ने स्वीकार किया",
    stepPreparing: "रसोई में बन रहा है",
    stepReady: "परोसने के लिए तैयार",
    stepCompleted: "सर्व हो गया",
    callWaiter: "वेटर को बुलाएं",
    requestBill: "बिल मंगवाएं",
    waiterAlerted: "कर्मचारी को सूचित कर दिया गया है!",
    billRequested: "बिल अनुरोध काउंटर पर भेज दिया गया है।",
    stampsCard: "डिजिटल लॉयल्टी कार्ड",
    stampsCollected: "स्टैम्प्स एकत्र किए गए",
    spinAndWin: "स्पिन एंड विन लकी व्हील",
    spinNow: "पहिया घुमाएं!",
    congratulations: "बधाई हो! आपने जीता:",
    soldOut: "समाप्त",
    mins: "मिनट",
    selectVariants: "साइज चुनें",
    selectAddons: "अतिरिक्त टॉपिंग जोड़ें",
    yourName: "आपका नाम",
    phoneNumber: "मोबाइल नंबर",
  },
  te: {
    scanOrderGrow: "స్కాన్ చేయండి. ఆర్డర్ చేయండి. ఆస్వాదించండి.",
    dineIn: "డైన్-ఇన్",
    takeaway: "పార్శిల్ / టేక్‌అవే",
    table: "టేబుల్",
    orderingForTable: "ఆర్డర్ చేస్తున్న టేబుల్",
    menu: "డిజిటల్ మెనూ",
    searchPlaceholder: "రుచికరమైన వంటకాలు వెతకండి...",
    allCategories: "అన్ని రకాలు",
    vegOnly: "శాకాహారం మాత్రమే",
    bestseller: "అత్యధికంగా అమ్ముడైనవి",
    customizable: "అనుకూలీకరించదగినది",
    addToCart: "ఆర్డర్‌కు జోడించు",
    viewCart: "కార్ట్ చూడండి",
    itemsInCart: "వస్తువులు కార్ట్‌లో ఉన్నాయి",
    orderSummary: "బిల్లు వివరాలు",
    subtotal: "మొత్తం ధర",
    gstTax: "రెస్టారెంట్ జీఎస్టీ (5%)",
    total: "చెల్లించాల్సిన మొత్తం",
    couponCode: "కూపన్ కోడ్ నమోదు చేయండి",
    applyCoupon: "వర్తించు",
    specialInstructions: "ప్రత్యేక సూచనలు...",
    choosePayment: "చెల్లింపు పద్ధతిని ఎంచుకోండి",
    payCash: "కౌంటర్ వద్ద నగదు చెల్లింపు",
    payUpi: "తక్షణ యూపీఐ (UPI)",
    payOnline: "ఆన్‌లైన్ చెల్లింపు",
    placeOrder: "ఆర్డర్ ఖరారు చేయండి",
    orderPlaced: "ఆర్డర్ విజయవంతంగా నమోదైంది!",
    trackingOrder: "లైవ్ కిచెన్ ఆర్డర్ ట్రాకింగ్",
    stepReceived: "ఆర్డర్ అందింది",
    stepAccepted: "కిచెన్ ఆమోదించింది",
    stepPreparing: "తయారవుతోంది",
    stepReady: "వడ్డించడానికి సిద్ధం",
    stepCompleted: "పూర్తయింది",
    callWaiter: "వెయిటర్‌ను పిలవండి",
    requestBill: "బిల్లు అడగండి",
    waiterAlerted: "వెయిటర్‌కు సమాచారం అందింది!",
    billRequested: "బిల్లు అభ్యర్థన పంపబడింది.",
    stampsCard: "డిజిటల్ లాయల్టీ కార్డ్",
    stampsCollected: "స్టాంపులు సేకరించబడ్డాయి",
    spinAndWin: "స్పిన్ & విన్",
    spinNow: "వీల్ తిప్పండి!",
    congratulations: "అభినందనలు! మీరు గెలుచుకున్నారు:",
    soldOut: "స్టాక్ లేదు",
    mins: "నిమిషాలు",
    selectVariants: "పరిమాణాన్ని ఎంచుకోండి",
    selectAddons: "అదనపు టాపింగ్స్",
    yourName: "మీ పేరు",
    phoneNumber: "మొబైల్ సంఖ్య",
  },
  ur: {
    scanOrderGrow: "اسکین کریں۔ آرڈر کریں۔ لطف اٹھائیں۔",
    dineIn: "ڈائن ان (یہیں کھائیں)",
    takeaway: "ٹیک اوے (پارسل)",
    table: "میز نمبر",
    orderingForTable: "میز کے لئے آرڈر",
    menu: "ڈیجیٹل مینو",
    searchPlaceholder: "لذیذ کھانے، مشروبات اور میٹھے تلاش کریں...",
    allCategories: "تمام پکوان",
    vegOnly: "صرف سبزی خور",
    bestseller: "بہترین فروخت",
    customizable: "اپنی مرضی کے مطابق",
    addToCart: "آرڈر میں شامل کریں",
    viewCart: "کارٹ دیکھیں",
    itemsInCart: "آئٹمز کارٹ میں موجود ہیں",
    orderSummary: "بل کی تفصیل",
    subtotal: "کل رقم",
    gstTax: "ریستوراں جی ایس ٹی (5%)",
    total: "قابل ادائیگی رقم",
    couponCode: "پرومو کوڈ درج کریں",
    applyCoupon: "لاگو کریں",
    specialInstructions: "باورچی خانے کے لیے خصوصی ہدایات...",
    choosePayment: "طریقہ ادائیگی منتخب کریں",
    payCash: "کاؤنٹر یا ویٹر کو نقد دیں",
    payUpi: "فوری یو پی آئی (UPI)",
    payOnline: "آن لائن کارڈ یا نیٹ بینکنگ",
    placeOrder: "آرڈر کی تصدیق کریں",
    orderPlaced: "آرڈر کامیابی کے ساتھ موصول ہوا!",
    trackingOrder: "باورچی خانہ کی براہ راست پیش رفت",
    stepReceived: "آرڈر موصول ہوا",
    stepAccepted: "باورچی خانے نے قبول کیا",
    stepPreparing: "تیار کیا جا رہا ہے",
    stepReady: "پیش کرنے کے لیے تیار",
    stepCompleted: "مکمل ہو گیا",
    callWaiter: "ویٹر کو بلائیں",
    requestBill: "بل طلب کریں",
    waiterAlerted: "عملے کو مطلع کر دیا گیا ہے!",
    billRequested: "بل کی درخواست بھیج دی گئی۔",
    stampsCard: "ڈیجیٹل لائلٹی کارڈ",
    stampsCollected: "اسٹامپس جمع ہوئے",
    spinAndWin: "اسپن اور ون لکی وہیل",
    spinNow: "پہیہ گھمائیں!",
    congratulations: "مبارک ہو! آپ نے جیتا:",
    soldOut: "ختم ہو چکا ہے",
    mins: "منٹ",
    selectVariants: "سائز منتخب کریں",
    selectAddons: "اضافی ٹاپنگز",
    yourName: "آپ کا نام",
    phoneNumber: "موبائل نمبر",
  },
};
