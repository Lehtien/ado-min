"use client";

import React, { useEffect, useRef, useState } from "react";

export interface CheckboxItem {
  id: string;
  label: string;
  checked: boolean;
}

interface ItemsProps {
  name: string;
  item: CheckboxItem[][];
  onChange?: (items: CheckboxItem[][]) => void;
}

const Items = ({ item, onChange }: ItemsProps) => {
  const createInitialData = (): CheckboxItem[][] => {
    return [
      [
        { id: "B-1", label: "アクスタ(もな)", checked: false },
        { id: "B-2", label: "アクスタ(美雨)", checked: false },
        { id: "B-3", label: "アクスタ(凛花)", checked: false },
        { id: "B-4", label: "アクスタ(灯翠)", checked: false },
        { id: "B-5", label: "アクスタ(百花)", checked: false },
        { id: "B-6", label: "全身アクスタ(もな)", checked: false },
        { id: "B-7", label: "全身アクスタ(美雨)", checked: false },
        { id: "B-8", label: "全身アクスタ(凛花)", checked: false },
        { id: "B-9", label: "全身アクスタ(灯翠)", checked: false },
        { id: "B-10", label: "全身アクスタ(百花)", checked: false },
      ],
      [
        { id: "C-1", label: "アクキー(もな)", checked: false },
        { id: "C-2", label: "アクキー(美雨)", checked: false },
        { id: "C-3", label: "アクキー(凛花)", checked: false },
        { id: "C-4", label: "アクキー(灯翠)", checked: false },
        { id: "C-5", label: "アクキー(百花)", checked: false },
      ],
      [
        { id: "D-1", label: "アクキー(もなA)", checked: false },
        { id: "D-2", label: "アクキー(もなB)", checked: false },
        { id: "D-3", label: "アクキー(美雨A)", checked: false },
        { id: "D-4", label: "アクキー(美雨B)", checked: false },
        { id: "D-5", label: "アクキー(凛花A)", checked: false },
        { id: "D-6", label: "アクキー(凛花B)", checked: false },
        { id: "D-7", label: "アクキー(灯翠A)", checked: false },
        { id: "D-8", label: "アクキー(灯翠B)", checked: false },
        { id: "D-9", label: "アクキー(百花A)", checked: false },
        { id: "D-10", label: "アクキー(百花B)", checked: false },
      ],
      [
        { id: "E-1", label: "缶バッジ(もなA)", checked: false },
        { id: "E-2", label: "缶バッジ(もなB)", checked: false },
        { id: "E-3", label: "缶バッジ(美雨A)", checked: false },
        { id: "E-4", label: "缶バッジ(美雨B)", checked: false },
        { id: "E-5", label: "缶バッジ(凛花A)", checked: false },
        { id: "E-6", label: "缶バッジ(凛花B)", checked: false },
        { id: "E-7", label: "缶バッジ(灯翠A)", checked: false },
        { id: "E-8", label: "缶バッジ(灯翠B)", checked: false },
        { id: "E-9", label: "缶バッジ(百花A)", checked: false },
        { id: "E-10", label: "缶バッジ(百花B)", checked: false },
      ],
      [
        { id: "F-1", label: "ステッカー(もな)", checked: false },
        { id: "F-2", label: "ステッカー(美雨)", checked: false },
        { id: "F-3", label: "ステッカー(凛花)", checked: false },
        { id: "F-4", label: "ステッカー(灯翠)", checked: false },
        { id: "F-5", label: "ステッカー(百花)", checked: false },
      ],
      [
        { id: "G-1", label: "ミニカード(もな)", checked: false },
        { id: "G-2", label: "ミニカード(美雨)", checked: false },
        { id: "G-3", label: "ミニカード(凛花)", checked: false },
        { id: "G-4", label: "ミニカード(灯翠)", checked: false },
        { id: "G-5", label: "ミニカード(百花)", checked: false },
        { id: "G-6", label: "ミニカード(集合A)", checked: false },
        { id: "G-7", label: "ミニカード(集合B)", checked: false },
        { id: "G-8", label: "ミニカード(集合C)", checked: false },
        { id: "G-9", label: "ミニカード(集合D)", checked: false },
        { id: "G-10", label: "ミニカード(集合E)", checked: false },
      ],
      [
        { id: "5-1", label: "アーケード風カード(もな)", checked: false },
        { id: "5-2", label: "アーケード風カード(美雨)", checked: false },
        { id: "5-3", label: "アーケード風カード(凛花)", checked: false },
        { id: "5-4", label: "アーケード風カード(灯翠)", checked: false },
        { id: "5-5", label: "アーケード風カード(百花)", checked: false },
      ],
      [
        { id: "10-1", label: "ポストカード(もな)", checked: false },
        { id: "10-2", label: "ポストカード(美雨)", checked: false },
        { id: "10-3", label: "ポストカード(凛花)", checked: false },
        { id: "10-4", label: "ポストカード(灯翠)", checked: false },
        { id: "10-5", label: "ポストカード(百花)", checked: false },
      ],
    ];
  };

  const [items, setItems] = useState<CheckboxItem[][]>(createInitialData());

  useEffect(() => {
    if (item) {
      setItems((prevItems) =>
        prevItems.map((row, rowIndex) =>
          row.map((data, colIndex) => ({
            ...data,
            checked: item[rowIndex]?.[colIndex]?.checked ?? data.checked,
          })),
        ),
      );
    }
  }, [item]);

  const handleCheck = (row: number, col: number): void => {
    const newItems = items.map((rowItems, rowIndex) =>
      rowIndex === row
        ? rowItems.map((item, colIndex) =>
            colIndex === col ? { ...item, checked: !item.checked } : item,
          )
        : rowItems,
    );
    setItems(newItems);
    onChange?.(newItems);
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="grid flex-wrap gap-4">
        {items.map((row, rowIndex) => (
          <React.Fragment key={`section-${rowIndex}`}>
            <div>
              {rowIndex === 0 && <p>B賞 アクリルスタンド</p>}
              {rowIndex === 1 && (
                <p className="mt-8">C賞 ゆらゆらアクリルキーホルダー</p>
              )}
              {rowIndex === 2 && (
                <p className="mt-8">D賞 アクリルキーホルダー</p>
              )}
              {rowIndex === 3 && <p className="mt-8">E賞 缶バッジ</p>}
              {rowIndex === 4 && (
                <p className="mt-8">F賞 全身ダイカットステッカー</p>
              )}
              {rowIndex === 5 && <p className="mt-8">G賞 ミニフォトカード</p>}
              {rowIndex === 6 && (
                <p className="mt-8">5連特典 アーケードゲーム風ミニカード</p>
              )}
              {rowIndex === 7 && (
                <p className="mt-8">10連特典 デジタルサイン入りポストカード</p>
              )}
              <hr />
            </div>

            <div key={rowIndex} className="flex flex-wrap gap-8">
              {row.map((item, colIndex) => (
                <div key={item.id} className="items-evenly flex">
                  <label
                    htmlFor={item.id}
                    className="mr-2 text-sm text-gray-600"
                  >
                    {item.label}
                  </label>
                  <input
                    type="checkbox"
                    id={item.id}
                    checked={item.checked}
                    onChange={() => handleCheck(rowIndex, colIndex)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Items;
