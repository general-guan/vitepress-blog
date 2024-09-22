# TypeScript

## 安装 TypeScript

安装

```bash
npm install -g typescript
```

验证是否安装成功

```bash
tsc -v
```

生成 tsconfig.json 配置文件

```bash
tsc --init
```

编译文件

```bash
tsc helloWorld.ts
```

## 安装 ts-node

那么通过我们上面的一通操作，我们知道了运行 `tsc` 命令就可以编译生成一个 `js` 文件，但是如果每次改动我们都要手动去执行编译，然后再通过 `node` 命令才能查看运行结果岂不是太麻烦了

而 `ts-node` 正是来解决这个问题的

```bash
npm i -g ts-node # 全局安装 ts-node
```

有了这个插件，我们就可以直接运行 .ts 文件了

```bash
ts-node helloWorld.ts
```

## TypeScript 的基础类型

### string

```typescript
let str: string = "1234";
```

### number

```typescript
let num: number = 1234;
```

### boolean

```typescript
let boo: boolean = true;
```

### enum

```typescript
enum Color {
  Red = 1,
  Green = 2,
  Blue = 4,
}
let c: Color = Color.Green; // 2
```

常量枚举

使用 `const` 关键字修饰的枚举，整个枚举会在编译阶段被删除

```typescript
const enum Color {
  RED,
  PINK,
  BLUE,
}
```

> 默认情况下，从 `0` 开始为元素编号，你也可以手动的指定成员的数值，例如，我们将上面的例子改成从 `1` 开始编号，如果后面成员没设置编号，自动从你上一个设置的编号开始排序

### array

数组有两种方式，第一种：

```typescript
let list1: number[] = [1, 2, 3];
```

第二种：数组泛型

```typescript
let list2: Array<number> = [1, 2, 3];
```

### tuple

```typescript
let x: [string, number] = ["hello", 10];
```

### any

```typescript
let notSure: any = 4;
```

### void

```typescript
const log = (): void => {
  console.log(123);
};
```

### null 和 undefined

```typescript
let u: undefined = undefined;
let n: null = null;
```

> 默认情况下 `null` 和 `undefined` 是所有类型的子类型，就是说你可以把 `null` 和 `undefined` 赋值给 `number` 类型的变量  
> 然而，当你指定了`--strictNullChecks` 标记，`null` 和 `undefined` 只能赋值给它们各自，这能避免很多常见的问题

### never

是指没法正常结束返回的类型，一个必定会报错或者死循环的函数会返回这样的类型

```typescript
function foo(): never {
  throw new Error("error message");
} // throw error 返回值是 never

function foo(): never {
  while (true) {}
} // 这个死循环的也会无法正常退出
```

还有就是永远没有相交的类型：

```typescript
type human = "boy" & "girl"; // 这两个单独的字符串类型并不可能相交，故 human 为 never 类型
```

关于 `never` 类型，其实有很多人会疑惑，`never` 类型表示一个没有可能的值，既然没有可能，那么为什么会有这么一个类型，在知乎上，有尤大大这么一串回答，其实挺有意思的，下面是尤大大原话：

举个具体点的例子，当你有一个联合类型：

```typescript
interface Foo {
  type: "foo";
}

interface Bar {
  type: "bar";
}

type All = Foo | Bar;
```

在 `switch` 当中判断 `type`，TS 是可以收窄类型的：

```typescript
function handleValue(val: All) {
  switch (val.type) {
    case "foo":
      // 这里 val 被收窄为 Foo
      break;
    case "bar":
      // val 在这里是 Bar
      break;
    default:
      // val 在这里是 never
      const exhaustiveCheck: never = val;
      break;
  }
}
```

注意在 `default` 里面我们把被收窄为 `never` 的 `val` 赋值给一个显式声明为 `never` 的变量，如果一切逻辑正确，那么这里应该能够编译通过，但是假如后来有一天你的同事改了 All 的类型：

