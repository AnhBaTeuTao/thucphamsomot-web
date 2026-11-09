import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import XLSX from 'xlsx';
import { inspectExcelWorkbook, parseExcelWorkbook, parseExcelNumber, readExcelWorkbook } from '../lib/order-import/excel.ts';
import { validateOrderQuantity } from '../lib/order-quantity.ts';
import { certainSkuName, certainUniqueName, uncertainOrderNote } from '../lib/order-import/confidence.ts';

function workbook(sheets) {
  const book = XLSX.utils.book_new();
  for (const [name, rows] of Object.entries(sheets)) XLSX.utils.book_append_sheet(book, XLSX.utils.aoa_to_sheet(rows), name);
  return readExcelWorkbook(XLSX.write(book, { type: 'buffer', bookType: 'xlsx' }));
}

test('detects an English order sheet after a cover sheet', () => {
  const book = workbook({ Cover: [['Company', 'Example']], Order: [
    ['Order #123'], [], ['Product code', 'Product name', 'Unit', 'Quantity', 'Notes'],
    ['r-muong', 'Rau muống', 'Kg', 10.7, 'Buổi sáng'], ['TOTAL', '', '', 10.7], ['Signature'],
  ] });
  const inspected = inspectExcelWorkbook(book);
  assert.equal(inspected.mapping?.sheet, 'Order');
  assert.equal(inspected.mapping?.headerRow, 3);
  const lines = parseExcelWorkbook(book, 'order.xlsx', inspected.mapping);
  assert.equal(lines.length, 1);
  assert.equal(lines[0].sourceRow, 4);
  assert.equal(lines[0].quantity, 10.7);
  assert.equal(lines[0].unit, 'Kg');
  assert.equal(lines[0].note, 'Buổi sáng');
});

test('recognizes Chinese headings and comma decimals', () => {
  const book = workbook({ 采购单: [['商品编码', '商品名称', '单位', '数量'], ['r-que', '九层塔', '公斤', '0,3']] });
  const mapping = inspectExcelWorkbook(book).mapping;
  assert.deepEqual(mapping?.columns, { sku: 0, name: 1, unit: 2, quantity: 3 });
  const lines = parseExcelWorkbook(book, '订单.xlsx', mapping);
  assert.equal(lines.length, 1);
  assert.equal(lines[0].quantity, 0.3);
  assert.equal(parseExcelNumber('1.234,5'), 1234.5);
  assert.equal(validateOrderQuantity({ id: 'x', unit: 'Kg' }, 0.3, '公斤').ok, true);
  assert.equal(validateOrderQuantity({ id: 'x', unit: 'Kg' }, 0.3, '未知单位').code, 'UNIT_CONFLICT');
});

test('permits manual mapping when the header is unfamiliar', () => {
  const book = workbook({ Sheet1: [['ABC', 'How many'], ['Cà rốt', 2.5]] });
  assert.equal(inspectExcelWorkbook(book).mapping, null);
  const lines = parseExcelWorkbook(book, 'own.xlsx', { sheet: 'Sheet1', headerRow: 1, columns: { name: 0, quantity: 1 } });
  assert.equal(lines.length, 1);
  assert.equal(lines[0].name, 'Cà rốt');
  assert.throws(() => parseExcelWorkbook(book, 'own.xlsx', { sheet: 'Sheet1', headerRow: 1, columns: { name: 0, quantity: 0 } }), /cột riêng/);
});

test('stops before signatures even when there is no total row', () => {
  const book = workbook({ Order: [['SKU', 'Tên hàng', 'Số lượng'], ['r-que', 'Rau quế', 0.3], ['', 'Người lập phiếu', ''], ['', '0899000000', '']] });
  const mapping = inspectExcelWorkbook(book).mapping;
  assert.equal(parseExcelWorkbook(book, 'signature.xlsx', mapping).length, 1);
});

test('does not auto-select duplicate names, conflicting SKU names or uncertain notes', () => {
  const normalize = (value) => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  assert.equal(certainUniqueName(3, ''), false);
  assert.equal(certainUniqueName(1, 'Hoá đơn ghi kg, kiểm lại có phải 1 thùng không'), false);
  assert.equal(uncertainOrderNote('Nhiều khả năng là 500 quả'), true);
  assert.equal(certainSkuName('tc-thanhlongtr', 'Thanh long (2-3 quả/kg)', ['thanh long 2 3qura kg'], normalize), false);
  assert.equal(certainSkuName('r-que', 'Rau quế', ['rau que'], normalize), true);
});

test('reads the supplied TPS1 delivery note without importing its total', { skip: !process.env.TPS1_EXCEL_FIXTURE || !existsSync(process.env.TPS1_EXCEL_FIXTURE) }, () => {
  const book = readExcelWorkbook(readFileSync(process.env.TPS1_EXCEL_FIXTURE));
  const mapping = inspectExcelWorkbook(book).mapping;
  assert.equal(mapping?.headerRow, 13);
  assert.deepEqual(mapping?.columns, { sku: 1, name: 2, unit: 3, quantity: 4, note: 7 });
  const lines = parseExcelWorkbook(book, 'sample.xlsx', mapping);
  assert.equal(lines.length, 27);
  assert.equal(lines[0].sourceRow, 14);
  assert.equal(lines.at(-1).sourceRow, 40);
  assert.equal(lines.find((line) => line.sku === 'r-que')?.quantity, 0.3);
  assert.equal(lines.find((line) => line.sku === 'r-muong')?.quantity, 10.7);
  assert.equal(lines[0].unit, 'Gói');
});

test('reads the Mekons order including units and uncertain source notes', { skip: !process.env.TPS1_MEKONS_FIXTURE || !existsSync(process.env.TPS1_MEKONS_FIXTURE) }, () => {
  const book = readExcelWorkbook(readFileSync(process.env.TPS1_MEKONS_FIXTURE));
  const mapping = inspectExcelWorkbook(book).mapping;
  assert.equal(mapping?.headerRow, 1);
  assert.deepEqual(mapping?.columns, { name: 0, quantity: 1, note: 2, unit: 3 });
  const lines = parseExcelWorkbook(book, 'mekons.xlsx', mapping);
  assert.equal(lines.length, 27);
  assert.equal(lines[0].sourceRow, 2);
  assert.equal(lines.at(-1).sourceRow, 28);
  assert.equal(lines.find((line) => line.name === 'Trứng gà')?.quantity, 500);
  assert.match(lines.find((line) => line.name === 'Trứng gà')?.note || '', /nhiều khả năng/);
  assert.equal(lines.find((line) => line.name === 'Tương cà Cholimex 2lit\/bình')?.unit, 'thùng');
});
