---
title: img의 `width`/`height`는 '크기'가 아니라 '비율'이다
description: 이미지가 늦게 떠서 아래 텍스트가 밀리는 CLS를 img의 width·height 속성으로 막는 원리와 방법.
date: 2026-07-02
tags:
  - Web
  - Image
  - CLS
---

이미지가 늦게 뜨면서 그 아래 텍스트가 밀려 내려가고, 누르려던 버튼이 어긋나는 현상. 이게 **CLS(Cumulative Layout Shift, 누적 레이아웃 이동)**, Core Web Vitals의 핵심 지표 중 하나입니다.

이 글을 읽으면 다음을 얻어요.

- `img`에 `width`/`height`를 적으면 CLS가 왜 줄어드는지, 그 원리
- 이 속성을 "화면에 그릴 크기"로 오해할 때 생기는 문제
- 크기를 알 때 / 모를 때 / 아예 통제 못 할 때(게시판·뉴스 본문)까지 상황별 대응법

**`width`/`height` 속성은 이미지를 그 크기로 그리라는 지시가 아니라, 원본 파일의 가로:세로 비율을 브라우저에 알려주는 칸입니다.**

![속성이 없으면 이미지가 도착할 때 텍스트가 밀려 CLS가 생기고, 속성이 있으면 공간이 미리 예약돼 이동이 없다](/imgs/img-tag-cls/img-cls-comparison.svg)

---

## 속성이 하는 진짜 일: 레이아웃 공간 예약

`<img width="200" height="200">`로 적고 CSS로는 `400×400`으로 그린다고 합시다. 이때도 속성은 **도움이 됩니다.** "크기를 200으로 고정해서"가 아니라 **비율(aspect-ratio)을 확보해서**예요.

브라우저는 속성값을 최종 크기로 쓰지 않아요. 두 값의 **비율**로 `aspect-ratio`를 계산한 뒤, 이미지가 다운로드되기 **전에** 그 비율만큼 레이아웃 공간을 미리 잡아둡니다. 공간이 예약돼 있으니 이미지가 나중에 도착해도 주변 요소가 밀리지 않아요.

`200×200`은 1:1이고 CSS `400×400`도 1:1이라 예약한 공간과 실제 표시 비율이 정확히 맞습니다. 그래서 값이 200이든 400이든 상관없어요. 비율만 같으면 됩니다.

![width=200 height=200을 브라우저가 aspect-ratio 1:1로 계산하고, CSS로 200px든 400px든 크기를 바꿔도 비율은 그대로 유지된다](/imgs/img-tag-cls/img-size-vs-ratio.svg)

```html
<img
  src="photo.jpg"
  width="400"
  height="400"
  alt="설명 텍스트"
  style="width: 400px; height: auto;"
/>
```

자주 헷갈리는 세 가지를 구분해요.

- **CLS**: 가장 큰 이득을 봅니다. 단, 자동 공간 계산은 CSS가 `width`만 주고 `height: auto`일 때 작동해요. CSS로 `width`·`height`를 둘 다 고정하면 속성이 없어도 CLS는 안 생기지만, 안전망으로 속성을 남겨두는 편이 낫습니다.
- **접근성(a11y)**: `width`/`height`와 무관합니다. 접근성은 `alt`가 담당해요.
- **최적화**: 실제 다운로드 해상도는 `srcset`/`sizes`가 결정하지, `width`/`height` 속성이 정하지 않아요. 오히려 200px 원본을 400px로 그리면 업스케일 때문에 흐려지는데, 이건 속성 문제가 아니라 원본 해상도 문제입니다.

---

## 비율이 어긋나면 무슨 일이 생기나

문제는 크기가 달라질 때가 아니라 **비율이 달라질 때** 생깁니다. 두 경우로 나뉘어요.

**CSS로 `width`·`height`를 둘 다 명시한 경우** — CSS가 이깁니다. 원본과 비율이 다르면 이미지가 찌그러져요. `object-fit: cover`나 `contain`으로 처리하면 됩니다. 레이아웃 자체는 안전해요(공간이 고정돼 있으니까요).

**CSS로 `width`만 주고 `height: auto`인 경우** — 이게 함정입니다. 브라우저는 로드 전엔 속성 비율로 공간을 예약했다가, 로드 후 원본 비율로 다시 계산해요. 두 비율이 다르면 그 순간 **높이가 바뀌면서 CLS가 발생**합니다.

그래서 규칙은 하나예요. **`width`/`height` 속성 칸에는 "화면에 그릴 크기"가 아니라 "원본 파일의 가로:세로 비율"을 적으세요.** 크기는 CSS로 얼마든지 바꿔도 됩니다.

| 상황                         | 속성값 | CSS                        | 결과        |
| ---------------------------- | ------ | -------------------------- | ----------- |
| 크기만 축소/확대 (비율 동일) | 원본값 | `width: Npx; height: auto` | ✅ 완벽     |
| 비율을 바꿔 크롭 표시        | 원본값 | 둘 다 지정 + `object-fit`  | ✅          |
| 비율 다른데 `height: auto`   | 원본값 | `width`만                  | ⚠️ CLS 발생 |