```typescript
type All = Foo | Bar | Baz;
```

然而他忘记了在 `handleValue` 里面加上针对 `Baz` 的处理逻辑，这个时候在 `default` 里面 `val` 会被收窄为 `Baz`，导致无法赋值给 `never`，产生一个编译错误，所以通过这个办法，你可以确保 `handleValue` 总是穷尽了所有 All 的可能类型

### unkonwn

`unknown` 的作用跟 `any` 类似，你可以把它转化成任何类型，不同的地方是，在静态编译的时候，`unknown` 不能调用任何方法，而 `any` 可以

```typescript
const foo: unknown = "string";
foo.substr(1); // Error: 静态检查不通过报错
const bar: any = 10;
any.substr(1); // Pass: any类型相当于放弃了静态检查
```

## 类型别名

### type

定义类型名的时候，一般采用大驼峰写法，能很好的区分变量名和类型名

```typescript
type Obj = {
  a: boolean;
  b: number;
};

const obj: Obj = {
  a: true,
  b: 1,
};
```

### interface

`interface` 接口是专门给对象定义类型

```typescript
interface Obj {
  a: true;
  b: boolean;
}

const obj: Obj = {
  a: true,
  b: false,
};
```

`interface` 比 `type` 具有专门的针对性，扩展了 `extends` 继承关键字，可以继承类型，例如：

```typescript
interface Obj {
  a: true;
  b: boolean;
}

interface Obj1 extends Obj {
  c: string;
  d: "我是小明";
}

const obj: Obj1 = {
  a: true,
  b: false,
  c: "sss",
  d: "我是小明",
};
```

除了描述带有属性的普通对象外，接口也可以描述函数类型

为了使用接口表示函数类型，我们需要给接口定义一个调用签名，它就像是一个只有参数列表和返回值类型的函数定义，参数列表里的每个参数都需要名字和类型

```typescript
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function (source: string, subString: string) {
  let result = source.search(subString);
  return result > -1;
};
```

## 对象类型

### object、Object、{}

`object` 类型用于表示所有的非原始类型

```typescript
let object: object;
object = 1; // 报错
object = "a"; // 报错
object = true; // 报错
object = null; // 报错
object = undefined; // 报错
object = {}; // 编译正确
```

`Object` 代表所有拥有 `toString`、`hasOwnProperty` 方法的类型，所以所有原始类型、非原始类型都可以赋给 `Object`（`null` 和 `undefined` 不可以）

```typescript
let bigObject: Object;
object = 1; // 编译正确
object = "a"; // 编译正确
object = true; // 编译正确
object = null; // 报错
ObjectCase = undefined; // 报错
ObjectCase = {}; // ok
```

`{}` 同 `Object`

### class

```typescript
class Person {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  say(): void {
    alert("nihao" + this.name);
  }
}
```

同样也可以使用 `extends` 关键字实现继承

```typescript
class Person {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  say(): void {
    console.log("nihao" + this.name);
  }
}

class Student extends Person {
  school: string;
  constructor(name: string, age: number, school: string) {
    super(name, age);
    this.school = school;
  }
  say1(): void {
    alert("nihao");
  }
}

const student = new Student("xiaoming", 18, "大河小学"); // {name: 'xiaoming', age: 18, school: '大河小学'}
student.say();
```

## 函数

### 函数声明

```typescript
function fn(x: number, y: number): number {
  return x + y;
}
```

### 函数表达式

```typescript
const fn = (x: string, y: string): string => {
  return x + y;
};
```

### 重载

JavaScript 本身是个动态语言，JavaScript 里函数根据传入不同的参数而返回不同类型的数据是很常见的，如果一个函数，我们想传入 `string`，有的时候又传入 `number`，那该怎么定义呢，我们就可以定义多个函数类型

