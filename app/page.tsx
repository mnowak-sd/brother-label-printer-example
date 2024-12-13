'use client';

import React, { useState } from 'react';
import BrotherSdk from "bpac-js";

interface LabelData extends Record<string, string | Date> { }

interface LabelOptions {
  copies: number,
  printName: string,
}

export default function Home() {
  const [printer, setPrinter] = useState<string>('Unknown');
  const [message, setMessage] = useState<string>('Setting up ... ');

  const sdk = new BrotherSdk({
    templatePath: "C:/Users/MNOWAK6/code/scratch/test-printer/public/static/templates/MaterialStorageTemplateUpdated.lbx",
    exportDir: "C:/Users/MNOWAK6/code/scratch/test-printer/public/static/templates/exports/",
  });

  function refreshPrinter(sdk: BrotherSdk) {
    sdk.getPrinterName().then((printer) => { setPrinter(printer); setMessage('Printer found!') }, (err) => { setMessage(JSON.stringify(err)); console.error(err); });
  }

  function printLabel(sdk: BrotherSdk, data: LabelData, options: LabelOptions) {
    sdk.print(data, options).then((printed) => { console.log(printed) }).catch((error) => { console.error(error) });
  }

  function exportLabel(sdk: BrotherSdk, data: LabelData, options: LabelOptions) {
    sdk.export(data, options.printName + '.bmp', 300).then((printed) => { console.log(printed) }).catch((error) => { console.error(error) });
  }

  function checkPrinterStatus() {
    BrotherSdk;
  }

  const data: LabelData = {
    'boxId': '1',
    'transactionId': '1',
    'barcode': '00000001-001'
  }

  const options: LabelOptions = {
    copies: 1,
    printName: 'example'
  }

  checkPrinterStatus(sdk);
  refreshPrinter(sdk);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl">Brother Printer Test</h1>
        <ul className="list-inside list-decimal font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">Click <b className="text-bold">Find printer</b> to find the printer.</li>
          <li className="mb-2">Click <b className="text-bold">Print</b> to print a test label.</li>
        </ul>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <label>Printer name</label>
          <span>{printer}</span>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <label>Status</label>
          <span>{message}</span>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => { exportLabel(sdk, data, options) }}
          >
            Export
          </a>
          <a
            className="rounded-full border border-solid border-black dark:border-white transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => { printLabel(sdk, data, options) }}
          >
            Print
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