---

## 크기를 모르는 동적 콘텐츠라면

업로드된 이미지처럼 `width`/`height`를 미리 알 수 없는 경우예요. 우선순위대로 세 가지 방법이 있어요.

**1. 백엔드가 크기를 같이 내려주기 (최선)**
업로드 시점에 이미지 크기를 측정해 저장해두고, API 응답에 `width`/`height`를 포함시킵니다. 프론트는 그 값을 속성에 그대로 넣으면 끝이에요.

**2. 디자인으로 비율을 강제하기**
썸네일·카드·피드처럼 칸이 정해진 UI라면, 원본 비율을 몰라도 됩니다. 컨테이너에 `aspect-ratio`를 고정하고 이미지를 `object-fit`으로 채우면 CLS가 안 생겨요. 실무에서 동적 이미지의 대부분이 여기에 해당합니다.

![원본 비율을 몰라도 16:9 컨테이너를 고정하고 object-fit cover로 채우면 위아래가 잘리는 대신 CLS가 생기지 않는다](/imgs/img-tag-cls/img-aspect-ratio-container.svg)

```html
<div style="aspect-ratio: 16 / 9; width: 100%;">
  <img
    src="{이미지 URL}"
    alt="설명 텍스트"
    style="width: 100%; height: 100%; object-fit: cover;"
  />
</div>
```

**3. `onload`로 측정하기 (최후, 비권장)**
이미지가 로드된 뒤에야 크기를 알 수 있어서, 정작 CLS는 못 막아요. 다른 방법이 전혀 없을 때만 고려하세요.

---

## 게시판·뉴스 본문처럼 아무것도 모를 때

가장 어려운 경우입니다. 본문 이미지는 원본 비율 그대로(크롭 없이) 보여줘야 해서, 앞의 "컨테이너 `aspect-ratio` 강제" 기법을 못 씁니다. 이미지마다 비율이 제각각이니까요.

CLS를 없애는 유일한 길은 **각 이미지의 실제 비율을 아는 것**입니다. 핵심은 그걸 **읽을 때가 아니라 저장할 때 한 번** 계산하는 거예요.

### 정석: 저장 시점에 속성을 구워넣기

**A. 에디터 삽입 순간 저장 (비용이 가장 낮음)**
WYSIWYG 에디터는 이미지를 삽입하는 순간 크기를 알아요. 그때 HTML에 `width`/`height`를 함께 저장하면 런타임 비용이 0입니다.

**B. 발행·저장 시 서버에서 HTML 한 번 변환**
본문을 파싱해 각 `img`의 크기를 조회(CDN 메타데이터나 HTTP `HEAD` 요청)하고, 속성을 주입한 뒤 저장합니다. 글 하나당 딱 한 번만 실행돼요.

### 읽을 때는 전역 CSS 한 줄

속성으로 비율을 확보했다면, 읽는 쪽에서는 이 CSS만 있으면 됩니다.

```css
.article-body img {
  max-width: 100%;
  height: auto;
}
```

속성(비율 확보) + `max-width: 100%; height: auto`(반응형) 조합이 본문 이미지의 표준 해법이에요.

### 속성을 못 심는 레거시라면

이미 저장된 옛날 글이라 속성을 넣을 수 없다면, 렌더 직전에 CDN에서 비율만 받아 인라인 `aspect-ratio`를 주입하는 방법이 있어요. 다만 이미지마다 요청 비용이 듭니다. 그마저 어렵다면 스켈레톤 UI로 체감만 완화하는 게 마지막 수단이에요.

| 상황               | 해법                                                   |
| ------------------ | ------------------------------------------------------ |
| 에디터를 직접 운영 | 삽입 시 `width`/`height`를 HTML에 저장 (A)             |
| 외부 본문·레거시   | 발행 시 서버에서 한 번 파싱·주입 (B)                   |
| 공통               | `.article-body img { max-width: 100%; height: auto; }` |
| 아무것도 못 할 때  | 스켈레톤으로 체감만 완화                               |

---

## 프레임워크는 이걸 자동으로 해준다

지금까지의 규칙을 일일이 손으로 지키긴 번거롭습니다. Next.js의 `next/image`(React), Nuxt Image(Vue) 같은 이미지 컴포넌트는 이 개념들을 기본값으로 내장해 둡니다. 이 컴포넌트들이 `width`/`height`를 필수로 요구하는 이유가 바로 CLS예요.

`next/image`는 크기를 아는 이미지라면 `width`/`height`를 **필수로** 받습니다. 이 값은 화면에 그릴 크기가 아니라 비율을 정하는 용도라, 앞에서 본 원리와 똑같아요. 표시 크기는 CSS로 바꾸되 `height: auto`를 유지하면 됩니다.

