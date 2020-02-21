# 로그 보기

| 대상        | s3                                                |
| ----------- | ------------------------------------------------- |
| api-gateway | s3://triple-api-gw-access-logs                    |
| internal-lb | s3://triple-tokyo-lb-logs/triple-internal-ecs-alb |
| external-lb | s3://triple-tokyo-lb-logs/triple-ecs-alb          |

## 설치

```sh
npm install
npm run build
npm install -g .
```

## 삭제

```sh
npm uninstall -g log-viewer
```

## 실행

```sh
log-viewer api|internal|external <start utc time> <end utc time>
```

## 예제

```sh
log-viewer api '2020-02-01 08:00' '2020-02-01 08:02' | tee api-gateway.log | awk '{print NR, substr($0, 1, 225)}' | less
log-viewer internal '2020-02-01 08:00' '2020-02-01 08:02' | tee logs/internal-lb.log | grep 'triple-user' | less
log-viewer external '2019-11-05T01:21' '2019-11-05T01:21' | tee logs/external-lb.log | grep -B 3 -A 5 '2019-11-05T01:21:04.660536Z'"

```