```typescript
function add(x: number, y: number): number;
function add(x: string, y: string): string;
function add(x, y) {
  return x + y;
}

const res = add("1", "2"); // res1 类型为 string
const res1 = add(1, 2); // res1 类型为 number
const res2 = add("1", 2); // false 没有与此调用匹配的重载
```

注意上面定义的三个 `add` 其中两个都是函数类型，并不是函数声明，最终执行的是最下面这个函数声明，函数声明只能有一个，然而函数类型可以多个同名

为了让编译器能够选择正确的检查类型，它与 JavaScript 里的处理流程相似，它查找重载列表，尝试使用第一个重载定义，如果匹配的话就使用这个，因此，在定义重载的时候，一定要把最精确的定义放在最前面

## 交叉类型

```typescript
type Person = {
  name: string;
  age: number;
};

type Stu = {
  scroll: string;
};

type Student = Person & Stu;

const student: Student = {
  name: "123",
  age: 16,
  scroll: "大河",
};
```

一般都是对象类型的才有交叉类型，像字面量类型的联合，就直接变成 `never` 类型了，因为不可能存在

```typescript
type A = "boy" & "girl"; // A 的类型为 never
```

## 联合类型

```typescript
const fns = (x: string | number) => {
  return x;
};
```

## 类型断言

尖括号写法

```typescript
let str: any = "to be or not to be";
let strLength: number = (<string>str).length;
```

`as` 写法

```typescript
let str: any = "to be or not to be";
let strLength: number = (str as string).length;
```

## 非空断言

```typescript
function onClick(callback?: () => void) {
  callback!(); // 参数是可选入参，加了这个感叹号 ! 之后，TS 编译不报错
}
```

## ts 操作符

### 键值获取 keyof

`keyof` 可以获取一个类型所有键值，返回一个联合类型，如下：

```typescript
type Person = {
  name: string;
  age: number;
};

type PersonKey = keyof Person; // PersonKey 得到的类型为 'name' | 'age'
```

`keyof` 的一个典型用途是限制访问对象的 `key` 合法化，因为 `any` 做索引是不被接受的，`keyof` 经常搭配 `in` 来使用，后面会讲

```typescript
function getValue(p: Person, k: keyof Person) {
  return p[k]; // 如果 k 不如此定义，则无法以 p[k] 的代码格式通过编译
}
```

总结起来 `keyof` 的语法格式如下

```latex
类型 = keyof 类型
```

### 实例类型获取 typeof

我们可以根据已有的数据，通过 `typeof`，去获取它的类型

```typescript
const person = {
  name: "xiaomign",
  age: 15,
};

type Person = typeof person; // Person 类型为 { name: string; age: number }
```

`typeof` 还可以搭配 `keyof` 使用，例如

```typescript
const person = {
  name: "xiaomign",
  age: 15,
};

type Person = typeof person; // Person 类型为 { name: string; age: number }
type Personkey = keyof typeof person; // Person 类型为 'name' | 'age'
```

总结起来 `typeof` 的语法格式如下

```latex
类型 = typeof 实例
```

### 遍历属性 in

`in` 只能用在类型的定义中，可以对枚举类型进行遍历，如下：

```typescript
// 这个类型可以将任何类型的键值转化成 number 类型
type TypeToNumber<T> = {
  [key in keyof T]: number;
};

const obj: TypeToNumber<Person> = { name: 10, age: 10 };
```

## 泛型

### 基本使用

```typescript
function identity<T>(arg: T): T {
  return arg;
}
```

### 泛型推导与默认值

泛型推导

```typescript
type Dog<T> = { name: string; type: T };

function adopt<T>(dog: Dog<T>) {
  return dog;
}

const dog = { name: "ww", type: "hsq" }; // 这里按照 Dog 类型的定义一个 type 为 string 的对象
adopt(dog); // Pass: 函数会根据入参类型推断出 type 为 string
```

默认值

