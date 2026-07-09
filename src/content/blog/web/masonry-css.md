---
title: CSS만으로 Masonry 레이아웃 만들기
description: masonry 레이아웃을 만드는 방법에 대해 정리합니다.
date: 2026-07-09
tags:
  - Web
  - CSS
---

## CSS만으로 Masonry 레이아웃 만들기

Pinterest처럼 높이가 제각각인 카드가 빈틈없이 쌓이는 레이아웃을 흔히 masonry(벽돌쌓기) 레이아웃이라고 불러요. 많은 사람이 이걸 만들려고 JavaScript 라이브러리부터 찾습니다. 그런데 사실 CSS `columns` 속성 하나면 세 줄로 끝나요. 10년 넘게 모든 브라우저가 지원해 온 오래된 스펙인데도 의외로 잘 알려져 있지 않습니다.

이 글에서는 masonry를 만드는 네 가지 방법을 다룹니다. 각 방법이 항목을 **세로로 채우는지 가로로 채우는지**, 그리고 장단점이 무엇인지 비교하고, 복사해서 바로 실행해 볼 수 있는 HTML 샘플을 함께 넣었어요.

- `columns` 순수 CSS, 가장 쉬움, 완전 지원
- `grid` 가로 순서를 지키지만 약간의 JS 필요
- `grid-lanes` 최신 네이티브 방식, 현재 Safari만 정식 지원
- JS 라이브러리 어디서나 동작하지만 JS 의존

## 시작하기 전에 알아둘 한 가지

masonry 방식을 고를 때 가장 중요한 판단 기준은 **항목이 채워지는 방향**이에요.

- **세로 우선(column-first)** 1열을 위에서 아래로 채우고 2열로 넘어가요. 그래서 화면에 보이는 순서와 HTML 소스(DOM) 순서가 어긋납니다. 키보드 탭 이동이나 스크린 리더가 이 어긋남에 혼란을 겪을 수 있어요.
- **가로 우선(row-first)** 왼쪽에서 오른쪽으로 한 줄씩 채워요. 보이는 순서가 DOM 순서와 일치해서 접근성에 유리합니다.

네 방법의 근본적인 차이가 대부분 여기서 갈립니다.

## 1. columns로 만드는 masonry

가장 먼저 추천하는 방법이에요. CSS Multi-column Layout 모듈에 속한 속성으로, 원래는 신문처럼 텍스트를 여러 단으로 흘리려고 만들어졌습니다. 이 "여러 단으로 흘리는" 성질을 그대로 카드에 적용하면 masonry가 돼요.

### 동작 방식

`columns`로 열을 정의하면 브라우저가 항목을 첫 열부터 세로로 채우다가, 열이 목표 높이에 도달하면 다음 열로 넘깁니다. 여기에 `break-inside: avoid` 한 줄을 더하면 카드가 열 경계에서 반으로 잘리지 않고 통째로 다음 열로 이동해요. 이게 masonry의 계단식 배치를 만듭니다.

### 샘플 코드

<style>
.css-masonry {
  columns: 220px; /* 220px 너비 기준으로 열 개수 자동 조절 */
  gap: 16px;
  padding: 10px;
  border: 1px solid #444;
}
.css-masonry .card {
  break-inside: avoid; /* 카드가 열 경계에서 잘리지 않게 */
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 10px;
  color: #000;
}
</style>
<div class="css-masonry">
  <div class="card" style="background: #6ea8fe; height:120px">Card 1</div>
  <div class="card" style="background: #7ee787; height:220px">Card 2</div>
  <div class="card" style="background: #f0883e; height:90px">Card 3</div>
  <div class="card" style="background: #e685b5; height:180px">Card 4</div>
  <div class="card" style="background: #a5a5ff; height:140px">Card 5</div>
  <div class="card" style="background: #56d4dd; height:260px">Card 6</div>
  <div class="card" style="background: #f2cc60; height:110px">Card 7</div>
  <div class="card" style="background: #ff7b72; height:200px">Card 8</div>
  <div class="card" style="background: #6ea8fe; height:150px">Card 9</div>
