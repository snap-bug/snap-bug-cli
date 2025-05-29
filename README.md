<div align="center">

# 🐞SnapBug

SnapBug는 **React 애플리케이션**의 **상태 변화**와 **DOM**을 함께 저장해,<br> **디버깅**과 **상태 공유**를 쉽게 만들어주는 **타임트래블 디버깅** 도구입니다.

</div>

<br>

<div align="center">
<a href="https://github.com/snap-bug/snap-bug-client">Client Repository</a> | <a href="https://github.com/snap-bug/snap-bug-cdn">CDN Repository</a> |
<a href="https://www.notion.so/SNAP-BUG-1a955d59f1a78023b3c7d081eedf1cee?pvs=4">Team Notion</a>
</div>

<br><br>

## 목차

<!-- toc -->

- [Motivation](#motivation)
- [Preview](#preview)
- [Development](#development)
  - [1. React에서 상태는 어떻게 추적할 수 있을까?](#1-react%EC%97%90%EC%84%9C-%EC%83%81%ED%83%9C%EB%8A%94-%EC%96%B4%EB%96%BB%EA%B2%8C-%EC%B6%94%EC%A0%81%ED%95%A0-%EC%88%98-%EC%9E%88%EC%9D%84%EA%B9%8C)
    - [1.1 상태는 어디에 저장되어 있을까?](#11-%EC%83%81%ED%83%9C%EB%8A%94-%EC%96%B4%EB%94%94%EC%97%90-%EC%A0%80%EC%9E%A5%EB%90%98%EC%96%B4-%EC%9E%88%EC%9D%84%EA%B9%8C)
    - [1.2 React 앱의 루트 노드는 어떻게 찾을까?](#12-react-%EC%95%B1%EC%9D%98-%EB%A3%A8%ED%8A%B8-%EB%85%B8%EB%93%9C%EB%8A%94-%EC%96%B4%EB%96%BB%EA%B2%8C-%EC%B0%BE%EC%9D%84%EA%B9%8C)
    - [1.3 memoizedState만 추적해야하는 이유는 뭘까?](#13-memoizedstate%EB%A7%8C-%EC%B6%94%EC%A0%81%ED%95%B4%EC%95%BC%ED%95%98%EB%8A%94-%EC%9D%B4%EC%9C%A0%EB%8A%94-%EB%AD%98%EA%B9%8C)
  - [2. UI 시점별 복원을 위한 DOM + CSS 스냅샷 저장](#2-ui-%EC%8B%9C%EC%A0%90%EB%B3%84-%EB%B3%B5%EC%9B%90%EC%9D%84-%EC%9C%84%ED%95%9C-dom--css-%EC%8A%A4%EB%83%85%EC%83%B7-%EC%A0%80%EC%9E%A5)
    - [2.1 실시간 DOM 변화를 감지하기 위한 MutationObserver 활용](#21-%EC%8B%A4%EC%8B%9C%EA%B0%84-dom-%EB%B3%80%ED%99%94%EB%A5%BC-%EA%B0%90%EC%A7%80%ED%95%98%EA%B8%B0-%EC%9C%84%ED%95%9C-mutationobserver-%ED%99%9C%EC%9A%A9)
    - [2.2 DOM과 CSS를 함께 저장해야 시점별 UI를 정확히 복원할 수 있다](#22-dom%EA%B3%BC-css%EB%A5%BC-%ED%95%A8%EA%BB%98-%EC%A0%80%EC%9E%A5%ED%95%B4%EC%95%BC-%EC%8B%9C%EC%A0%90%EB%B3%84-ui%EB%A5%BC-%EC%A0%95%ED%99%95%ED%9E%88-%EB%B3%B5%EC%9B%90%ED%95%A0-%EC%88%98-%EC%9E%88%EB%8B%A4)
  - [3. 왜 CDN + NPM 여야 했을까?](#3-%EC%99%9C-cdn--npm-%EC%97%AC%EC%95%BC-%ED%96%88%EC%9D%84%EA%B9%8C)
    - [3.1 Puppeteer 방식의 한계](#31-puppeteer-%EB%B0%A9%EC%8B%9D%EC%9D%98-%ED%95%9C%EA%B3%84)
      - [1. FiberNode는 Puppeteer로 접근할 수 없습니다.](#1-fibernode%EB%8A%94-puppeteer%EB%A1%9C-%EC%A0%91%EA%B7%BC%ED%95%A0-%EC%88%98-%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4)
      - [2. CSR 앱에서는 타이밍 문제로 실패합니다.](#2-csr-%EC%95%B1%EC%97%90%EC%84%9C%EB%8A%94-%ED%83%80%EC%9D%B4%EB%B0%8D-%EB%AC%B8%EC%A0%9C%EB%A1%9C-%EC%8B%A4%ED%8C%A8%ED%95%A9%EB%8B%88%EB%8B%A4)
    - [3.2 외부 API 요청에는 CORS 문제가 있습니다.](#32-%EC%99%B8%EB%B6%80-api-%EC%9A%94%EC%B2%AD%EC%97%90%EB%8A%94-cors-%EB%AC%B8%EC%A0%9C%EA%B0%80-%EC%9E%88%EC%8A%B5%EB%8B%88%EB%8B%A4)
    - [3.3 그래서 CDN + NPM 병행 구조를 선택했습니다.](#33-%EA%B7%B8%EB%9E%98%EC%84%9C-cdn--npm-%EB%B3%91%ED%96%89-%EA%B5%AC%EC%A1%B0%EB%A5%BC-%EC%84%A0%ED%83%9D%ED%96%88%EC%8A%B5%EB%8B%88%EB%8B%A4)
      - [CDN : script 한 줄로 어디서든 동작하는 상태 추적 스크립트](#cdn--script-%ED%95%9C-%EC%A4%84%EB%A1%9C-%EC%96%B4%EB%94%94%EC%84%9C%EB%93%A0-%EB%8F%99%EC%9E%91%ED%95%98%EB%8A%94-%EC%83%81%ED%83%9C-%EC%B6%94%EC%A0%81-%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8)
      - [NPM : 프로젝트에 설치하여 CLI 도구로 활용](#npm--%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%EC%97%90-%EC%84%A4%EC%B9%98%ED%95%98%EC%97%AC-cli-%EB%8F%84%EA%B5%AC%EB%A1%9C-%ED%99%9C%EC%9A%A9)
  - [4. 명령어 하나로 디버깅 화면을 자동 배포할 수 있을까?](#4-%EB%AA%85%EB%A0%B9%EC%96%B4-%ED%95%98%EB%82%98%EB%A1%9C-%EB%94%94%EB%B2%84%EA%B9%85-%ED%99%94%EB%A9%B4%EC%9D%84-%EC%9E%90%EB%8F%99-%EB%B0%B0%ED%8F%AC%ED%95%A0-%EC%88%98-%EC%9E%88%EC%9D%84%EA%B9%8C)
    - [4.1. 상태 기록 파일을 확인합니다.](#41-%EC%83%81%ED%83%9C-%EA%B8%B0%EB%A1%9D-%ED%8C%8C%EC%9D%BC%EC%9D%84-%ED%99%95%EC%9D%B8%ED%95%A9%EB%8B%88%EB%8B%A4)
    - [4.2. 디버깅 UI를 빌드합니다.](#42-%EB%94%94%EB%B2%84%EA%B9%85-ui%EB%A5%BC-%EB%B9%8C%EB%93%9C%ED%95%A9%EB%8B%88%EB%8B%A4)
    - [4.3. Vercel로 자동 배포합니다.](#43-vercel%EB%A1%9C-%EC%9E%90%EB%8F%99-%EB%B0%B0%ED%8F%AC%ED%95%A9%EB%8B%88%EB%8B%A4)
    - [4.4 링크 하나로 문제 상황을 그대로 보여줍니다.](#44-%EB%A7%81%ED%81%AC-%ED%95%98%EB%82%98%EB%A1%9C-%EB%AC%B8%EC%A0%9C-%EC%83%81%ED%99%A9%EC%9D%84-%EA%B7%B8%EB%8C%80%EB%A1%9C-%EB%B3%B4%EC%97%AC%EC%A4%8D%EB%8B%88%EB%8B%A4)
- [Trouble Shooting](#trouble-shooting)
  - [1. React 내부 상태의 순환 참조로 인한 상태 전송 실패를 안전한 상태 필터링으로 해결](#1-react-%EB%82%B4%EB%B6%80-%EC%83%81%ED%83%9C%EC%9D%98-%EC%88%9C%ED%99%98-%EC%B0%B8%EC%A1%B0%EB%A1%9C-%EC%9D%B8%ED%95%9C-%EC%83%81%ED%83%9C-%EC%A0%84%EC%86%A1-%EC%8B%A4%ED%8C%A8%EB%A5%BC-%EC%95%88%EC%A0%84%ED%95%9C-%EC%83%81%ED%83%9C-%ED%95%84%ED%84%B0%EB%A7%81%EC%9C%BC%EB%A1%9C-%ED%95%B4%EA%B2%B0)
    - [원인 : React 상태 구조는 내부적으로 순환 참조를 포함하고 있다.](#%EC%9B%90%EC%9D%B8--react-%EC%83%81%ED%83%9C-%EA%B5%AC%EC%A1%B0%EB%8A%94-%EB%82%B4%EB%B6%80%EC%A0%81%EC%9C%BC%EB%A1%9C-%EC%88%9C%ED%99%98-%EC%B0%B8%EC%A1%B0%EB%A5%BC-%ED%8F%AC%ED%95%A8%ED%95%98%EA%B3%A0-%EC%9E%88%EB%8B%A4)
    - [해결 : 순환 참조를 막는 안전한 상태 필터링을 하자.](#%ED%95%B4%EA%B2%B0--%EC%88%9C%ED%99%98-%EC%B0%B8%EC%A1%B0%EB%A5%BC-%EB%A7%89%EB%8A%94-%EC%95%88%EC%A0%84%ED%95%9C-%EC%83%81%ED%83%9C-%ED%95%84%ED%84%B0%EB%A7%81%EC%9D%84-%ED%95%98%EC%9E%90)
      - [내부에서 사용되는 구조적 속성은 JSON 변환 대상에서 제외했습니다.](#%EB%82%B4%EB%B6%80%EC%97%90%EC%84%9C-%EC%82%AC%EC%9A%A9%EB%90%98%EB%8A%94-%EA%B5%AC%EC%A1%B0%EC%A0%81-%EC%86%8D%EC%84%B1%EC%9D%80-json-%EB%B3%80%ED%99%98-%EB%8C%80%EC%83%81%EC%97%90%EC%84%9C-%EC%A0%9C%EC%99%B8%ED%96%88%EC%8A%B5%EB%8B%88%EB%8B%A4)
  - [2. Fiber 트리를 제대로 순회하지 않아 일부 상태가 누락되던 문제](#2-fiber-%ED%8A%B8%EB%A6%AC%EB%A5%BC-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EC%88%9C%ED%9A%8C%ED%95%98%EC%A7%80-%EC%95%8A%EC%95%84-%EC%9D%BC%EB%B6%80-%EC%83%81%ED%83%9C%EA%B0%80-%EB%88%84%EB%9D%BD%EB%90%98%EB%8D%98-%EB%AC%B8%EC%A0%9C)
    - [원인 : Fiber 트리를 자식 노드만 따라가서 형제 노드는 누락됨](#%EC%9B%90%EC%9D%B8--fiber-%ED%8A%B8%EB%A6%AC%EB%A5%BC-%EC%9E%90%EC%8B%9D-%EB%85%B8%EB%93%9C%EB%A7%8C-%EB%94%B0%EB%9D%BC%EA%B0%80%EC%84%9C-%ED%98%95%EC%A0%9C-%EB%85%B8%EB%93%9C%EB%8A%94-%EB%88%84%EB%9D%BD%EB%90%A8)
    - [해결 : 전체 트리를 누락 없이 순회하도록 DFS 방식으로 변경](#%ED%95%B4%EA%B2%B0--%EC%A0%84%EC%B2%B4-%ED%8A%B8%EB%A6%AC%EB%A5%BC-%EB%88%84%EB%9D%BD-%EC%97%86%EC%9D%B4-%EC%88%9C%ED%9A%8C%ED%95%98%EB%8F%84%EB%A1%9D-dfs-%EB%B0%A9%EC%8B%9D%EC%9C%BC%EB%A1%9C-%EB%B3%80%EA%B2%BD)
    - [결과 : 컴포넌트의 상태가 빠짐없이 전부 수집됨](#%EA%B2%B0%EA%B3%BC--%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8%EC%9D%98-%EC%83%81%ED%83%9C%EA%B0%80-%EB%B9%A0%EC%A7%90%EC%97%86%EC%9D%B4-%EC%A0%84%EB%B6%80-%EC%88%98%EC%A7%91%EB%90%A8)
  - [3. 변화가 없는데도 계속 저장된다.](#3-%EB%B3%80%ED%99%94%EA%B0%80-%EC%97%86%EB%8A%94%EB%8D%B0%EB%8F%84-%EA%B3%84%EC%86%8D-%EC%A0%80%EC%9E%A5%EB%90%9C%EB%8B%A4)
    - [문제: DOM이 변하지 않았는데도 매번 전체 DOM과 스타일이 저장됨](#%EB%AC%B8%EC%A0%9C-dom%EC%9D%B4-%EB%B3%80%ED%95%98%EC%A7%80-%EC%95%8A%EC%95%98%EB%8A%94%EB%8D%B0%EB%8F%84-%EB%A7%A4%EB%B2%88-%EC%A0%84%EC%B2%B4-dom%EA%B3%BC-%EC%8A%A4%ED%83%80%EC%9D%BC%EC%9D%B4-%EC%A0%80%EC%9E%A5%EB%90%A8)
    - [해결 : DOM의 해시값을 비교해 변화가 있는 시점에만 저장하는 구조로 전환](#%ED%95%B4%EA%B2%B0--dom%EC%9D%98-%ED%95%B4%EC%8B%9C%EA%B0%92%EC%9D%84-%EB%B9%84%EA%B5%90%ED%95%B4-%EB%B3%80%ED%99%94%EA%B0%80-%EC%9E%88%EB%8A%94-%EC%8B%9C%EC%A0%90%EC%97%90%EB%A7%8C-%EC%A0%80%EC%9E%A5%ED%95%98%EB%8A%94-%EA%B5%AC%EC%A1%B0%EB%A1%9C-%EC%A0%84%ED%99%98)
    - [결과 : 화면에 실질적인 변화가 감지된 시점만 기록하는 구조로 최적화](#%EA%B2%B0%EA%B3%BC--%ED%99%94%EB%A9%B4%EC%97%90-%EC%8B%A4%EC%A7%88%EC%A0%81%EC%9D%B8-%EB%B3%80%ED%99%94%EA%B0%80-%EA%B0%90%EC%A7%80%EB%90%9C-%EC%8B%9C%EC%A0%90%EB%A7%8C-%EA%B8%B0%EB%A1%9D%ED%95%98%EB%8A%94-%EA%B5%AC%EC%A1%B0%EB%A1%9C-%EC%B5%9C%EC%A0%81%ED%99%94)
- [User Experience](#user-experience)
  - [1. 상태 추적 스크립트 삽입](#1-%EC%83%81%ED%83%9C-%EC%B6%94%EC%A0%81-%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%82%BD%EC%9E%85)
  - [2. 상태 및 UI 변화 저장](#2-%EC%83%81%ED%83%9C-%EB%B0%8F-ui-%EB%B3%80%ED%99%94-%EC%A0%80%EC%9E%A5)
  - [3. 배포 및 UI 복원 화면](#3-%EB%B0%B0%ED%8F%AC-%EB%B0%8F-ui-%EB%B3%B5%EC%9B%90-%ED%99%94%EB%A9%B4)
  - [4. 브라우저에서 상태 히스토리 확인](#4-%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80%EC%97%90%EC%84%9C-%EC%83%81%ED%83%9C-%ED%9E%88%EC%8A%A4%ED%86%A0%EB%A6%AC-%ED%99%95%EC%9D%B8)
- [Tech stack](#tech-stack)
  - [개발 환경](#%EA%B0%9C%EB%B0%9C-%ED%99%98%EA%B2%BD)
  - [1. 프론트엔드 - React + Vite](#1-%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C---react--vite)
  - [2. CLI - commander.js](#2-cli---commanderjs)
  - [3. 브라우저 접근 - CDN](#3-%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80-%EC%A0%91%EA%B7%BC---cdn)
  - [4. 배포 - Vercel](#4-%EB%B0%B0%ED%8F%AC---vercel)
- [Workflow](#workflow)
  - [Git 브랜치 전략](#git-%EB%B8%8C%EB%9E%9C%EC%B9%98-%EC%A0%84%EB%9E%B5)
  - [코드 작성 & 리뷰 방식](#%EC%BD%94%EB%93%9C-%EC%9E%91%EC%84%B1--%EB%A6%AC%EB%B7%B0-%EB%B0%A9%EC%8B%9D)
    - [PR & 이슈 기반 협업 사이클](#pr--%EC%9D%B4%EC%8A%88-%EA%B8%B0%EB%B0%98-%ED%98%91%EC%97%85-%EC%82%AC%EC%9D%B4%ED%81%B4)
    - [PR 템플릿 기반 커뮤니케이션](#pr-%ED%85%9C%ED%94%8C%EB%A6%BF-%EA%B8%B0%EB%B0%98-%EC%BB%A4%EB%AE%A4%EB%8B%88%EC%BC%80%EC%9D%B4%EC%85%98)
    - [코드 리뷰 가이드라인](#%EC%BD%94%EB%93%9C-%EB%A6%AC%EB%B7%B0-%EA%B0%80%EC%9D%B4%EB%93%9C%EB%9D%BC%EC%9D%B8)
    - [기본 구조](#%EA%B8%B0%EB%B3%B8-%EA%B5%AC%EC%A1%B0)
    - [커밋 타입](#%EC%BB%A4%EB%B0%8B-%ED%83%80%EC%9E%85)
  - [작업 방식](#%EC%9E%91%EC%97%85-%EB%B0%A9%EC%8B%9D)
    - [깃허브 칸반 보드](#%EA%B9%83%ED%97%88%EB%B8%8C-%EC%B9%B8%EB%B0%98-%EB%B3%B4%EB%93%9C)
    - [기록으로 소통의 공백을 채우다](#%EA%B8%B0%EB%A1%9D%EC%9C%BC%EB%A1%9C-%EC%86%8C%ED%86%B5%EC%9D%98-%EA%B3%B5%EB%B0%B1%EC%9D%84-%EC%B1%84%EC%9A%B0%EB%8B%A4)
- [Retrospective](#retrospective)
  - [정도원](#%EC%A0%95%EB%8F%84%EC%9B%90)
  - [이세경](#%EC%9D%B4%EC%84%B8%EA%B2%BD)

<!-- tocstop -->

<br>

# Motivation

이번 팀 프로젝트의 주요 목표는 **React 앱에서 발생하는 문제를 효과적으로 추적하고, 팀원과 상태를 공유할 수 있는 디버깅 도구를 만드는 것**이었습니다.<br>

**협업 중 가장 큰 어려움은 에러 상황을 정확히 재현하고 공유하는 일이었습니다.** 예를 들어, 버튼을 클릭했을 때 예상과 다른 화면이 나타나거나, 특정 순서로만 발생하는 오류는 설명이 복잡했습니다. 동일한 문제 상황을 물리적으로 떨어져 있는 팀원들에게 반복적으로 설명해야 했고, 화면을 직접 보여줄 수 없어 상황의 맥락을 정확히 전달하기가 번거로웠습니다.<br>

이런 문제를 해결하기 위해, 기존에 사용하던 **Redux DevTools**의 **Time Travel** 기능에서 아이디어를 얻었습니다. Redux DevTools는 상태의 변화를 시간 순서대로 추적할 수 있어 유용하지만 한계가 있었습니다. **Redux로 관리되지 않는 상태는 추적할 수 없었고**, **실제 렌더링 결과(CSS, 외부 환경, 에러 상태 등)를 저장하지 못했습니다**.

그래서 SnapBug는

- 모든 React 상태를 수집합니다.
- 실제 렌더링 된 DOM과 CSS를 함께 저장합니다.
- 당시의 UI를 정적 스냅샷처럼 저장합니다.
- 배포하여 URL로 공유하고 재현합니다.

<br>

협업 과정에서 발생한 문제를 보다 정확하게 재현하고, 손쉽게 공유할 수 있도록 서비스를 개발하게 되었습니다.

<br>

# Preview

- **SnapBug 설치 및 상태 추적 스크립트 연결**

  <img src="https://github.com/user-attachments/assets/565063e3-c63c-4072-b9e5-686accf36129" alt="snapbug환경설정" />

- **SnapBug 배포**

  <img src="https://github.com/user-attachments/assets/07ea6c9c-a51d-4fc5-8c7e-f24f61dee12f" alt="snapbug배포" />

- **배포된 SnapBug 페이지**

  <img src="https://github.com/user-attachments/assets/92657150-0620-47db-b0f2-0e9e5814d9aa" alt="snapbug페이지" />

<br>

# Development

## 1. React에서 상태는 어떻게 추적할 수 있을까?

**React의 상태는 FiberNode라는 내부 구조에 저장됩니다.** 저희는 상태 추적을 위해 React의 Fiber 구조를 직접 탐색하는 방식을 택했습니다.
상태를 추적하기 위해서는 먼저 React 앱의 최상위 루트 노드(Fiber Root) 를 찾고 그 아래에 있는 각 컴포넌트들의 상태를 하나하나 순회하면서 기록해야 했습니다.

### 1.1 상태는 어디에 저장되어 있을까?

React에서는 각 컴포넌트를 FiberNode라는 구조로 관리합니다. 이 구조 안에는 다양한 정보가 들어있었습니다.

- `memoizedState` : 현재 컴포넌트에서 사용하는 상태
- `memoizedProps` : 부모 컴포넌트로부터 받은 props
- `child` : 자식 컴포넌트
- `sibling` : 형제 컴포넌트
- `return` : 부모 컴포넌트

이 중에서 memoizedState는 상태 값들이 연결 리스트 형태로 저장되어 있어서 순회하면서 상태를 꺼낼 수 있었습니다.

### 1.2 React 앱의 루트 노드는 어떻게 찾을까?

<img src="https://i.ibb.co/PGSTsVMP/image-1.png" alt="image-1" border="0">
<img src="https://i.ibb.co/84xDzmz1/image.png" alt="image" border="0">

React 앱이 실제로 렌더링되면 React는 내부적으로 DOM 요소에 `__reactFiber$`또는 `__reactContainer$`라는 이름의 속성을 붙입니다. 이 키를 활용해 React가 관리하는 컴포넌트를 찾을 수 있었습니다.
<br>
이 키는 React 버전에 따라 달라질 수 있으므로 두 가지 경우를 모두 체크하여 Fiber 루트를 찾아야 했습니다.

```js
const getFiberRoot = () => {
  const elements = document.body.children;

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];

    for (const key in element) {
      if (
        key.startsWith("__reactContainer$") ||
        key.startsWith("__reactFiber$")
      ) {
        return element[key].stateNode.current;
      }
    }
  }

  return null;
};
```

이렇게 찾은 Fiber Root에서부터 컴포넌트 트리를 따라 내려가며 각 컴포넌트의 상태를 추적할 수 있었습니다.

### 1.3 memoizedState만 추적해야하는 이유는 뭘까?

React에서 진짜 상태 변화는 `memoizedState`에서만 발생하기 때문입니다. <br>
React 컴포넌트는 두 가지 데이터를 가지고 있는데 하나는 컴포넌트 내부에서 생성한 상태이고, 다른 하나는 부모에게서 전달받은 데이터(Props) 입니다. <br>

<img src="https://i.ibb.co/XZyMz6d8/image-2.png" alt="image-2" border="0">

이 둘은 각각 다음과 같은 곳에 저장됩니다.

- `memoizedState` : 컴포넌트가 useState와 같이 자신만의 상태를 가지고 있을 때 저장됩니다.
- `memoizedProps` : 컴포넌트가 Props와 같이 부모로부터 받은 값을 저장합니다.
  <br>
  React에서 문제를 정확히 추적하려면 직접 상태를 갖고 있는 컴포넌트를 중심으로 봐야 합니다.<br>
  memoizedProps는 그 자체로는 상태를 변화시키지 않고, 상위 컴포넌트의 영향을 받는 수동적인 데이터이기 때문입니다.<br>
  결론적으로 `memoizedState`를 기준으로 추적 범위를 제한함으로써 화면 변화에 직접 영향을 주는 핵심 상태만 기록했습니다. 이렇게 하면 불필요한 정보는 제외하고 디버깅에 실질적으로 도움이 되는 상태 변화만 명확하게 확인할 수 있습니다.

<br>

## 2. UI 시점별 복원을 위한 DOM + CSS 스냅샷 저장

SnapBug는 **상태 변화에 따라 실제 어떤 UI가 렌더링되었는지를 시각적으로 확인할 수 있도록** DOM과 CSS까지 함께 저장합니다.<br>
단순히 React 상태만 기록해서는 사용자가 실제로 본 화면의 전체 맥락을 파악하기 어렵기 때문입니다.

많은 UI 이슈는 레이아웃 붕괴, 스타일 충돌, 특정 요소 미노출 등 시각적인 결과에서 발생합니다. <br>
이러한 문제는 상태 값만으로는 재현하거나 공유하기 어렵습니다.

SnapBug는 이를 보완하기 위해 **React 상태와 함께 해당 시점의 DOM 구조와 CSS 스타일**을 저장합니다.
이렇게 저장된 정보는 SnapBug 클라이언트에서 타임라인 형태로 시각화되며
각 시점마다 “그때 실제로 어떤 UI가 사용자에게 보여졌는가”를 정확히 복원할 수 있도록 합니다.

### 2.1 실시간 DOM 변화를 감지하기 위한 MutationObserver 활용

SnapBug는 MutationObserver를 통해 사용자가 눈으로 보는 화면 변화와 React 상태를 정확히 동기화합니다.<br>
React 상태만 기록하면 UI 구조 변화(모달 등장, 에러 메시지 출력 등)를 포착할 수 없었습니다. 이를 해결하기 위해 DOM의 변화를 실시간으로 감지해 DOM과 스타일을 함께 저장하도록 구성했습니다.

이를 위한 핵심은 MutationObserver입니다. 이 객체는 특정 DOM 요소(예: #root, #app)에 대한 변화를 아래 항목 기준으로 추적합니다:

```js
const observer = new MutationObserver(() => {
  detectStateChange(); // 상태 + DOM 변화 기록
});

observer.observe(rootEl, {
  childList: true,
  subtree: true,
  attributes: true,
  characterData: true,
});
```

- childList: 자식 노드의 추가/삭제 감지
  > ex) 모달 등장/사라짐
- subtree: 감지 범위를 해당 요소의 모든 하위 노드까지 확장
  > ex) 자식이나 자손 요소의 속성, 텍스트 변경도 모두 추적 가능
- attributes: 요소 속성 변경 감지
  > ex) class 변경, style 변경
- characterData: 텍스트 노드 내용 변경 감지
  > ex) 에러 메시지 등장

이러한 변화가 감지되면 다음 로직이 실행됩니다.

1. 현재 React 상태를 Fiber 트리에서 추출합니다.
2. 현재 DOM의 HTML 구조와 스타일을 추출합니다.
3. DOM이 이전과 달라졌는지 판단합니다.
4. 변화가 있으면 상태, DOM, 스타일을 서버로 전송합니다.

### 2.2 DOM과 CSS를 함께 저장해야 시점별 UI를 정확히 복원할 수 있다

상태 정보만으로는 사용자가 실제로 본 UI를 복원할 수 없습니다.<br>
SnapBug는 디버깅 도구이자 UI 타임라인 뷰어입니다. 단순한 상태 변화 기록이 아닌 “그 상태에서 어떤 화면이 실제로 렌더링되었는가”를 함께 저장하고자 합니다.

이를 위해 SnapBug는 시점별로 다음 데이터를 .json 파일에 누적 기록합니다.

- React 상태 (state)
- DOM 구조 (outerHTML)
- 스타일 정보 (style, link 태그 등)

이 데이터들은 SnapBug 클라이언트에 의해 시각화되어 **시간의 흐름에 따른 상태 변화**와 **각 상태에서의 UI 렌더링 결과**를 타임라인 형태로 확인하게 합니다.

<br>

## 3. 왜 CDN + NPM 여야 했을까?

React의 상태는 브라우저 메모리 내부에만 존재하므로, 외부 툴(Puppeteer 등)로는 접근이 어렵습니다. 따라서 상태를 정확히 추적하려면 React 앱이 실행되는 브라우저 내부에서 직접 실행되는 방식이 필요했습니다.
초기에는 Puppeteer를 통해 React 상태를 수집하려 했지만, 실제 구현 과정에서 세 가지 큰 제약을 마주했고 이를 해결하기 위해 CDN + NPM 병행 배포 방식을 채택하게 되었습니다.
<br>

### 3.1 Puppeteer 방식의 한계

#### 1. FiberNode는 Puppeteer로 접근할 수 없습니다.

React는 렌더링 시 각 DOM 요소에 `__reactFiber$`, `__reactContainer$` 같은 내부 속성으로 상태 구조를 관리합니다.
하지만 이 정보는 브라우저 메모리에만 존재하며 보안상 document나 window를 통해서는 외부에서 접근할 수 없습니다.
즉, Puppeteer는 보이는 HTML만 추출할 수 있을 뿐, 진짜 상태를 파악할 수는 없습니다.

#### 2. CSR 앱에서는 타이밍 문제로 실패합니다.

Next.js, Vite 등 클라이언트 사이드 렌더링(CSR) 기반 앱은 렌더링 후에 React가 Fiber 구조를 구성합니다.
하지만 Puppeteer는 페이지가 완전히 렌더링되었는지 판단하지 못한 채 DOM을 수집하는 경우가 많아
아직 Fiber 구조가 생성되지 않은 상태에서 잘못된 시점의 데이터를 수집하거나 아예 상태 추적에 실패하곤 했습니다.

### 3.2 외부 API 요청에는 CORS 문제가 있습니다.

SnapBug는 상태를 추적한 뒤 이를 API 서버로 전송해야 합니다.
하지만 웹 보안 정책인 CORS(Cross-Origin Resource Sharing) 때문에 문제가 발생했습니다.

> 📌 **CORS란?** <br>
> 브라우저는 보안을 위해, 현재 웹사이트가 아닌 다른 도메인으로 데이터를 전송하려 할 때
> 그 서버가 이를 허용하는지 먼저 확인합니다. 허용되지 않으면 요청은 자동으로 차단됩니다.

브라우저 보안 정책 상 다른 도메인으로 직접 fetch를 시도하면 기본적으로 차단되며 특히 Chrome 확장 프로그램이나 iframe 내 실행 환경에서는 스크립트 삽입만으로도 API 요청이 차단되거나 정상적으로 작동하지 않는 문제가 반복되었습니다.

### 3.3 그래서 CDN + NPM 병행 구조를 선택했습니다.

SnapBug는 서버가 아닌 브라우저 내부에서 직접 실행되는 방식을 선택했습니다.
이 구조 덕분에 React 앱과 **같은 환경(origin)**에서 상태를 추적하고 서버에 전송할 수 있어
Puppeteer가 풀지 못한 FiberNode 접근 문제와 CORS 이슈를 동시에 해결할 수 있었습니다.

#### CDN : script 한 줄로 어디서든 동작하는 상태 추적 스크립트

CDN(Content Delivery Network)은 전 세계 어디서든 동일한 파일을 불러올 수 있게 해주는 배포 방식입니다.
SnapBug는 상태 추적 스크립트를 CDN으로 제공해 브라우저에서 직접 실행될 수 있도록 했습니다.

```
https://snap-bug-cdn.vercel.app/stateTracker.v1.iife.js
```

이 방식의 장점은

- CDN으로 삽입된 스크립트는 React 앱과 같은 브라우저 환경에서 실행되기 때문에 브라우저 메모리 내에 존재하는 FiberNode에도 직접 접근할 수 있습니다.
- CSR 앱, iframe 등 환경에 상관없이 작동합니다.
- 별도 빌드나 설치 없이도 추적 스크립트가 바로 상태를 감지하고 서버로 전송이 가능합니다.

#### NPM : 프로젝트에 설치하여 CLI 도구로 활용

NPM(Node Package Manager)은 Node.js 프로젝트에서 외부 라이브러리를 설치할 수 있게 해주는 도구입니다.<br>
SnapBug는 NPM 패키지로도 배포되어 있습니다. CLI 환경에서 다음과 같이 프로젝트에 직접 설치할 수 있습니다:

```
npm install snapbug
```

디버깅 중 CLI 명령어로 특정 시점의 상태를 기록하고 서버로 상태 기록을 자동으로 전송, 정적 파일로 스냅샷 기록 후 배포도 가능하도록 했습니다.<br>
이처럼 브라우저에서 직접 실행되므로 CORS 문제 없이 서버와 안전하게 통신할 수 있으며 다양한 실행 환경에서 FiberNode에 안정적으로 접근하고, 상태를 시각적으로 저장 및 공유할 수 있는 구조를 위해 CDN과 NPM 병행 구조를 선택했습니다.

<br>

## 4. 명령어 하나로 디버깅 화면을 자동 배포할 수 있을까?

디버깅 과정을 가능한 간단하고 직관적으로 만들고 싶었습니다.

복잡한 설정이나 배포 과정을 몰라도 기록된 상태 데이터만 있다면 명령어 하나로 디버깅 UI를 만들고 웹에 자동 배포할 수 있도록 구현했습니다.

```
npx snapbug run
```

위 명령어를 입력하면 내부적으로 다음과 같은 과정이 자동으로 실행됩니다.

### 4.1. 상태 기록 파일을 확인합니다.

먼저 `snapbug-state.json` 이라는 파일이 존재하는지 확인합니다.

이 파일은 사용자의 React 프로젝트에서 `snapbug start`로 저장된 상태와 DOM, CSS 정보가 담긴 스냅샷 입니다.

> 이 과정에서 만약 상태를 기록한 파일이 없다면 디버깅 UI를 만들 수 없기 때문에 에러 메시지로 사용자에게 안내합니다.

### 4.2. 디버깅 UI를 빌드합니다.

상태를 기록한 파일이 준비되어 있다면 SnapBug는 내부에 포함된 디버깅 전용 클라이언트(snapbug-client)를 기반으로 UI를 자동으로 구성합니다.

- vite build를 통해 UI를 정적 사이트로 빌드합니다.
- 상태가 기록된 파일 (snapbug-state.json)을 빌드 결과물 폴더에 복사합니다.

이 과정을 통해 언제든지 해당 상태를 브라우저에서 다시 확인할 수 있는 디버깅 페이지가 만들어집니다.

### 4.3. Vercel로 자동 배포합니다.

완성된 디버깅 UI를 실제로 웹에서 볼 수 있도록 Vercel에 자동으로 배포합니다.

`npx vercel deploy --prod --yes` 명령어로 실제 배포를 진행합니다. 배포가 완료되면 Vercel에서 생성한 URL을 콘솔에 출력합니다.

```
🎉 배포 완료: https://snapbug-debug-example.vercel.app
```

이 링크를 공유하면 복잡한 설정 없이 누구나 상태가 저장된 시점의 화면을 그대로 확인할 수 있습니다.

### 4.4 링크 하나로 문제 상황을 그대로 보여줍니다.

이 모든 과정은 SnapBug CLI가 자동으로 처리됩니다. 사용자는 아래 두가지 명령어만 기억하면 됩니다.

1. React 프로젝트에 CDN을 삽입하고 `snapbug start`로 상태 추적을 시작합니다.
2. `snapbug run`을 실행해 디버깅 UI를 자동 빌드하고 배포합니다.

이 두 줄이면 복잡한 설정 없이 저장된 상태를 웹 페이지로 시각화 한 디버깅 UI를 배포 완료된 링크로 받아볼 수 있습니다.

협업 중 문제 상황을 설명할 때 "어떤 상태에서 오류가 났는지", "그 시점의 화면"이 어떤 모습이 었는지 설명하기 어렵습니다.

명령어 하나로 상태와 화면을 그대로 복원한 페이지를 링크로 공유할 수 있도록 했으며 이 기능을 통해 문제 상황을 빠르게 시각화하고 팀과 원활하게 소통할 수 있도록 하는데 집중했습니다.

# Trouble Shooting

## 1. React 내부 상태의 순환 참조로 인한 상태 전송 실패를 안전한 상태 필터링으로 해결

React 상태를 JSON으로 변환하는 과정에서 순환 참조 에러가 발생했습니다.<br>
SnapBug는 `memoizedState`를 순회하며 상태를 기록합니다. 하지만 `memoizedState`에는 React가 내부적으로 사용하는 참조 구조가 포함되어 있어
`JSON.stringify()` 과정에서 다음과 같은 에러가 발생했습니다.

```
TypeError: Converting circular structure to JSON
```

### 원인 : React 상태 구조는 내부적으로 순환 참조를 포함하고 있다.

React는 상태 업데이트와 렌더링 최적화를 위해 내부적으로 다음과 같은 값들을 memoizedState에 저장합니다.

<img src="https://i.ibb.co/LzLnzy03/image.png" alt="image" border="0">

- `queue`, `deps`, `baseQueue` : 상태 업데이트 대기열과 의존성 정보
- `_owner`, `_store`, `_source` : 컴포넌트 트리와 연결된 내부 참조
- `destroy`, `create` : useEffect에서 사용되는 클린업 및 생성 함수

이런 값들이 서로 연결되어 있어 순환 구조를 이루며 직렬화할 수 없는 DOM 객체나 함수까지 포함되어 있는 경우가 많았습니다.<br>
이로 인해 상태만 기록하려 해도 React 내부 구조까지 함께 포함되어 버리는 문제가 발생했습니다.

### 해결 : 순환 참조를 막는 안전한 상태 필터링을 하자.

#### 내부에서 사용되는 구조적 속성은 JSON 변환 대상에서 제외했습니다.

상태를 기록하기 전에 다음과 같은 요소를 가진 속성들을 필터링합니다.

```js
const invalidKeys = [
  "baseState", // 초기 상태값
  "baseQueue", // 업데이트 대기열
  "deps", // useEffect 의존성
  "destroy", // useEffect 클린업
  "create", // useEffect 생성 함수
  "_owner", // React 내부 참조
  "_store", // 컴포넌트 저장소
  "_source", // 소스 위치 정보
  "queue", // 상태 변경 큐
  "tag", // Hook 타입 구분자
];
```

이 값들 사이에는 서로를 참조하는 구조가 존재해 순환 참조가 발생하고 그 과정에서 DOM 노드나 함수처럼 JSON으로 직렬화할 수 없는 값들이 포함되어 있었습니다.
그래서 단순히 상태만 저장하려 해도 React가 내부적으로 사용하는 복잡한 정보까지 함께 들어가면서 상태를 저장하는 과정에서 오류가 발생했습니다.<br>
그래서 React 내부에서 사용하는 필요 없는 속성들은 미리 제외했습니다.<br>
그 덕분에 이제는 실제로 화면에 영향을 주는 상태 값들만 안전하게 저장할 수 있게 되었고,
저장할 때 오류 없이 그리고 나중에 비교할 때도 정확한 상태 변화만 확인할 수 있게 되었습니다.

## 2. Fiber 트리를 제대로 순회하지 않아 일부 상태가 누락되던 문제

React 상태가 일부만 수집되는 문제가 발생했습니다. 일부 컴포넌트의 상태는 정상적으로 기록되지만, 다른 컴포넌트의 상태가 누락되거나 아예 수집되지 않는 현상이 있었습니다.

### 원인 : Fiber 트리를 자식 노드만 따라가서 형제 노드는 누락됨

초기 구현에서는 다음처럼 `fiberNode.child` 만 따라 내려가는 방식으로 상태를 수집했습니다.

```js
let fiberNode = fiberRoot.child;

while (fiberNode) {
  // 상태 수집
  fiberNode = fiberNode.child; // 자식 노드만 계속 탐색
}
```

<img src="https://i.ibb.co/21yNV1Lx/fibernodetree.png" alt="fibernodetree" border="0">

이 구조는 각 컴포넌트의 첫 번째 자식만 탐색하게 됩니다. 형제 컴포넌트는 무시되기 때문에 전체 트리를 제대로 순회하지 못하고 상태 누락 문제가 발생했습니다.

### 해결 : 전체 트리를 누락 없이 순회하도록 DFS 방식으로 변경

React Fiber 트리는 실제로 트리 구조를 갖고 있으며 각 노드는 다음과 같은 관계를 가집니다.

<img src="https://i.ibb.co/DncTjRH/image.png" alt="image" border="0">

- child : 자식 노드
- sibling : 형제 노드
- return : 부모 노드

따라서 자식이 없는 경우에는 부모로 돌아가 형제 노드를 찾아야 전체 순회가 가능합니다. 아래처럼 순회 구조를 변경했습니다.

```js
// 1순위: 자식 노드가 있으면 하위로
if (fiberNode.child) {
  fiberNode = fiberNode.child;
} else {
  // 2순위: 없으면 부모로 돌아가서 형제 탐색
  while (fiberNode && !fiberNode.sibling) {
    fiberNode = fiberNode.return;
  }
  if (fiberNode) {
    fiberNode = fiberNode.sibling;
  }
}
```

### 결과 : 컴포넌트의 상태가 빠짐없이 전부 수집됨

React DevTools 역시 동일한 순회 구조를 사용하며 실제로 이 방식을 참고해 구현을 개선했습니다.<br>
이제 React 앱의 모든 컴포넌트를 빠짐없이 순회하면서 memoizedState를 기록할 수 있었습니다.

## 3. 변화가 없는데도 계속 저장된다.

SnapBug는 상태 변화와 UI 상태를 시점별로 기록합니다. 초기 구현에서는 시간 흐름에 따라 발생하는 모든 상태 변화마다 React 상태뿐 아니라 DOM과 CSS까지 함께 .json 파일에 저장하도록 설계했습니다. 이 방식은 구현이 단순하고 복원에 유리했지만 비효율적이었습니다.

### 문제: DOM이 변하지 않았는데도 매번 전체 DOM과 스타일이 저장됨

많은 경우 사용자 인터랙션이나 상태 변경이 UI 구조를 바꾸지 않음에도, SnapBug는 매 시점마다 동일한 DOM과 스타일을 중복 저장했습니다. 이렇게 되면 다음과 같은 문제가 발생합니다.

- 수백 개의 snapshot을 기록할수록 JSON 파일 크기가 빠르게 커지고, 로딩 성능에 영향을 줍니다.
- 시각적으로는 아무 변화도 없는데 렌더링할 데이터가 계속 누적되면서 클라이언트 렌더링도 느려집니다.
- 실제 UI 변화 시점을 정확히 구분하기 어려워 타임라인 시각화에도 불필요한 복잡성이 생깁니다.

이러한 문제는 단순히 상태가 바뀌었다는 이유만으로 같은 DOM을 반복 저장했기 때문에 발생했습니다.

### 해결 : DOM의 해시값을 비교해 변화가 있는 시점에만 저장하는 구조로 전환

이 문제를 해결하기 위해 DOM 문자열을 SHA-256 해시값으로 변환한 뒤 이전 시점과 비교하여 DOM이 변경되었을 때만 실제 DOM과 스타일을 저장하도록 개선했습니다.

```js
const getDOMHash = () => {
  const rootEl =
    document.querySelector("#root") || document.querySelector("#app");
  const domString = rootEl?.outerHTML || "";
  return sha256(domString); // crypto-js 사용
};
```

변경된 저장 구조는 다음과 같이 구분됩니다.

- DOM이 변경된 경우

  ```js
  {
    "timestamp": "2025-05-03T13:12:00Z",
    "state": { ... },
    "dom": "<div id=\"root\">...</div>",
    "styles": "<style>...</style>"
  }
  ```

- DOM이 변경되지 않은 경우
  ```js
  {
    "timestamp": "2025-05-03T13:12:05Z",
    "state": { ... }
  }
  ```

### 결과 : 화면에 실질적인 변화가 감지된 시점만 기록하는 구조로 최적화

SnapBug는 이 로직을 실제로 다음과 같이 구현하고 있습니다. `detectStateChange` 함수에서 상태 변경이 감지되면 DOM 문자열을 추출하고, 이를 `getDOMHash()`로 해시화한 뒤 이전 해시값과 비교합니다. <br>
만약 DOM이 변경된 경우에만 dom과 styles 값을 함께 서버로 전송합니다. 이 구조는 중복 저장을 방지하고 UI 시점 복원에 필요한 최소 정보만 기록하는 방식으로 구성되어 있습니다.

<br>

# User Experience

## 1. 상태 추적 스크립트 삽입

**SnapBug의 상태 추적 기능은 npm 설치 명령어와 CDN 스크립트 한 줄로 연동할 수 있습니다.**
`npm install snapbug` 명령어로 패키지를 설치한 뒤, 프로젝트의 최상단 `index.html` 파일에 제공된 스크립트를 추가합니다.
이후 `npm run dev`로 개발 서버를 실행하면, 브라우저에서 상태 변화와 DOM 구조 변경이 자동으로 기록됩니다.

```javascript
<script
  defer
  src="https://snap-bug-cdn.vercel.app/stateTracker.v1.iife.js"
></script>
```

<img src="https://github.com/user-attachments/assets/f0e0c09a-11f0-43b8-9f4f-f8748a84e605" width=300/>

스크립트는 React 루트 노드부터 상태와 DOM 변경을 감지하고, 기록합니다.

<br>

## 2. 상태 및 UI 변화 저장

개발자가 `npm run dev`로 개발 서버를 실행하면, 브라우저에서 발생하는 사용자 동작(예: 클릭, 입력 등)에 따라 앱의 상태와 UI가 변하게 됩니다.

<img src="https://github.com/user-attachments/assets/b9290fce-81ac-44ec-b939-1d8b119ad79a" width=300/>

변화가 발생할 때마다, 다음 정보를 자동으로 기록합니다.

- 변화된 상태(State)
- 해당 시점의 DOM 구조
- 적용된 CSS 스타일
- 저장 시각(timestamp)

SnapBug는 이 정보를 `snapbug-status.json` 파일에 순차적으로 저장하고, 이후 UI를 복원할 때 사용합니다.

<br>

## 3. 배포 및 UI 복원 화면

상태 히스토리를 브라우저에서 확인하고 공유하려면, 아래 명령어를 실행합니다.

```shell
npx snapbug run
```

<img src="https://github.com/user-attachments/assets/988e623e-d6cd-4ac1-a467-19c5cf755a56" width=300/>

이 명령어는 저장된 JSON 데이터를 기반으로 SnapBug 클라이언트 UI를 구성합니다.
UI는 상태 히스토리를 블록 단위로 시각화하고, 각 시점의 UI를 그대로 재현합니다.
명령어 실행 후 Vite로 빌드가 수행되고, Vercel에 자동으로 배포됩니다. 배포가 완료되면 URL이 터미널에 출력됩니다.

<br>

## 4. 브라우저에서 상태 히스토리 확인

배포된 URL로 접속하면, 상태 히스토리를 확인할 수 있습니다.

<img src="https://github.com/user-attachments/assets/684b555c-2def-46a0-9071-a8065d95b853" width=300/>
<img src="https://github.com/user-attachments/assets/4dd20f4e-5ba4-4ad2-9f0f-364ff3c0a3c1" width=300/>

- **좌측 타임라인 바**에서 **상태 변화 히스토리**를 **탐색**할 수 있습니다.
- <b>`Previous(이전)`</b>와 <b>`Next(다음)`</b>버튼 및 **타임라인 내 블럭**을 클릭하면 **해당 시점의 UI로 이동**합니다.
- **우측 화면에는 변화 당시** DOM과 CSS 스타일이 적용된 **UI가 재현**됩니다.

DOM과 상태값을 포함한 변화 시점의 UI를 직관적으로 확인할 수 있으며, URL을 공유해 디버깅 상황을 팀원과 쉽게 공유할 수 있습니다.

<br>

# Tech stack

## 개발 환경

| 구분                      | 사용 기술                                                                                                                                                                                                                                                                                                                  |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **개발 언어**             | ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=23F7DF1E)                                                                                                                                                                                                |
| **프레임워크/라이브러리** | ![React](https://img.shields.io/badge/React-61DAFB.svg?style=for-the-badge&logo=React&logoColor=white) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) ![Express](https://img.shields.io/badge/express-000000.svg?style=for-the-badge&logo=express&logoColor=white) |
| **스타일링**              | ![TailwindCSS](https://img.shields.io/badge/tailwindcss-61DAFB?style=for-the-badge&logo=tailwindcss&logoColor=white)                                                                                                                                                                                                       |
| **개발 도구**             | ![ESLint](https://img.shields.io/badge/ESLint-FFD93E?style=for-the-badge&logo=eslint&logoColor=white) ![Prettier](https://img.shields.io/badge/Prettier-pink?style=for-the-badge&logo=prettier&logoColor=white) ![npm](https://img.shields.io/badge/npm-red?style=for-the-badge&logo=npm&logoColor=white)                  |
| **배포 및 협업**          | ![Vercel](https://img.shields.io/badge/vercel-f0f0f0?style=for-the-badge&logo=vercel&logoColor=black) ![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)     |

## 1. 프론트엔드 - React + Vite

SnapBug의 핵심은 버튼 클릭 시점마다 상태를 기록하고 UI를 스냅샷처럼 보여주는 구조이기에 CSR(Client Side Rendering) 기반의 빠른 렌더링이 중요했습니다.

- Vite는 변경된 모듈만 빠르게 교체해 빠른 개발 경험 제공
- React 상태 기록과 CSR에 최적화

## 2. CLI - commander.js

SnapBug는 `snapbug start`, `snapbug end` 등의 CLI 명령어를 통해 상태 기록을 자동화합니다. 이 도구를 만들기 위해 간결한 구문과 학습 난이도가 낮은 CLI 프레임워크가 필요했습니다.

- Yargs, Caporal과 비교해도 사용법이 간단하고 커뮤니티가 활발
- 작은 프로젝트에서 빠르게 CLI 명령어 구성 가능

## 3. 브라우저 접근 - CDN

초기에는 React 상태를 추적하기 위해 Puppeteer를 사용했습니다. 그러나 다음과 같은 한계를 겪었습니다.

- FiberNode는 브라우저 메모리에만 존재해 Puppeteer로 접근 불가
- CSR 앱의 렌더링 타이밍을 정확히 맞추기 어려움
- CORS 문제로 상태 전송 실패

브라우저 내부에서 직접 실행되는 CDN 스크립트를 삽입해 FiberNode에 접근하고, API 서버로 상태를 직접 전송할 수 있도록 구조를 변경했습니다.

## 4. 배포 - Vercel

SnapBug는 사용자가 기록한 상태 스냅샷을 웹에서 바로 확인하고 공유할 수 있는 경험을 제공해야 했습니다. 이를 위해 배포 도구 선택 시 다음 기준을 우선적으로 고려했습니다.

- 고유한 Preview URL 생성 가능 여부
- 배포 속도
- 간편한 배포 삭제

Vercel은 배포 시마다 고유 Preview URL을 제공해 상태 공유가 간편했습니다. 또한
인천에 Gateway가 위치해 있어 국내 배포 속도가 빠릅니다.
CLI를 통한 자동 배포 및 삭제가 간편하게 가능했습니다.
Netlify, AWS Amplify도 고려했지만, 속도 및 자동화 측면에서 Vercel이 가장 적합하다고 판단했습니다.

<br>

# Workflow

SnapBug 프로젝트는 기능을 구현하는 것에 그치지 않고, 처음부터 협업 방식까지 함께 정리하며 일정한 규칙을 기반으로 개발을 시작했습니다.

Git 브랜치 전략, 코드 리뷰 방식, 커밋 메시지에 대한 기준을 정하고, 모든 작업은 이슈 기반으로 관리하며 팀 전체가 같은 방식으로 소통하고자 했습니다.

## Git 브랜치 전략

SnapBug는 **Git Flow 전략**을 기반으로 다음과 같은 브랜치 정책을 사용했습니다.

- `main`: 프로덕션 배포용
- `dev`: 개발 병합용
- `feature/*`: 기능 단위 작업 브랜치

**브랜치 병합 방식**은 다음과 같습니다.

- `main <- dev`: `rebase-merge`
- `dev <- feature/*`: `squash-merge`

> 브랜치명은 기능을 직관적으로 나타내기 위해 케밥 케이스(kebab-case)를 사용했습니다.

## 코드 작성 & 리뷰 방식

### PR & 이슈 기반 협업 사이클

모든 작업은 다음 순서로 진행했습니다.

1. `dev` 브랜치 최신화 (`git pull origin dev`)
2. `feature/기능명` 브랜치 생성 후 작업
3. 완료된 작업은 **연결된 이슈와 함께 PR**로 등록
4. 팀원에게 **코드 리뷰 요청**
5. 리뷰어는 **1시간 이내 피드백 제공**
6. 리뷰 승인 후, 작성자가 `squash-merge` 수행

### PR 템플릿 기반 커뮤니케이션

PR에는 다음 내용을 포함해 변경 사항을 명확히 공유했습니다:

- 연결된 이슈 번호
- 작업 내용 요약
- 스크린샷 (UI 관련 변경 시)
- 리뷰 포인트 및 참고사항

### 코드 리뷰 가이드라인

- 리뷰할 내용이 없는 경우에도 구현 의도나 맥락에 대한 확인을 남김
- 리팩토링이나 개선이 필요한 경우, **구체적인 근거와 함께 제안**
- 리뷰는 단순 승인보다 기능 완성도와 코드 품질 향상에 초점

### 기본 구조

```
type: 한글 제목 (마침표 없이)

본문 (선택, 72자 이하)

footer (선택, 이슈 번호)
```

### 커밋 타입

| 타입       | 설명                              |
| ---------- | --------------------------------- |
| `feat`     | 기능 추가                         |
| `fix`      | 버그 수정                         |
| `docs`     | 문서 수정                         |
| `style`    | 포맷팅, 세미콜론 등 비기능적 변경 |
| `refactor` | 코드 리팩토링 (기능 변경 없음)    |
| `design`   | 사용자 UI 관련 변경               |
| `test`     | 테스트 코드 추가 또는 수정        |
| `chore`    | 설정, 빌드 관련 작업              |

## 작업 방식

### 깃허브 칸반 보드

본 프로젝트는 **GitHub Projects의 칸반 보드를 활용**해 작업을 관리했습니다.
`To Do`, `In Progress`, `Done`의 단계를 구분하여 시각적으로 구성했고, 라벨과 마일스톤을 통해 우선순위와 기한을 명확하게 설정했습니다. 매일 오전 회의에서 보드 상태를 확인했습니다.

우선순위는 아래와 같이 `P0`, `P1`, `P2` 라벨을 사용해 구분했습니다.

- **P0** : 즉시 해결이 필요한 핵심 작업
- **P1** : 일정 내 처리해야 할 주요 작업
- **P2** : 낮은 우선순위로 개선 작업이나 리팩토링 작업

모든 작업에는 담당자와 예상 완료일을 명시하여, 책임감 있는 업무 진행이 가능하도록했습니다.

### 기록으로 소통의 공백을 채우다

> 결정의 이유와 작업 히스토리를 기록하기 위해 회의록을 작성하였습니다.

초기에는 모든 팀원이 같은 공간에서 장시간 함께 작업하며, 구현과 회의를 병행했습니다. 의사소통은 자연스럽게 이루어졌고, 충분히 공유되고 있다고 생각했습니다. 시간이 지날수록 논의 내용을 다르게 기억하거나, 결정의 배경을 명확히 설명하기 어려운 상황이 생겼습니다. 작업을 이어받아야 할 경우 앞선 작업의 맥락이나 구현 의도를 정확히 파악하지 못하면, 불필요한 수정이 발생했습니다.

회의 내용을 정리해두면 누구든 바로 다음 작업을 이어받을 수 있고, 예상치 못한 문제가 발생했을 때도 의사결정의 맥락을 빠르게 추적할 수 있습니다. 이러한 경험을 통해, 대화만으로는 협업의 연속성을 보장하기 어렵다는 점을 인식하게 되었습니다.

이에 따라 모든 회의 내용을 Notion에 회의록으로 기록하기 시작했습니다. [🔗 회의록 링크](https://omniscient-robe-af6.notion.site/1ab55d59f1a7805c960cc6691921dee1?v=1ab55d59f1a78198b475000c1d5c1618&pvs=4)

<img width="947" alt="스냅버그_회의록" src="https://github.com/user-attachments/assets/f41673e7-f9a7-45ec-a136-6a5171de3488" />

- 각 회의록에는 날짜, 논의 주제, 결정 사항, 후속 작업을 항목별로 정리했습니다.
- 구조 변경과 같이 장기적인 영향을 미치는 내용은 회의록 및 별도의 문서로 기록해, 문서와 실제 코드가 일치하도록 관리했습니다.

# Retrospective

### 정도원

이번 프로젝트에서 가장 인상 깊었던 점은 같은 걸 듣고 보고도 다르게 이해할 수 있다는 사실이었습니다.<br>
작업을 진행하면서 서로가 알고 있는 내용을 공유하고 맞춰나가는 과정에서 당연하다고 여겼던 개념이나 흐름이 팀원마다 다르게 받아들여졌던 경우가 적지 않았습니다.
특히 내가 이해한 내용이 팀원이 말한 의도와 정확히 일치하는지, 혹은 팀원이 이해한 방식이 내가 말하려던 본질과 맞는지 확인하는 과정에서 싱크를 맞추는 어려움을 느꼈습니다.

하지만 그만큼 서로에 대한 이해를 넓힐 수 있었고 무엇보다도 팀원 각자의 강점과 성향을 잘 알고 있었기 때문에 자연스럽게 역할을 분배하고 협업이 수월하게 이뤄졌던 점이 좋았습니다.<br>
서로의 강점과 약점을 파악하고 그에 맞게 맡은 일을 책임감 있게 수행한 덕분에 프로젝트를 끝까지 잘 마무리할 수 있었고 함께해서 더 나은 결과를 만들 수 있었던 의미 있는 시간이었던 것 같습니다.<br>
이번 협업을 통해 커뮤니케이션의 중요성과 협업의 본질을 다시금 느낄 수 있었던 좋은 경험이었습니다.

### 이세경

이번 프로젝트는 이전에 디버깅 과정에서 겪었던 불편함을 기능으로 직접 해결해보는 경험이었습니다.<br>

협업 과정에서 팀원과 다른 관점을 맞춰나가는 과정도 즐거웠습니다. 저는 전체 흐름과 키워드의 맥락을 중시했고, 팀원은 빠르게 키워드를 조합하는 방식이었습니다.
서로의 스타일을 이해하고 조율해 나가는 과정은 협업을 더 풍부하게 만들어주었습니다.
단어 하나에도 상대의 배경과 의도를 이해하려고 노력해보면서, 유연하게 소통하는 법을 배울 수 있었습니다. 다름을 좁혀나가는 과정이 즐거웠습니다.<br>

또한 CLI부터 CDN 삽입, 자동 배포까지 전체 흐름을 직접 설계하며, 사용자가 자연스럽게 사용할 수 있는 과정을 고민해볼 수 있었습니다. 사용자가 어떤 흐름에서 불편함을 느낄지 상상해보고, 기능을 설계할 때 사용자 경험을 함께 고려하는 일이 얼마나 중요한지 경험할 수 있었습니다.

지금은 상태 변화 기준으로 히스토리를 공유하고 있습니다. 앞으로는 React 에러 바운더리와 함께 연동하도록 추가하여, 오류가 발생한 시점도 함께 공유할 수 있도록 확장해보고 싶습니다.
