# aws util

## 설치

```sh
npm install -g https://github.com/nosiar/aws-util.git
```

## 삭제

```sh
npm uninstall -g aws-util
```

## 실행

### 브라우저에서 aws console 열기

#### 서비스

```sh
au open service <serviceNameKeyword>
```

### Cloud Watch Insights

```sh
au logs <serviceNameKeyword> [messageFilter]
```

### 헬프

자세한 내용은 헬프를 보세요.

```sh
au --help
au open --help
au logs --help
```

## 예제

```sh
au open service riple-cit
au logs soto '/error/'
```