</div>

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <style>
      .css-masonry {
        columns: 220px; /* 220px 너비 기준으로 열 개수 자동 조절 */
        gap: 16px;
        padding: 10px;
        border: 1px solid #444;
      }
      .css-masonry .card {
        break-inside: avoid; /* 카드가 열 경계에서 잘리지 않게 */
        margin-bottom: 16px;
        padding: 16px;
        border-radius: 10px;
        color: #000;
      }
    </style>
  </head>
  <body>
    <div class="css-masonry">
      <div class="card" style="background: #6ea8fe; height:120px">Card 1</div>
      <div class="card" style="background: #7ee787; height:220px">Card 2</div>
      <div class="card" style="background: #f0883e; height:90px">Card 3</div>
      <div class="card" style="background: #e685b5; height:180px">Card 4</div>
      <div class="card" style="background: #a5a5ff; height:140px">Card 5</div>
      <div class="card" style="background: #56d4dd; height:260px">Card 6</div>
      <div class="card" style="background: #f2cc60; height:110px">Card 7</div>
      <div class="card" style="background: #ff7b72; height:200px">Card 8</div>
      <div class="card" style="background: #6ea8fe; height:150px">Card 9</div>
    </div>
  </body>
</html>
```

`columns: 220px` 한 줄이 열 너비만 지정하는데, 브라우저가 화면 폭에 맞춰 들어갈 수 있는 만큼 열을 자동으로 만들어요. 그래서 미디어 쿼리 없이도 반응형으로 동작합니다. 실무에서는 `height`를 직접 주지 않고 이미지 원본 비율이나 콘텐츠 길이가 높이 편차를 자연스럽게 만들어요.

### 배치 방향과 장단점

- **배치 방향** 세로 우선
- **장점** 순수 CSS 세 줄이면 끝나요. 모든 최신 브라우저가 완전히 지원하고, 미디어 쿼리 없이 반응형이 됩니다. 의존성이 전혀 없어요.
- **단점** 세로 우선이라 시각적 순서와 DOM 순서가 어긋나요. 그래서 탭 이동 순서가 부자연스럽고 접근성이 약합니다. 항목 순서를 세밀하게 제어하기도 어려워요.

읽기 순서가 크게 중요하지 않은 이미지 갤러리나 카드 목록이라면 이 방법이 가장 실용적입니다.

지금은 `columns`와 `break-inside`만 썼지만, multi-column 레이아웃에는 그 밖에도 다양한 속성이 있어요. 열 개수를 직접 지정하는 `column-count`, 열 너비를 정하는 `column-width`, 열 사이 간격을 조절하는 `column-gap`, 열 사이에 구분선을 그리는 `column-rule`, 특정 요소를 모든 열에 걸치게 하는 `column-span`, 채우기 방식을 정하는 `column-fill` 등이 있습니다. 필요에 따라 조합하면 훨씬 세밀하게 제어할 수 있으니, 자세한 내용은 MDN의 [CSS multi-column layout 문서](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_multicol_layout)를 참고하세요.

## 2. grid로 만드는 masonry

일반 CSS Grid만으로는 masonry가 안 돼요. Grid는 같은 행에 속한 셀들의 높이를 그 행에서 가장 큰 항목에 맞춰 통일하기 때문입니다. 높이가 제각각이어도 빈 공간을 남길지언정 높이를 어긋나게 두지 않아요. 이건 Grid의 설계 자체가 그렇습니다.

그래서 Grid로 masonry를 만들려면 트릭이 필요해요. 행 높이를 아주 작게 쪼갠 뒤, 각 항목이 자기 높이만큼 여러 행을 차지(span)하게 만드는 방식입니다. 다만 항목의 실제 높이를 재서 span 값을 계산하려면 약간의 JavaScript가 들어가요.

### 샘플 코드

<style>
.grid-masonry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  grid-auto-rows: 1px; /* 1px 단위로 잘게 나눠 오차를 최소화 */
  column-gap: 16px; /* 열 간격 */
  row-gap: 0; /* 행 간격은 0으로 두고 마진으로 처리 */
  padding: 10px;
  border: 1px solid #444;
}
.grid-masonry .card {
  padding: 16px;
  border-radius: 10px;
  color: #000;
  margin-bottom: 16px; /* 이 마진이 실제 세로 간격이 됨 */
}
</style>
<div class="grid-masonry">
  <div class="card" style="background: #6ea8fe; height:120px">Card 1</div>
  <div class="card" style="background: #7ee787; height:220px">Card 2</div>
  <div class="card" style="background: #f0883e; height:90px">Card 3</div>
  <div class="card" style="background: #e685b5; height:180px">Card 4</div>
  <div class="card" style="background: #a5a5ff; height:140px">Card 5</div>
  <div class="card" style="background: #56d4dd; height:260px">Card 6</div>
</div>
<script>
  (function () {
    function layout() {
      document.querySelectorAll(".grid-masonry .card").forEach(function (card) {
        // 카드 높이 + 아래 마진을 1px 행 단위로 환산
        var mb = parseFloat(getComputedStyle(card).marginBottom);
        var h = card.getBoundingClientRect().height + mb;
        card.style.gridRowEnd = "span " + Math.ceil(h);
      });
    }
    layout();
    window.addEventListener("load", layout);
    window.addEventListener("resize", layout);
  })();
</script>

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <style>
      .grid-masonry {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        grid-auto-rows: 1px; /* 1px 단위로 잘게 나눠 오차를 최소화 */
        column-gap: 16px; /* 열 간격 */
        row-gap: 0; /* 행 간격은 0으로 두고 마진으로 처리 */
        padding: 10px;
        border: 1px solid #444;
      }
      .grid-masonry .card {
        padding: 16px;
        border-radius: 10px;
        color: #000;
        margin-bottom: 16px; /* 이 마진이 실제 세로 간격이 됨 */
      }
    </style>
  </head>
  <body>
    <div class="grid-masonry">
      <div class="card" style="background: #6ea8fe; height:120px">Card 1</div>
      <div class="card" style="background: #7ee787; height:220px">Card 2</div>
      <div class="card" style="background: #f0883e; height:90px">Card 3</div>
      <div class="card" style="background: #e685b5; height:180px">Card 4</div>
      <div class="card" style="background: #a5a5ff; height:140px">Card 5</div>
      <div class="card" style="background: #56d4dd; height:260px">Card 6</div>
    </div>

    <script>
      // 각 카드 높이 + 아래 마진을 1px 행 단위로 환산해 span 값 계산
      function layout() {
        document
          .querySelectorAll(".grid-masonry .card")
          .forEach(function (card) {
            var mb = parseFloat(getComputedStyle(card).marginBottom);
            var h = card.getBoundingClientRect().height + mb;
            card.style.gridRowEnd = "span " + Math.ceil(h);
          });
      }
      window.addEventListener("load", layout);
      window.addEventListener("resize", layout);
    </script>
  </body>
</html>
```

