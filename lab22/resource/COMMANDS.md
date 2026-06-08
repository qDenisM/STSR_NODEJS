# Lab 22 — роль Resource (сервер ABC)

Замените **ABC** на инициалы Resource, **XYZ** — на инициалы CA.  
Команды OpenSSL выполняйте из каталога `lab22/resource`.

## 1. Сгенерировать ключ и CSR (CN = RS-LAB22-ABC)

```bash
cd lab22/resource

openssl genrsa -out resource.key 2048

openssl req -new -key resource.key -out resource.csr \
  -subj "/CN=RS-LAB22-ABC"
```

Проверка:

```bash
openssl req -in resource.csr -noout -subject
```

## 2. Передать CSR на CA по локальной сети

```bash
mkdir -p send
cp resource.csr send/
node ../send-files.js send
```

Узнайте IP **этого** Resource-сервера (например `192.168.1.20`).  

Партнёр на CA скачивает:

```bash
curl -o resource.csr http://192.168.1.20:9000/resource.csr
```

Файл `resource.key` никому не передавайте.

## 3. Получить сертификаты от CA

После подписи CA отдаёт `ca.crt` и `resource.crt`.  
Скачайте с CA-сервера (IP например `172.20.10.9`):

```bash
curl -o ca.crt http://172.20.10.9:9000/ca.crt
curl -o resource.crt http://172.20.10.9:9000/resource.crt
```

Проверка:

```bash
openssl verify -CAfile ca.crt resource.crt
```

## 4. Импорт CA в доверенные центры сертификации

### macOS

```bash
sudo security add-trusted-cert -d -r trustRoot \
  -k /Library/Keychains/System.keychain ca.crt
```

Или дважды откройте `ca.crt` → Связка ключей → Доверие → «Всегда доверять».

### Windows (PowerShell от администратора)

```powershell
Import-Certificate -FilePath ca.crt -CertStoreLocation Cert:\LocalMachine\Root
```

Или: `certmgr.msc` → Доверенные корневые центры сертификации → Импорт.

Импорт нужен на **компьютере, с которого открываете браузер**.

## 5. Настроить hosts

### macOS / Linux

```bash
sudo nano /etc/hosts
```

### Windows

Открыть от администратора: `C:\Windows\System32\drivers\etc\hosts`

Добавить (IP — **Resource-сервера**, не CA):

```
172.20.10.2 LAB22-ABC
172.20.10.2 ABC
```

## 6. Запустить HTTPS-приложение 22-01

Из каталога `lab22`:

```bash
node 22-01.js
```

Сервер слушает порт **8443**. В браузере:

```
https://LAB22-ABC:8443/
https://ABC:8443/
```

## 7. Смена ролей (задание 12)

На этом сервере станьте CA — см. `../ca/COMMANDS.md`.  
Партнёр выполняет шаги из этого файла с инициалами XYZ.

В `hosts` для второго раунда:

```
192.168.1.10 LAB22-XYZ
192.168.1.10 XYZ
```

(IP — Resource-сервера во втором раунде.)