import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// إنشاء مجلد الشهادات إذا لم يكن موجوداً
const certDir = path.join(__dirname, 'certificates');
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir);
}

// إنشاء ملف تكوين OpenSSL
const opensslConfig = `
[req]
distinguished_name = req_distinguished_name
x509_extensions = v3_req
prompt = no

[req_distinguished_name]
C = EG
ST = Cairo
L = Cairo
O = Dr Bassma
OU = Development
CN = localhost

[v3_req]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = 127.0.0.1
DNS.3 = 192.168.137.1
IP.1 = 127.0.0.1
IP.2 = 192.168.137.1
`;

const configPath = path.join(certDir, 'openssl.cnf');
fs.writeFileSync(configPath, opensslConfig);

// إنشاء الشهادات
const keyPath = path.join(certDir, 'localhost-key.pem');
const certPath = path.join(certDir, 'localhost.pem');

try {
  // إنشاء المفتاح الخاص
  execSync(`openssl genrsa -out "${keyPath}" 2048`, { stdio: 'inherit' });
  
  // إنشاء شهادة SSL
  execSync(`openssl req -x509 -new -nodes -key "${keyPath}" -sha256 -days 365 -out "${certPath}" -config "${configPath}"`, { stdio: 'inherit' });
  
  // تنظيف ملف التكوين
  fs.unlinkSync(configPath);
  
  console.log('تم إنشاء شهادات SSL للتطوير بنجاح!');
} catch (error) {
  console.error('حدث خطأ أثناء إنشاء الشهادات:', error);
} 