여기서 행 간격을 균일하게 맞추는 게 핵심이에요. `grid-auto-rows`를 `1px`로 아주 잘게 나누고 `row-gap`을 `0`으로 둡니다. 그러면 카드가 자기 높이만큼의 행을 정확히 차지해서 자투리 공간이 거의 안 생겨요. 세로 간격은 카드의 `margin-bottom: 16px`가 담당하고, 열 간격은 `column-gap: 16px`가 담당하니 가로세로 간격이 모두 16px로 일정해집니다. JavaScript는 각 카드의 높이에 마진을 더한 값을 1px 행 단위로 환산해 `span`에 넣어줘요.

행 간격을 `gap`으로 주면서 `grid-auto-rows`를 크게 잡으면, 카드가 차지하는 행 수를 올림으로 계산하는 과정에서 카드마다 남는 자투리가 달라져 세로 간격이 들쭉날쭉해집니다. `1px` + `row-gap: 0` + 마진 조합이 이 문제를 피하는 방법이에요.

### 배치 방향과 장단점

- **배치 방향** 가로 우선. 항목이 DOM 순서대로 왼쪽에서 오른쪽으로 놓여요.
- **장점** 시각적 순서가 DOM 순서와 일치해서 접근성이 좋아요. Grid의 span, 라인 배치 같은 기능을 그대로 쓸 수 있고, Grid를 지원하는 모든 브라우저에서 동작합니다.
- **단점** 높이 계산에 JavaScript가 필요해요. 창 크기가 바뀌거나 폰트, 이미지가 늦게 로드되면 다시 계산해야 합니다. 순수 CSS는 아니에요.

가로 순서를 지켜야 하면서 아직 `grid-lanes`를 쓰기엔 이르다면 현실적인 절충안입니다.

## 3. grid-lanes로 만드는 masonry

가장 최신 방법이에요. 브라우저가 네이티브로 masonry를 지원하는 방식으로, 오랜 표준화 논의 끝에 `display: grid-lanes`라는 문법으로 정리됐습니다. 예전 제안이던 `grid-template-rows: masonry`를 본 적이 있다면 그게 이 기능의 초기 문법이에요.

### 동작 방식