```typescript
type Dog<T = any> = { name: string; type: T };
const dog: Dog = { name: "ww", type: "hsq" };
dog.type = 123; // 不过这样 type 类型就是 any 了，无法自动推导出来，失去了泛型的意义
```

### 泛型函数

泛型函数的类型与非泛型函数的类型没什么不同，只是有一个类型参数在最前面，像函数声明一样

```typescript
function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: <T>(arg: T) => T = identity;
```

也可以使用不同的泛型参数名，只要在数量上和使用方式上能对应上就可以

```typescript
function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: <U>(arg: U) => U = identity;
```

这引导我们去写第一个泛型接口了

```typescript
interface GenericIdentityFn {
  <T>(arg: T): T;
}

function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: GenericIdentityFn = identity;
```

### 泛型约束

有的时候，我们想要约束泛型，如何能办到这事，就需要 `extends` 关键字，这里的 `extends` 并不代表继承，在这里反而是约束了泛型的类型

我们有时候想操作某类型的一组值，并且我们知道这组值具有什么样的属性，在 `loggingIdentity` 例子中，我们想访问 `arg` 的 `length` 属性，但是编译器并不能证明每种类型都有 `length` 属性，所以就报错了

```typescript
function loggingIdentity<T>(arg: T): T {
  console.log(arg.length); // Error: T doesn't have .length
  return arg;
}
```

为此，我们定义一个接口来描述约束条件，创建一个包含 `.length` 属性的接口，使用这个接口和 `extends` 关键字来实现约束：

```typescript
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // Now we know it has a .length property, so no more error
  return arg;
}
```

现在这个泛型函数被定义了约束，因此它不再是适用于任意类型：

```typescript
loggingIdentity(3); // Error, number doesn't have a .length property
```

我们需要传入符合约束类型的值，必须包含必须的属性：

```typescript
loggingIdentity({ length: 10, value: 3 });
```

### 泛型条件

```typescript
T extends U? X: Y
```

如果 `T` 是 `U` 子类型，则将 `T` 定义为 `X` 类型，否则定义为 `Y` 类型，这块要搭配下面泛型推断一起来学

### 泛型推断 infer

`infer` 的中文是“推断”的意思，一般是搭配上面的泛型条件语句使用的，所谓推断，就是你不用预先指定在泛型列表中，在运行时会自动判断，不过你得先预定义好整体的结构，举个例子：

```typescript
type Foo<T> = T extends { t: infer Test } ? Test : string;
```

首先看 `extends` 后面的内容，`{t: infer Test}` 可以看成是一个包含 `t` 属性的类型定义，这个 `t` 属性的 `value` 类型通过 `infer` 进行推断后会赋值给 `Test` 类型，如果泛型实际参数符合 `{t: infer Test}` 的定义那么返回的就是 `Test` 类型，否则默认给缺省的 `string` 类型

举个例子加深下理解：

```typescript
type One = Foo<number>; // string，因为 number 不是一个包含 t 的对象类型
type Two = Foo<{ t: boolean }>; // boolean，因为泛型参数匹配上了，使用了 infer 对应的 type
type Three = Foo<{ a: number; t: () => void }>; // () => void，泛型定义是参数的子集，同样适配
```

## 泛型工具

### Required

将类型的属性变成必选

```typescript
type Required<T> = {
  [Key in keyof T]-?: T[Key];
};

interface Person {
  name?: string;
  age?: number;
  hobby?: string[];
}
const user: Required<Person> = {
  name: "树哥",
  age: 18,
  hobby: ["code"],
};
```

在这里 `-?` 是一个非常有意思的写法，相当于把可选去掉

### Partial

与 `Required` 相反，将所有属性转换为可选属性

```typescript
type Partial<T> = {
  [K in keyof T]?: T[K];
};

interface Person {
  name: string;
  age: number;
  hobby: string[];
}
const user: Partial<Person> = {
  name: "树哥",
  age: 18,
}; // 编译正确
```

### Exclude

