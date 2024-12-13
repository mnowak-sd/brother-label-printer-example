'use client';

import React, { useEffect, useState } from 'react';
import BrotherSdk from "bpac-js";

interface LabelOptions {
  copies: number,
  printName: string,
}

export default function Home() {
  const [printer, setPrinter] = useState<string>('Unknown');
  const [message, setMessage] = useState<string>('Setting up ... ');
  const [preview, setPreview] = useState<ImageData>();
  const [sdk, setSdk] = useState<BrotherSdk>();

  const [boxId, setBoxId] = useState<string>("123");
  const [transactionId, setTransactionId] = useState<string>("123");
  const [barcode, setBarcode] = useState<string>("00000123-123");

  useEffect(() => {
    if (!sdk) {
      const brotherSdk = new BrotherSdk({
        templatePath: "C:/Users/MNOWAK6/code/scratch/test-printer/public/static/templates/MaterialStorageTemplateUpdated.lbx",
        exportDir: "C:/Users/MNOWAK6/code/scratch/test-printer/public/static/templates/exports/",
      });

      setSdk(brotherSdk);
      refreshPrinter(brotherSdk);
    }
  }, [sdk])

  function refreshPrinter(sdk: BrotherSdk) {
    sdk.getPrinterName().then((printer) => { setPrinter(printer); setMessage('Printer found!') }).catch((err) => { setMessage(JSON.stringify(err)); console.error(err); });
  }

  function printLabel(sdk: BrotherSdk, data: LabelData, options: LabelOptions) {
    sdk.print(data, options).then((printed) => { console.log(printed) }).catch((error) => { console.error(error) });
  }

  function previewLabel(sdk: BrotherSdk, data: LabelData, options: LabelOptions) {
    sdk.getImageData(data, { height: 120 }).then((preview) => { setPreview(preview); setMessage('Preview updated') }).catch((error) => { console.error(error) });
  }

  function exportLabel(sdk: BrotherSdk, data: LabelData, options: LabelOptions) {
    sdk.export(data, options.printName + '.bmp', 300).then((printed) => { console.log(printed); setMessage('Export complete') }).catch((error) => { console.error(error) });
  }

  const data: Record<string, string | Date> = {
    'boxId': boxId,
    'transactionId': transactionId,
    'barcode': barcode
  }

  const options: LabelOptions = {
    copies: 1,
    printName: 'example'
  }

  if (sdk) {
    previewLabel(sdk, data, options);
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl">Brother Printer Test</h1>
        <ul className="list-inside list-decimal font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">Click <b className="text-bold">Export</b> to export the label to <span className="text-">/public/static/templates/exports</span>.</li>
          <li className="mb-2">Click <b className="text-bold">Print</b> to print a test label.</li>
        </ul>

        <div className="flex gap-4 flex-row">
          <label>Printer name</label>
          <span>{printer}</span>
        </div>

        <div className="flex gap-4 flex-row">
          <label>Status</label>
          <span>{message}</span>
        </div>

        <div className="flex gap-4 flex-col">
          <h1 className="text-2xl">Data</h1>
          <label htmlFor="input-box-id">
            <span className="mr-4">Box ID</span>
            <input type="number" value={boxId} className="text-black" id="input-box-id" onChange={(e) => { setBoxId(e.target.value); setBarcode(`${transactionId?.toString().padStart(8, "0")}-${e.target.value?.toString().padStart(3, "0")}`) }}></input>
          </label>
          <label htmlFor="input-transaction-id">
            <span className="mr-4">Transaction ID</span>
            <input type="number" className="text-black" value={transactionId} id="input-transaction-id" onChange={(e) => { setTransactionId(e.target.value); setBarcode(`${e.target.value?.toString().padStart(8, "0")}-${boxId?.toString().padStart(3, "0")}`) }}></input>
          </label>
          <label>
            <span className="mr-4">Barcode contents</span>
            <span>{barcode}</span>
          </label>
        </div>

        <div>

        </div>

        {preview ?
          <div className="flex gap-4 flex-col">
            <h1 className="text-2xl">Preview</h1>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview ?? ""} height={120} alt="preview" />
            </div>
          </div>
          : <div></div>}

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => { setMessage('Exporting label image'); exportLabel(sdk, data, options) }}
          >
            Export
          </a>

          <a
            className="rounded-full border border-solid border-black dark:border-white transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => { setMessage('Printing label'); printLabel(sdk, data, options) }}
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
