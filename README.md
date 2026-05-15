# common-platform

`common-platform`은 여러 프로젝트에서 공통으로 재사용할 수 있는 플랫폼성 기능을 제공하기 위한 NestJS 기반 Monorepo입니다.

현재는 아래 두 서비스를 제공합니다.

* `file-service`: 파일 업로드, 다운로드, 메타데이터 관리, 삭제/복구, 저장소 추상화
* `notification-service`: Push 알림 발송, 알림 템플릿, 발송 기록, 재시도 처리

각 서비스는 같은 repository 안에 있지만 독립적으로 실행되고 배포될 수 있는 MSA 서비스입니다.
즉, 이 프로젝트는 **Monorepo 형태로 코드를 관리하지만, Monolith가 아니라 독립 서비스들의 묶음**입니다.

이 구조를 통해 `mindpush` 같은 개별 서비스 프로젝트에서 파일 관리와 알림 발송 기능을 중복 구현하지 않고 재사용할 수 있도록 합니다.

---

# 1. 목적

공통적으로 반복되는 기능을 각 프로젝트마다 새로 구현하지 않고, 별도의 플랫폼 서비스로 분리하여 재사용하는 것을 목표로 합니다.

주요 목표는 다음과 같습니다.

* 파일 관리, 알림 발송처럼 여러 프로젝트에서 재사용 가능한 기능의 공통화
* 서비스별 책임 분리를 통한 유지보수성 향상
* 프로젝트 증가 시 중복 구현 최소화
* 저장소, 알림 공급자 등 외부 의존성의 교체 가능성 확보
* 장기 운영을 고려한 독립 배포 및 확장 가능한 구조 유지

---

# 2. 아키텍처 개요

```text
Monorepo ≠ Monolith
```

`common-platform`은 하나의 repository로 관리되지만, 내부 서비스는 각각 독립적인 서버로 동작합니다.

```text
common-platform
 ├── file-service
 └── notification-service
```

각 서비스는 아래 원칙을 따릅니다.

* 독립 포트 사용
* 독립 Docker Container 실행
* 독립 배포 가능
* 자신의 도메인 데이터와 비즈니스 로직만 소유
* 다른 서비스의 DB schema를 직접 조회하거나 수정하지 않음
* 서비스 간 연동은 API 또는 메시지 기반 통신 사용

---

# 3. 서비스 구성

## 3.1 file-service

파일 관련 공통 기능을 담당합니다.

주요 역할:

* 파일 업로드 / 다운로드
* 파일 메타데이터 관리
* 소프트 삭제 / 복구
* 저장소 추상화
* 추후 S3 기반 저장소 확장

초기에는 `LocalStorageProvider`를 사용하고, 이후 `S3Provider`를 추가할 수 있도록 설계합니다.

---

## 3.2 notification-service

알림 발송 관련 공통 기능을 담당합니다.

주요 역할:

* FCM 기반 Push 알림 발송
* 알림 템플릿 관리
* 발송 기록 관리
* 재시도 처리
* 향후 Email, SMS 등 다른 알림 채널 확장 가능

---

# 4. 사용 예정 프로젝트

`common-platform`의 서비스는 이후 `mindpush` 프로젝트에서 사용될 예정입니다.

```text
mindpush
 ├── api-gateway
 └── quote-service
```

`mindpush`에서는 격언 도메인 로직을 담당하고, 파일 관리와 알림 발송 기능은 `common-platform`의 서비스를 연동하여 사용합니다.

예상 역할:

* `api-gateway`: 외부 요청 진입점
* `quote-service`: 격언, 분류, 사용자 알림 설정, 발송 대상 격언 선택
* `notification-service`: 실제 Push 알림 발송
* `file-service`: 필요한 파일 업로드 및 관리

---

# 5. 기술 스택

## Backend

* TypeScript
* NestJS
* TypeORM

## Database / Infra

* PostgreSQL
* Redis
* Docker
* GitHub Actions

## Storage / External Service

* Local Storage
* Amazon S3 예정
* Firebase Cloud Messaging(FCM)

---

# 6. 프로젝트 구조

```text
common-platform/
 ├── apps/
 │    ├── file-service/
 │    └── notification-service/
 │
 ├── libs/
 │    ├── common/
 │    ├── database/
 │    ├── queue/
 │    └── storage/
```

## apps

실제로 실행되는 독립 서비스가 위치합니다.

```text
apps/
 ├── file-service/
 └── notification-service/
```

## libs

여러 서비스에서 함께 사용할 수 있는 공통 모듈이 위치합니다.

```text
libs/
 ├── common/
 │    ├── const/
 │    ├── exception/
 │    ├── helper/
 │    └── util/
 ├── database/
 ├── queue/
 └── storage/
```