`Exclude<T, U>` 的作用是将某个类型中属于另一个的类型移除掉，剩余的属性构成新的类型

此工具是在 `T` 类型中，去除 `T` 类型和 `U` 类型的交集，返回剩余的部分

```typescript
type Exclude<T, U> = T extends U ? never : T;

const user: Exclude<"a" | "b" | "c", "a" | "b"> = "c"; //true
```

### Extract

和 `Exclude` 相反，`Extract<T,U>` 从 `T` 中提取出 `U`

```typescript
type Extract<T, U> = T extends U ? T : never;

const user: Extract<"a" | "b" | "c", "a" | "b" | "f"> = "a"; // true
```

### Readonly

把数组或对象的所有属性值转换为只读的，这就意味着这些属性不能被重新赋值

```typescript
type Readonly<T> = {
  readonly [Key in keyof T]: T[Key];
};

interface Person {
  name?: string;
  age?: number;
  hobby?: string[];
}
const user: Readonly<Person> = {
  name: "树哥",
  age: 18,
  hobby: ["code"],
};
user.age = 12; // false, 因为它是只读属性
```

### Record

`Record<K extends keyof any, T>` 的作用是将 `K` 中所有的属性的值转化为 `T` 类型

```typescript
type Record<T extends keyof any, U> = {
  [Key in T]: U;
};

type Pe = "key1" | "key2";
const user: Record<Pe, string> = {
  key1: "树哥",
  key2: "334",
}; // true 所有类型都被转位 string 类型
```

### Pick

从某个类型中挑出一些属性出来

```typescript
type Pick<T, U extends keyof T> = {
  [Key in U]: T[U];
};

interface Person {
  name: string;
  age: number;
  hobby: string[];
}
const user: Pick<Person, "age" | "hobby"> = {
  age: 4,
  hobby: ["1"],
}; // true
```

### Omit

与 `Pick` 相反，`Omit<T,K>` 从 `T` 中取出除去 `K` 的其他所有属性

```typescript
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

interface Person {
  name: string;
  age: number;
  gender: string;
}
type P1 = Omit<Person, "age" | "gender">;
const user: P1 = {
  name: "树哥",
};
```

### NonNullable

去除类型中的 `null` 和 `undefined`

```typescript
type NonNullable<T> = T extends keyof null | undefined ? never : T;

type P1 = NonNullable<string | number | undefined>; // string | number
type P2 = NonNullable<string[] | null | undefined>; // string[]
type P3 = NonNullable<string[] | number[] | { a: string } | undefined>; // string[] | number[] | {a: string}
```

### ReturnType

用来得到一个函数的返回值类型

```typescript
type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;

type Func2 = (value: string) => string;
type off = ReturnType<Func2>; // string;
const test: ReturnType<Func2> = "23"; // true
```

### Parameters

用于获得函数的参数类型所组成的元组类型

```typescript
type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;

type P1 = Parameters<(a: number, b: string) => string>; // [number, string]
```

## tsconfig.json

