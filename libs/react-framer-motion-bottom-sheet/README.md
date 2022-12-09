# React Framer Motion Bottom Sheet

## Why go custom?

Because every library is missing something we need.

I have tried:

- [react-spring-bottom-sheet](https://github.com/stipsan/react-spring-bottom-sheet) built on top of `react-spring` which is not compatible with `react@^18`. It also has weird event handling for our purposes. Tailwind styling is also pain.
- [bottom-sheet-react](https://github.com/nibdo/bottom-sheet-react) doesn't implement snap points. It is either open or closed.
- [react-modal-sheet](https://github.com/Temzasse/react-modal-sheet) built on top of `framer-motion` which we use and love, but it has bad scrolling capabilities which is something we require for long feature details.

Other great libraries are commonly available only for `react-native` applications.

## About

It is simple component library for bottom sheet modals. It is also built on top of `framer-motion`.

## Features

- Snap points
- Smooth opening and closing
- Smooth transition from snapping to scrolling.
- Headless

There is so much features it doesn't provide, but there was no time nor capacity to implement something we don't need.

## Accessibility

TODO :)
