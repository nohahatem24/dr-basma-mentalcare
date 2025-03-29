# موقع العناية النفسية

موقع للجلسات النفسية عبر الإنترنت مع نظام حجز المواعيد والدفع الآمن.

## المتطلبات

- Node.js (الإصدار 18 أو أحدث)
- npm أو yarn
- Docker (لتشغيل Supabase محلياً)
- حساب Supabase
- حساب Stripe

## التثبيت

1. استنساخ المستودع:
```bash
git clone https://github.com/yourusername/mental-care-website.git
cd mental-care-website
```

2. تثبيت التبعيات:
```bash
npm install
```

3. إنشاء ملف `.env` وتحديث المتغيرات البيئية:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

4. تشغيل Supabase محلياً:
```bash
npm run supabase:start
```

5. تطبيق ترحيل قاعدة البيانات:
```bash
npm run supabase:db:push
```

6. تشغيل التطبيق:
```bash
npm run dev
```

## الميزات

- نظام مصادقة كامل للمستخدمين والأطباء
- حجز المواعيد الفورية والمجدولة
- نظام دفع آمن باستخدام Stripe
- تتبع حالة الطبيب في الوقت الفعلي
- واجهة مستخدم سهلة الاستخدام
- تصميم متجاوب

## التقنيات المستخدمة

- React
- TypeScript
- Supabase (قاعدة البيانات والمصادقة)
- Stripe (نظام الدفع)
- Tailwind CSS (التصميم)

## المساهمة

نرحب بمساهماتكم! يرجى اتباع الخطوات التالية:

1. إنشاء فرع جديد (`git checkout -b feature/amazing-feature`)
2. حفظ التغييرات (`git commit -m 'إضافة ميزة رائعة'`)
3. دفع التغييرات إلى الفرع (`git push origin feature/amazing-feature`)
4. فتح طلب سحب

## الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) لمزيد من التفاصيل.
