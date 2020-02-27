# aws util

## 설치

```sh
npm install -g https://github.com/nosiar/aws-util.git
```

## 삭제

```sh
npm uninstall -g aws-util
```

## 환경변수

```sh
GITHUB_PERSONAL_ACCESS_TOKEN
```

(https://github.com/settings/tokens 에서 생성)

## 실행

### 브라우저에서 열기

#### aws 서비스

```sh
au open service <serviceNameKeyword>
```

#### github 저장소

```sh
au open gh <repositoryNameKeyword>
```

### Cloud Watch Insights

```sh
au logs <taskDefinitionNameKeyword> [messageFilter]
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
au open gh amant
au logs soto '/(?i)error/'
```