각 항목이 가장 여유가 많은 열로 흘러 들어가면서, 엄격한 행 구분 없이 빽빽하게 쌓여요. 세로/가로 편차를 알아서 채워주는 데다 JavaScript도 필요 없고 DOM 순서도 지킵니다. columns의 쉬움과 grid의 가로 순서 유지를 둘 다 가진 셈이에요.

### 샘플 코드

⚠️ display: grid-lanes 는 2026년 7월 기준 Safari에서만 masonry로 동작합니다.
Chrome·Firefox 등 다른 브라우저에서는 일반 grid로 폴백되어 균일 격자로 보여요.

<style>
.lanes-masonry {
  display: grid; /* 미지원 브라우저에서는 일반 grid로 폴백 */
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  padding: 10px;
  border: 1px solid #444;
}
/* 지원하는 브라우저에서만 masonry 활성화 */
@supports (display: grid-lanes) {
  .lanes-masonry {
    display: grid-lanes;
  }
}
.lanes-masonry .card {
  padding: 16px;
  border-radius: 10px;
  color: #000;
}
</style>
<div class="lanes-masonry">
  <div class="card" style="background: #6ea8fe; height:120px">Card 1</div>
  <div class="card" style="background: #7ee787; height:220px">Card 2</div>
  <div class="card" style="background: #f0883e; height:90px">Card 3</div>
  <div class="card" style="background: #e685b5; height:180px">Card 4</div>
  <div class="card" style="background: #a5a5ff; height:140px">Card 5</div>
  <div class="card" style="background: #56d4dd; height:260px">Card 6</div>
</div>

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <style>
      .lanes-masonry {
        display: grid; /* 미지원 브라우저에서는 일반 grid로 폴백 */
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 16px;
        padding: 10px;
        border: 1px solid #444;
      }
      /* 지원하는 브라우저에서만 masonry 활성화 */
      @supports (display: grid-lanes) {
        .lanes-masonry {
          display: grid-lanes;
        }
      }
      .lanes-masonry .card {
        padding: 16px;
        border-radius: 10px;
        color: #000;
      }
    </style>
  </head>
  <body>
    <div class="lanes-masonry">
      <div class="card" style="background: #6ea8fe; height:120px">Card 1</div>
      <div class="card" style="background: #7ee787; height:220px">Card 2</div>
      <div class="card" style="background: #f0883e; height:90px">Card 3</div>
      <div class="card" style="background: #e685b5; height:180px">Card 4</div>
      <div class="card" style="background: #a5a5ff; height:140px">Card 5</div>
      <div class="card" style="background: #56d4dd; height:260px">Card 6</div>
    </div>
  </body>
