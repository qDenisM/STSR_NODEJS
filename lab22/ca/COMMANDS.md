# Lab 22 — роль CA (сервер XYZ)

Замените **XYZ** на инициалы CA, **ABC** — на инициалы Resource.  
Все команды выполняйте из каталога `lab22/ca`.

## 1. Создать CA-сертификат (CN = CA-LAB22-MDS)

```bash
cd lab22/ca

openssl genrsa -out ca.key 2048

openssl req -new -x509 -days 3650 -key ca.key -out ca.crt \
  -subj "/CN=CA-LAB22-MDS"
```

Проверка:

```bash
openssl x509 -in ca.crt -noout -subject -issuer
```

## 2. Получить CSR от Resource по локальной сети

На сервере Resource партнёр поднимает файловый сервер и кладёт `resource.csr` в `lab22/resource/send/`.

Узнайте IP сервера Resource (например `192.168.1.20`) и скачайте CSR:

```bash
curl -o resource.csr http://192.168.1.20:9000/resource.csr
```

Проверка CSR:

```bash
openssl req -in resource.csr -noout -subject
```

Ожидается: `CN=RS-LAB22-ABC`.

## 3. Подписать сертификат (SAN: LAB22-ABC, ABC)

В файле `san.cnf` должны быть домены Resource. Для второго раунда (смена ролей) замените на `LAB22-XYZ` и `XYZ`.

```bash
openssl x509 -req -in resource.csr \
  -CA ca.crt -CAkey ca.key -CAcreateserial \
  -out resource.crt -days 365 \
  -extfile san.cnf -extensions v3_req
```

Проверка:

```bash
openssl x509 -in resource.crt -noout -text | grep -A1 "Subject Alternative Name"
openssl verify -CAfile ca.crt resource.crt
```

## 4. Передать сертификаты Resource по локальной сети

Скопируйте файлы в папку для раздачи:

```bash
mkdir -p send
cp ca.crt resource.crt send/
```

Запустите файловый сервер (оставьте терминал открытым):

```bash
node ../send-files.js send
```

Узнайте IP **этого** CA-сервера (например `172.20.10.2`).  
Партнёр на Resource скачивает:

```bash
curl -o ca.crt http://172.20.10.2:9000/ca.crt
curl -o resource.crt http://172.20.10.2:9000/resource.crt
```

**Не передавайте** файл `ca.key`.