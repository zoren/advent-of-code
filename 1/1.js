const formToStr = (form) => {
  if (typeof form === "string") return form;
  if (Array.isArray(form)) return `(${formsToStr(form)})`;
  throw new Error("unexpected form type");
};

const formsToStr = (forms) => forms.map(formToStr).join(" ");

const expandFuncBody = (form, parent) => {
  if (typeof form === "string") {
    if (parent) {
      const parentFirst = parent[0];
      if (!isNaN(parseInt(form, 10)) && parentFirst !== "i32.const")
        return ["i32.const", form];
      if (
        (form.startsWith("$") && parentFirst.startsWith("i32.")) ||
        parentFirst.startsWith("$")
      )
        return ["local.get", form];
    }
    return form;
  }
  if (!Array.isArray(form)) throw new Error("unexpected form: " + form);
  const [first, ...rest] = form;
  if (first === "OR") {
    if (rest.length === 0)
      throw new Error("OR form should have at least 1 part");
    let i = rest.length - 1;
    let e = rest[i];
    for (; i >= 0; i--) {
      e = [
        "if",
        ["result", "i32"],
        rest[i],
        ["then", ["i32.const", "1"]],
        ["else", e],
      ];
    }
    return expandFuncBody(e, parent);
  }
  if (first.startsWith("$"))
    return ["call", first, ...rest.map((arg) => expandFuncBody(arg, form))];
  return [first, ...rest.map((arg) => expandFuncBody(arg, form))];
};

const expandModule = ([first, ...members]) => {
  if (first !== "module") throw new Error("expected module");
  return [
    first,
    ...members.map((memForm) =>
      memForm[0] === "func" ? expandFuncBody(memForm) : memForm
    ),
  ];
};

const { default: wabtfn } = await import("wabt");
const wabt = await wabtfn();

import { parse } from "./parser.js";
import inputMWat from "./1.wat?raw";
const { forms, warnings } = parse(inputMWat);
if (warnings.length > 0) {
  for (const warning of warnings) {
    console.log(warning);
  }
  throw new Error("unexpected warnings");
}
if (forms.length !== 1) throw new Error("expected 1 form");
const [moduleForm] = forms;

const watText = formToStr(expandModule(moduleForm));
const module = wabt.parseWat("", watText);
module.resolveNames();
module.validate({});
const binaryOutput = module.toBinary({
  log: true,
  write_debug_names: true,
});
const wasmBytes = binaryOutput.buffer;
const textEncoder = new TextEncoder("utf-8");

const mem = new WebAssembly.Memory({ initial: 2 });
const memBuf = mem.buffer;
const ui8 = new Uint8Array(mem.buffer);

import text from './input.txt?raw'
// import text from './mini2.txt?raw'
const { read, written } = textEncoder.encodeInto(text, ui8.subarray(128));
if(read !== text.length) throw new Error('unexpected read');
const importObject = {
  host: {
    mem,
  },
  console
};
const obj = await WebAssembly.instantiate(wasmBytes, importObject);
const { instance } = obj;
const { exports } = instance;
const { calc, load_first_item_in_mem, load_nth_item_in_mem } = exports;
// for (let i = 0; i < 128; i++) {
//   console.log(i, ui8[i], String.fromCharCode(ui8[i]));
// }
console.log({ load_first_item_in_mem: load_first_item_in_mem(), one: load_nth_item_in_mem(1)});

const result = calc(128, written + 128);
console.log({ result, load_first_item_in_mem: load_first_item_in_mem(), one: load_nth_item_in_mem(1) });
// for (let i = 0; i < 128; i++) {
//   console.log(i,ui8[i],String.fromCharCode(ui8[i]));
// }