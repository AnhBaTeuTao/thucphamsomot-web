import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import XLSX from 'xlsx';
import { inspectExcelWorkbook, parseExcelWorkbook, parseExcelNumber, readExcelWorkbook } from '../lib/order-import/excel.ts';
import { validateOrderQuantity } from '../lib/order-quantity.ts';

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