```json
{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig.json to read more about this file */

    /* Projects */
    // "incremental": true,                              /* Enable incremental compilation */
    // "composite": true,                                /* Enable constraints that allow a TypeScript project to be used with project references. */
    // "tsBuildInfoFile": "./",                          /* Specify the folder for .tsbuildinfo incremental compilation files. */
    // "disableSourceOfProjectReferenceRedirect": true,  /* Disable preferring source files instead of declaration files when referencing composite projects */
    // "disableSolutionSearching": true,                 /* Opt a project out of multi-project reference checking when editing. */
    // "disableReferencedProjectLoad": true,             /* Reduce the number of projects loaded automatically by TypeScript. */

    /* Language and Environment */
    "target": "es2016" /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */,
    // "lib": [],                                        /* Specify a set of bundled library declaration files that describe the target runtime environment. */
    // "jsx": "preserve",                                /* Specify what JSX code is generated. */
    // "experimentalDecorators": true,                   /* Enable experimental support for TC39 stage 2 draft decorators. */
    // "emitDecoratorMetadata": true,                    /* Emit design-type metadata for decorated declarations in source files. */
    // "jsxFactory": "",                                 /* Specify the JSX factory function used when targeting React JSX emit, e.g. 'React.createElement' or 'h' */
    // "jsxFragmentFactory": "",                         /* Specify the JSX Fragment reference used for fragments when targeting React JSX emit e.g. 'React.Fragment' or 'Fragment'. */
    // "jsxImportSource": "",                            /* Specify module specifier used to import the JSX factory functions when using `jsx: react-jsx*`.` */
    // "reactNamespace": "",                             /* Specify the object invoked for `createElement`. This only applies when targeting `react` JSX emit. */
    // "noLib": true,                                    /* Disable including any library files, including the default lib.d.ts. */
    // "useDefineForClassFields": true,                  /* Emit ECMAScript-standard-compliant class fields. */

    /* Modules */
    "module": "commonjs" /* Specify what module code is generated. */,
    // "rootDir": "./",                                  /* Specify the root folder within your source files. */
    // "moduleResolution": "node",                       /* Specify how TypeScript looks up a file from a given module specifier. */
    // "baseUrl": "./",                                  /* Specify the base directory to resolve non-relative module names. */
    // "paths": {},                                      /* Specify a set of entries that re-map imports to additional lookup locations. */
    // "rootDirs": [],                                   /* Allow multiple folders to be treated as one when resolving modules. */
    // "typeRoots": [],                                  /* Specify multiple folders that act like `./node_modules/@types`. */
    // "types": [],                                      /* Specify type package names to be included without being referenced in a source file. */
    // "allowUmdGlobalAccess": true,                     /* Allow accessing UMD globals from modules. */
    // "resolveJsonModule": true,                        /* Enable importing .json files */
    // "noResolve": true,                                /* Disallow `import`s, `require`s or `<reference>`s from expanding the number of files TypeScript should add to a project. */

    /* JavaScript Support */
    // "allowJs": true,                                  /* Allow JavaScript files to be a part of your program. Use the `checkJS` option to get errors from these files. */
    // "checkJs": true,                                  /* Enable error reporting in type-checked JavaScript files. */
    // "maxNodeModuleJsDepth": 1,                        /* Specify the maximum folder depth used for checking JavaScript files from `node_modules`. Only applicable with `allowJs`. */

    /* Emit */
    // "declaration": true,                              /* Generate .d.ts files from TypeScript and JavaScript files in your project. */
    // "declarationMap": true,                           /* Create sourcemaps for d.ts files. */
    // "emitDeclarationOnly": true,                      /* Only output d.ts files and not JavaScript files. */
    // "sourceMap": true,                                /* Create source map files for emitted JavaScript files. */
    // "outFile": "./",                                  /* Specify a file that bundles all outputs into one JavaScript file. If `declaration` is true, also designates a file that bundles all .d.ts output. */
    // "outDir": "./",                                   /* Specify an output folder for all emitted files. */
    // "removeComments": true,                           /* Disable emitting comments. */
    // "noEmit": true,                                   /* Disable emitting files from a compilation. */
    // "importHelpers": true,                            /* Allow importing helper functions from tslib once per project, instead of including them per-file. */
    // "importsNotUsedAsValues": "remove",               /* Specify emit/checking behavior for imports that are only used for types */
    // "downlevelIteration": true,                       /* Emit more compliant, but verbose and less performant JavaScript for iteration. */
    // "sourceRoot": "",                                 /* Specify the root path for debuggers to find the reference source code. */
    // "mapRoot": "",                                    /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,                          /* Include sourcemap files inside the emitted JavaScript. */
    // "inlineSources": true,                            /* Include source code in the sourcemaps inside the emitted JavaScript. */
    // "emitBOM": true,                                  /* Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files. */
    // "newLine": "crlf",                                /* Set the newline character for emitting files. */
    // "stripInternal": true,                            /* Disable emitting declarations that have `@internal` in their JSDoc comments. */
    // "noEmitHelpers": true,                            /* Disable generating custom helper functions like `__extends` in compiled output. */
    // "noEmitOnError": true,                            /* Disable emitting files if any type checking errors are reported. */
    // "preserveConstEnums": true,                       /* Disable erasing `const enum` declarations in generated code. */
    // "declarationDir": "./",                           /* Specify the output directory for generated declaration files. */
    // "preserveValueImports": true,                     /* Preserve unused imported values in the JavaScript output that would otherwise be removed. */

    /* Interop Constraints */
    // "isolatedModules": true,                          /* Ensure that each file can be safely transpiled without relying on other imports. */
    // "allowSyntheticDefaultImports": true,             /* Allow 'import x from y' when a module doesn't have a default export. */
    "esModuleInterop": true /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables `allowSyntheticDefaultImports` for type compatibility. */,
    // "preserveSymlinks": true,                         /* Disable resolving symlinks to their realpath. This correlates to the same flag in node. */
    "forceConsistentCasingInFileNames": true /* Ensure that casing is correct in imports. */,

    /* Type Checking */
    "strict": true /* Enable all strict type-checking options. */,
    // "noImplicitAny": true,                            /* Enable error reporting for expressions and declarations with an implied `any` type.. */
    // "strictNullChecks": true,                         /* When type checking, take into account `null` and `undefined`. */
    // "strictFunctionTypes": true,                      /* When assigning functions, check to ensure parameters and the return values are subtype-compatible. */
    // "strictBindCallApply": true,                      /* Check that the arguments for `bind`, `call`, and `apply` methods match the original function. */
    // "strictPropertyInitialization": true,             /* Check for class properties that are declared but not set in the constructor. */
    // "noImplicitThis": true,                           /* Enable error reporting when `this` is given the type `any`. */
    // "useUnknownInCatchVariables": true,               /* Type catch clause variables as 'unknown' instead of 'any'. */
    // "alwaysStrict": true,                             /* Ensure 'use strict' is always emitted. */
    // "noUnusedLocals": true,                           /* Enable error reporting when a local variables aren't read. */
    // "noUnusedParameters": true,                       /* Raise an error when a function parameter isn't read */
    // "exactOptionalPropertyTypes": true,               /* Interpret optional property types as written, rather than adding 'undefined'. */
    // "noImplicitReturns": true,                        /* Enable error reporting for codepaths that do not explicitly return in a function. */
    // "noFallthroughCasesInSwitch": true,               /* Enable error reporting for fallthrough cases in switch statements. */
    // "noUncheckedIndexedAccess": true,                 /* Include 'undefined' in index signature results */
    // "noImplicitOverride": true,                       /* Ensure overriding members in derived classes are marked with an override modifier. */
    // "noPropertyAccessFromIndexSignature": true,       /* Enforces using indexed accessors for keys declared using an indexed type */
    // "allowUnusedLabels": true,                        /* Disable error reporting for unused labels. */
    // "allowUnreachableCode": true,                     /* Disable error reporting for unreachable code. */

    /* Completeness */
    // "skipDefaultLibCheck": true,                      /* Skip type checking .d.ts files that are included with TypeScript. */
    "skipLibCheck": true /* Skip type checking all .d.ts files. */
  }
}
```

## 参考地址

[TypeScript 从 0 到 1 的学习之路（都这个年头了，你确定不学习 ts 卷一下吗？）8500 字分享 - 掘金](https://juejin.cn/post/7145675312548806664)  
[2022 年了，我才开始学 typescript ，晚吗？（7.5k 字总结） - 掘金](https://juejin.cn/post/7124117404187099172)  
[TypeScript 高级用法 - 掘金](https://juejin.cn/post/6926794697553739784)
