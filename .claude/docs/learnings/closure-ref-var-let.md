# Closure, useRef, var vs let

---

## Closure

Function that **closes over** (seals) variables from its surrounding scope. Keeps them alive even after outer function ends.

> "Close a function but keep something from it."

```ts
function makeGreeting(name) {
  // name sealed inside returned function
  return function() {
    console.log("Hello " + name)
  }
}

const greet = makeGreeting("Phuc")
// makeGreeting finished — name should be gone
greet()  // "Hello Phuc" — still remembered ✅
```

JS keeps variable alive as long as something references it. Unreferenced variable → garbage collected.

---

## var vs let scope

```
var   = function-scoped — one variable for entire function
let   = block-scoped   — one variable per block {}
```

```ts
// var — one shared variable
for (var i = 0; i < 4; i++) {
  setTimeout(() => console.log(i), 100)
}
// loop ends → i = 4 (condition i<4 fails when i=4)
// all closures share same i → all print 4
// prints: 4, 4, 4, 4

// let — new variable per iteration
for (let i = 0; i < 4; i++) {
  setTimeout(() => console.log(i), 100)
}
// each iteration gets own i → each closure seals own value
// prints: 0, 1, 2, 3
```

**Key:** loop ends when condition FAILS — `i < 4` fails at `i = 4`, not `i = 3`. So var prints 4, not 3.

---

## Stale closure

React renders = **snapshots**. Each render creates new variables. Old closures hold old snapshots.

```
let/var mutated     → closure sees new value (same variable in memory)
useState updated    → closure frozen (new render = new variable, old closure untouched)
```

```ts
// let — closure reads latest (same variable mutated)
let name = "Phuc"
setTimeout(() => console.log(name), 1000)
name = "Nam"
// prints: "Nam" ✅ — same variable, updated in place

// useState — closure frozen at render time
function Component() {
  const [name, setName] = useState("Phuc")

  useEffect(() => {
    setTimeout(() => console.log(name), 1000)  // seals "Phuc" at mount
    setName("Nam")  // new render, new variable — old closure untouched
  }, [])
}
// prints: "Phuc" — old snapshot frozen forever
```

---

## Stale closure in useEffect

```ts
function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1)  // count sealed = 0 at mount
      // always 0 + 1 = 1, never increments past 1
    }, 1000)
    return () => clearInterval(interval)
  }, [])  // empty deps = closure never refreshed
}
```

**Fix 1** — functional update (no closure needed):
```ts
setCount(prev => prev + 1)  // prev = current value from React, bypasses closure
```

**Fix 2** — add to deps (refresh closure):
```ts
}, [count])  // re-creates interval every time count changes
```

---

## Stale closure with async

```ts
function Component() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setTimeout(() => {
      setCount(count + 1)  // count sealed at click time
    }, 1000)
  }
}
// Click 5 times fast → all closures seal count=0 → all set count to 1
// Fix: setCount(prev => prev + 1)
```

---

## useRef

Mutable box that lives **outside render cycle**. Change `.current` = no re-render.

```
useState    change → re-render → new snapshot
useRef      change → NO re-render → same box, value updated in place
```

```ts
const countRef = useRef(0)
countRef.current = 99  // silent update, no re-render
```

**Use case 1 — DOM access:**
```ts
const inputRef = useRef(null)
// after mount: inputRef.current = actual <input> DOM node
inputRef.current.focus()
```

**Use case 2 — store value without re-render:**
```ts
const timerRef = useRef(null)
timerRef.current = setInterval(...)  // store ID, no re-render
clearInterval(timerRef.current)      // always has latest ID
```

**Use case 3 — bypass stale closure:**
```ts
function Component() {
  const [count, setCount] = useState(0)
  const countRef = useRef(count)

  useEffect(() => {
    countRef.current = count  // sync ref after every count change
  }, [count])

  function handleClick() {
    setCount(prev => prev + 1)
    setTimeout(() => {
      console.log(countRef.current)  // reads box directly — always latest
    }, 1000)
  }
}
// Click 3 times fast → count=3 → ref=3 → all timeouts print 3
```

**Without sync effect — ref stays stale:**
```ts
const countRef = useRef(count)  // initialized once = 0, never updated
// countRef.current always = 0 unless you add useEffect to sync it
```

---

## Mental models

```
Closure     = photo taken at render time. Old closures hold old photos.
var         = one whiteboard shared by all. Erased and rewritten each iteration.
let         = new whiteboard per block. Each iteration gets own copy.
useRef      = sticky note. Always readable, always latest. React ignores it.
useState    = whiteboard React watches. Change = re-render = new photo.
```

---

## Quick reference — what prints?

| Code | Prints |
|---|---|
| `for (var i=0; i<4; i++) setTimeout(()=>console.log(i), 100)` | 4,4,4,4 |
| `for (let i=0; i<4; i++) setTimeout(()=>console.log(i), 100)` | 0,1,2,3 |
| `useState` + empty deps + setState before timeout | old value (stale closure) |
| `useRef` + sync effect + setTimeout | latest value (bypasses closure) |
| `setCount(prev => prev + 1)` | always correct, no closure needed |

---

## Practice questions (test yourself)

**Q: var loop, 3 iterations, what prints?**
```ts
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100)
}
```
Answer: 3,3,3

**Q: useState, setName before timeout fires, what prints?**
```ts
const [name, setName] = useState("Phuc")
useEffect(() => {
  setTimeout(() => console.log(name), 1000)
  setName("Nam")
}, [])
```
Answer: "Phuc" (stale closure)

**Q: useRef synced, setName before timeout fires, what prints?**
```ts
const [name, setName] = useState("Phuc")
const nameRef = useRef(name)
useEffect(() => { nameRef.current = name }, [name])
useEffect(() => {
  setName("Nam")
  setTimeout(() => console.log(nameRef.current), 1000)
}, [])
```
Answer: "Nam" (ref bypasses closure)

**Q: click 5 times fast, stale closure, what is count?**
```ts
function handleClick() {
  setTimeout(() => setCount(count + 1), 1000)
}
```
Answer: 1 (all closures sealed count=0, all set to 1)

**Q: click 5 times fast, functional update, what is count?**
```ts
function handleClick() {
  setTimeout(() => setCount(prev => prev + 1), 1000)
}
```
Answer: 5 (each prev reads current value)