```jsx
import Image from "next/image";

<Image src="/photo.jpg" width={1200} height={800} alt="설명 텍스트" />;
```

크기를 미리 모를 땐 `fill`을 씁니다. 이미지가 부모를 꽉 채우는 방식이라, 부모에 `position: relative`와 크기(또는 `aspect-ratio`)를 주고 `object-fit`으로 채웁니다. 이 글의 "디자인으로 비율 강제하기"와 같은 패턴이에요.

```jsx
<div style={{ position: "relative", aspectRatio: "16 / 9" }}>
  <Image
    src={url}
    fill
    sizes="100vw"
    style={{ objectFit: "cover" }}
    alt="설명 텍스트"
  />
</div>
```

컴포넌트는 여기에 더해 `srcset`/`sizes` 생성, 지연 로딩, 포맷 변환까지 처리합니다.

---

## 정리

- `width`/`height` 속성은 크기 지정이 아니라 **비율 전달**입니다. 브라우저가 이 비율로 공간을 미리 예약해 CLS를 막아요.
- **크기가 달라지는 건 문제가 아니고, 비율이 달라지는 게 문제**입니다.
- 크기를 모르면: 백엔드가 내려주기 → 디자인으로 비율 강제 → (최후) `onload` 순으로 시도하세요.
- 본문처럼 통제가 안 되면: **저장할 때 속성을 구워넣고, 읽을 때는 `max-width: 100%; height: auto`**가 정석입니다.
- 반응형 이미지(`srcset`·`<picture>`)에서도 `width`/`height` 속성은 그대로 붙여야 CLS를 막아요. 마크업별 CSS 위치는 아래 부록 참고.
- `next/image` 같은 컴포넌트는 이 규칙을 자동으로 지켜줘요. 크기를 알면 `width`/`height`, 모르면 `fill` + 부모 `aspect-ratio`.

---

## 부록: 반응형 이미지에서 CSS를 거는 위치

> 이 부분은 CLS보다는 `srcset`·`<picture>` 마크업에서 CSS를 어디에 두느냐에 대한 참고 자료입니다. 핵심만 말하면, **CSS는 항상 실제로 렌더링되는 `<img>`에 겁니다.** `<picture>`·`<source>`는 소스 선택용이라 화면에 그려지지 않아요.

### `srcset` / `sizes` — 해상도만 다를 때

같은 비율의 이미지를 크기만 다르게 주는 경우예요. 속성과 CSS 모두 `<img>` 한 곳에 씁니다.

```html
<img
  src="photo-800.jpg"
  srcset="photo-400.jpg 400w, photo-800.jpg 800w, photo-1200.jpg 1200w"
  sizes="(max-width: 600px) 100vw, 600px"
  width="1200"
  height="800"
  alt="설명 텍스트"
/>
```

```css
img {
  max-width: 100%;
  height: auto;
}
```

후보들의 비율이 모두 같으니 `width`/`height`는 비율만 맞으면 어떤 값이든 하나로 충분해요.

### `<picture>` — 포맷·크롭을 뷰포트별로 줄 때

`width`/`height` 속성은 fallback `<img>`에 답니다. 모든 소스의 비율이 같다면 이것으로 끝이에요. 크기·`object-fit` 같은 CSS도 `<picture>`가 아니라 `<img>`에 겁니다.

```html
<picture>
  <source srcset="photo.avif" type="image/avif" />
  <source srcset="photo.webp" type="image/webp" />
  <img src="photo.jpg" width="1200" height="800" alt="설명 텍스트" />
</picture>
```

```css
/* picture가 아니라 그 안의 img에 건다 */
picture img {
  max-width: 100%;
  height: auto;
}
```

`<picture>`를 블록으로 다루고 싶을 때만 `picture { display: block }` 정도를 더하면 돼요.

### art direction — 소스마다 비율이 다를 때

모바일은 정사각, 데스크톱은 와이드처럼 크롭 비율 자체가 달라지는 경우예요. 이땐 fallback `<img>` 하나로는 각 소스의 공간을 예약할 수 없어서, 각 `<source>`에 `width`/`height`를 직접 답니다.

```html
<picture>
  <source
    media="(min-width: 600px)"
    srcset="wide.jpg"
    width="1200"
    height="500"
  />
  <img src="square.jpg" width="800" height="800" alt="설명 텍스트" />
</picture>
```

`<source>`의 `width`/`height`는 최신 HTML 스펙에 추가된 기능이라 크로미움·사파리 계열에서 동작해요. 다만 비율이 달라지는 이 경우는 브라우저 지원이 갈릴 수 있어서, 확실히 하려면 CSS에서 미디어쿼리로 `aspect-ratio`를 함께 지정해두는 게 안전합니다. 이때도 CSS 대상은 `<img>`예요.

```css
/* 모바일: 정사각 */
picture img {
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
}
/* 데스크톱: 와이드 */
@media (min-width: 600px) {
  picture img {
    aspect-ratio: 12 / 5;
  }
}
```