</html>
```

`@supports`로 감싼 이유가 있어요. 지원하지 않는 브라우저에서는 이 규칙을 무시하고 위의 일반 grid가 폴백으로 적용됩니다. 미지원 환경에서도 최소한 격자 형태는 유지되니 안전해요. 위 라이브 샘플도 Safari가 아니면 masonry가 아니라 일반 grid로 보일 수 있어요.

### 배치 방향과 장단점

- **배치 방향** 가로 우선. DOM 순서를 지켜요.
- **장점** 순수 CSS이면서 가로 순서까지 지켜 접근성이 좋아요. Grid의 배치 기능도 함께 쓸 수 있습니다. masonry의 이상적인 형태예요.
- **단점** 2026년 7월 기준으로 Safari만 정식 지원해요. Chrome과 Firefox는 실험적 플래그 뒤에 있고 연내 정식 지원이 예상됩니다. 지원 브라우저가 아직 Safari뿐이라 폴백이 필수예요.

미래를 위한 코드로 지금 넣어두되, 반드시 폴백과 함께 써야 합니다.

## 4. JavaScript 라이브러리로 만드는 masonry

Masonry.js, Isotope 같은 라이브러리를 쓰는 방법이에요. 네이티브 masonry가 나오기 전부터 오래 쓰여 온 전통적인 방식입니다.

### 동작 방식

라이브러리가 각 항목의 크기를 측정한 뒤, 어느 열에 넣을지 계산해서 `position: absolute`와 `top`, `left` 좌표로 직접 배치해요. 브라우저의 레이아웃 엔진에 맡기지 않고 JavaScript가 위치를 일일이 지정하는 방식입니다.

### 샘플 코드

<style>
.js-masonry {
  padding: 10px;
  border: 1px solid #444;
}
.js-masonry .card {
  width: 220px;
  padding: 16px;
  border-radius: 10px;
  color: #000;
  box-sizing: border-box;
  margin-bottom: 16px;
}
</style>
<div class="js-masonry">
  <div class="card" style="background: #6ea8fe; height:120px">Card 1</div>
  <div class="card" style="background: #7ee787; height:220px">Card 2</div>
  <div class="card" style="background: #f0883e; height:90px">Card 3</div>
  <div class="card" style="background: #e685b5; height:180px">Card 4</div>
  <div class="card" style="background: #a5a5ff; height:140px">Card 5</div>
  <div class="card" style="background: #56d4dd; height:260px">Card 6</div>
</div>
<script src="https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js"></script>
<script>
  window.addEventListener("load", function () {
    if (window.Masonry) {
      new Masonry(".js-masonry", {
        itemSelector: ".card",
        columnWidth: 220,
        gutter: 16,
        fitWidth: true,
      });
    }
  });
</script>

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <style>
      .js-masonry .card {
        width: 220px;
        padding: 16px;
        border-radius: 10px;
        color: #000;
        box-sizing: border-box;
        margin-bottom: 16px;
      }
    </style>
  </head>
  <body>
    <div class="js-masonry">
      <div class="card" style="background: #6ea8fe; height:120px">Card 1</div>
      <div class="card" style="background: #7ee787; height:220px">Card 2</div>
      <div class="card" style="background: #f0883e; height:90px">Card 3</div>
      <div class="card" style="background: #e685b5; height:180px">Card 4</div>
      <div class="card" style="background: #a5a5ff; height:140px">Card 5</div>
      <div class="card" style="background: #56d4dd; height:260px">Card 6</div>
    </div>

    <!-- CDN에서 라이브러리 불러오기 -->
    <script src="https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js"></script>
    <script>
      // 라이브러리가 카드를 position:absolute로 배치
      new Masonry(".js-masonry", {
        itemSelector: ".card",
        columnWidth: 220,
        gutter: 16,
        fitWidth: true,
      });
    </script>
  </body>
</html>
```

라이브러리에 선택자와 열 너비, 간격만 넘기면 나머지 배치는 알아서 처리해요. 위치를 절대 좌표로 잡기 때문에 컨테이너 높이나 애니메이션 같은 세밀한 제어가 가능합니다.

### 배치 방향과 장단점

- **배치 방향** 가로 우선. DOM 순서를 지켜요.
- **장점** 브라우저를 가리지 않고 어디서나 동작해요. 재배치 애니메이션이나 필터링 같은 부가 기능을 세밀하게 제어할 수 있습니다.
- **단점** JavaScript에 전적으로 의존해요. 라이브러리가 항목을 측정하고 재배치하는 동안 화면이 한 번 출렁이는 레이아웃 시프트가 생길 수 있습니다. 번들 크기와 실행 비용도 부담이에요.

브라우저 호환성을 폭넓게 보장해야 하거나 복잡한 인터랙션이 필요할 때 선택합니다.

## 네 가지 방법 비교

| 방법          | 배치 방향 | 순수 CSS    | 브라우저 지원 | 접근성(순서) |
| ------------- | --------- | ----------- | ------------- | ------------ |
| columns       | 세로 우선 | O           | 완전 지원     | 약함         |
| grid          | 가로 우선 | X (JS 필요) | 완전 지원     | 좋음         |
| grid-lanes    | 가로 우선 | O           | Safari만 정식 | 좋음         |
| JS 라이브러리 | 가로 우선 | X           | 무관          | 좋음         |

## 어떤 방법을 골라야 할까

상황에 맞춰 이렇게 정리할 수 있어요.

- **읽기 순서가 크게 중요하지 않은 이미지 갤러리** `columns`. 가장 쉽고 확실합니다.
- **가로 순서를 지켜야 하고 지금 당장 모든 브라우저에서 동작해야 함** `grid` span 트릭 또는 JS 라이브러리.
- **최신 브라우저를 타깃으로 하고 미래 대비 코드를 넣고 싶음** `grid-lanes` + 폴백.
- **복잡한 필터링이나 애니메이션이 필요함** JS 라이브러리.

핵심은 이거예요. **높이 편차와 가로 순서, 접근성을 순수 CSS만으로 동시에 만족하는 건 `grid-lanes`가 유일**하지만 아직 지원이 과도기예요. 그래서 지금 가장 무난한 선택은 `columns`이고, 가로 순서까지 필요하면 grid 트릭이나 라이브러리로 보완하는 방향이 현실적입니다.
