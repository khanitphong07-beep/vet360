# VET 360° — Installable PWA starter

โปรเจกต์ต้นแบบแอปคลังความรู้สัตวแพทย์ รองรับการติดตั้งบน iPhone/iPad (ผ่าน Safari > Share > Add to Home Screen) และ Android (ผ่าน Chrome > Install app / Add to Home Screen)

## มีอะไรในรุ่นนี้
- 12 หมวดความรู้ และบทเรียนตัวอย่าง
- ค้นหาบทเรียนและคำศัพท์
- คำศัพท์อังกฤษ คำอ่านภาษาไทย และความหมาย
- บันทึกบทเรียนและติดตามความคืบหน้า (localStorage บนอุปกรณ์)
- แบบทดสอบพร้อมเฉลยและคะแนน
- PWA manifest, service worker และไอคอน
- แคชไฟล์หลักเพื่อเปิดใช้งานออฟไลน์หลังเข้าครั้งแรก

## ทดลองบนเครื่อง
ต้องเปิดผ่าน HTTPS หรือ localhost เพื่อให้ Service Worker ทำงาน
1. แตกไฟล์ ZIP
2. เปิดโฟลเดอร์โปรเจกต์ใน VS Code
3. ใช้ส่วนขยาย Live Server หรือรัน `python -m http.server 8000`
4. เปิด `http://localhost:8000`

## เผยแพร่ให้ติดตั้งบนมือถือ
อัปโหลดไฟล์ทั้งหมดไปยังโฮสติ้งที่รองรับ HTTPS เช่น GitHub Pages, Netlify หรือ Vercel แบบ static site
- Android: เปิด URL ด้วย Chrome แล้วเลือก Install app หรือ Add to Home Screen
- iPhone/iPad: เปิด URL ด้วย Safari > Share > Add to Home Screen

## ข้อจำกัดที่ควรรู้
นี่คือ PWA แบบ local-first ไม่ใช่ native app package (.ipa/.apk) และยังไม่มีระบบบัญชีผู้ใช้/ฐานข้อมูล cloud/ซิงก์ข้ามอุปกรณ์/ระบบหลังบ้าน เนื้อหาเป็นข้อมูลเริ่มต้นเพื่อการศึกษา ต้องให้สัตวแพทย์และอาจารย์ผู้สอนตรวจสอบก่อนใช้เป็นแนวทางปฏิบัติจริง โดยเฉพาะยา การคำนวณขนาดยา การวางยาสลบ และการผ่าตัด

## โครงสร้าง
- `index.html` — โครงหน้าแอป
- `styles.css` — ธีม Clinical
- `app.js` — ระบบนำทาง การค้นหา บุ๊กมาร์ก แบบทดสอบ และ PWA install
- `data.js` — ฐานข้อมูลบทเรียนเริ่มต้น
- `manifest.webmanifest` — การตั้งค่า PWA
- `sw.js` — offline cache
- `assets/` — ไอคอน
