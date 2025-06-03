---
theme: seriph
background: https://cover.sli.dev
title: 怀孕指南
class: text-center
drawings:
  persist: false
transition: slide-left
---

# 怀孕指南

MiyueFE

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <button @click="$slidev.nav.openInEditor()" title="Open in Editor" class="slidev-icon-btn">
    <carbon:edit />
  </button>
  <a href="https://github.com/miyuesc/MomAndBabyForChina" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

---
src: ./pages/00-待产证件资料.md
hide: false
---

---
src: ./pages/01-妈妈待产&住院包.md
hide: false
---


---
src: ./pages/02-宝宝待产&住院包.md
hide: false
---


---
src: ./pages/03-妈妈月子&哺乳期.md
hide: false
---


---
src: ./pages/04-宝宝居家成长指南.md
hide: false
---


---
src: ./pages/10-宝宝注意事项.md
hide: false
---

---
src: ./pages/11-安全座椅.md
hide: false
---

---
src: ./pages/12-资料.md
hide: false
---