* `common`: 공통 상수, 예외, helper, util
* `database`: TypeORM 설정, `DatabaseModule`, migration
* `queue`: BullMQ 및 Redis Queue 공통 설정
* `storage`: `StorageProvider`, `LocalStorageProvider`, `S3Provider`

---

# 7. 데이터 관리 전략

## PostgreSQL

로컬 개발 환경에서는 공통 PostgreSQL 인스턴스를 사용하되, 서비스별 schema를 분리합니다.

```sql
file_schema
notification_schema
```

원칙:

* 각 서비스는 자기 schema만 사용합니다.
* 다른 서비스 schema의 테이블을 직접 JOIN하지 않습니다.
* 같은 PostgreSQL 인스턴스를 사용하더라도 논리적으로는 서비스별 독립 DB처럼 취급합니다.

## Redis

로컬 개발 환경에서는 공통 Redis 인스턴스를 사용하고, 서비스별 prefix를 분리합니다.

```text
file:
notification:
queue:
```

## File Storage

실제 파일은 프로젝트별 bucket으로 분리합니다.

```text
mindpush-storage
commerce-storage
```

bucket 내부 경로는 소문자 기반으로 관리합니다.

```text
profile/
quote/
push/
```

---

# 8. TypeORM / Migration 전략

* 운영 환경에서는 `synchronize: false`를 유지합니다.
* DB schema 변경은 migration 기반으로만 관리합니다.
* migration은 `libs/database/src/migrations`에서 관리합니다.
* CLI 전용 DataSource는 `libs/database/src/config/typeorm.config.ts`에 둡니다.
* Nest Runtime DB 연결은 `libs/database/src/database.module.ts`에서 담당합니다.
* MSA 구조에서는 `autoLoadEntities: false`를 기본으로 하고, 서비스별 Entity를 명시적으로 등록합니다.

---

# 9. 설계 원칙

## 장기 운영

* 모든 설계는 장기 운영을 전제로 판단합니다.
* 단기 편의보다 변경 용이성, 확장성, 장애 복구 가능성을 우선합니다.
* 외부 서비스는 교체 가능성을 전제로 추상화합니다.

## 외부 연동 추상화

* 저장소, 알림 공급자, 외부 API는 provider/interface 뒤로 감춥니다.
* 도메인 로직이 FCM, S3 등 특정 벤더 SDK에 직접 의존하지 않도록 합니다.

## 시간 처리

* DB 시간은 가능한 한 UTC 기준으로 저장합니다.
* 사용자 표시 시간과 실제 발송 시간은 timezone을 함께 고려합니다.
* 반복 알림은 timezone 변경, DST, 누락 방지, 재처리 가능성을 고려합니다.

## 로그

* 상태 변경, 삭제, 복구, 외부 전송 등 중요한 행위는 추적 가능한 로그를 남깁니다.
* 운영 로그와 비즈니스 감사 로그는 구분합니다.
* 대량 로그 테이블은 장기 운영을 고려해 파티셔닝 가능성을 검토합니다.

---

# 10. 네이밍 규칙

| 대상                              | 규칙                                     |
| ------------------------------- | -------------------------------------- |
| Class / Interface / Type / Enum | `PascalCase`                           |
| 변수 / 함수 / 메서드                   | `camelCase`                            |
| boolean 변수                      | `is` / `has` / `can` / `should` prefix |
| 배열 변수                           | 복수형                                    |
| 상수 / ENV / Enum 값               | `SCREAMING_SNAKE_CASE`                 |
| 파일명 / API URL / Queue 이름        | `kebab-case`                           |
| DB Table / DB Column            | `snake_case`                           |
| Redis Key                       | `:` 기반 prefix                          |
| S3 / 파일 경로                      | 소문자 기반, 여러 단어는 `kebab-case`            |

예시:

```ts
isDeleted
hasPermission
users
orderItems
MAX_FILE_SIZE
```

```sql
created_at
updated_at
deleted_at
user_idx
```

```ts
@Column({ name: 'user_idx' })
userIdx!: number;
```

---

# 11. 현재 상태

현재 개발 대상 서비스:

* `file-service`
* `notification-service`

향후 연동 예정 프로젝트:

* `mindpush`

  * `api-gateway`
  * `quote-service`

---

# 12. 방향성

`common-platform`은 특정 하나의 앱에 종속된 기능 모음이 아니라, 여러 프로젝트에서 재사용 가능한 공통 플랫폼 서비스 집합을 목표로 합니다.

새로운 기능을 추가할 때는 아래 기준을 먼저 확인합니다.

1. 여러 프로젝트에서 재사용 가능한 플랫폼 기능인가?
2. 특정 도메인 전용 로직이 섞여 있지 않은가?
3. 독립 서비스로 유지할 가치가 있는가?
4. 장기 운영 시 교체와 확장이 가능한 구조인가?

위 기준에 맞지 않는 기능은 `common-platform`이 아니라 해당 도메인 프로젝트 내부에 둡니다.
