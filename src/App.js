import React, { useState } from 'react';
import './App.css';
import { DEFAULT_BLACKNOTEDURATION, KEYBOARD_MATRIX, NOTEID_LIST, TIME_NODE_MAP } from './const';
import { DATA_SHEET } from './data';
import robotjsService from './renderer/services/robotjs';
import { findMap } from './utils';

function App() {
  const [sheet, setSheet] = useState(DATA_SHEET);
  const [blackNoteDuration, setBlackNoteDuration] = useState(DEFAULT_BLACKNOTEDURATION);

  function start () {
    const nodeConfig = parseSheet();
    nodeConfig && playSheet(nodeConfig);
  }

  function parseSheet () {
    if (sheet) {
      const nodes = sheet.split(/\s+/);
      const nodeConfig = 
      nodes
      .filter(Boolean)
      .map(item => {
        if (item.length >= 2) {
          const frag1 = item.charAt(0);
          const frag2 = item.charAt(1);
          const frag3 = item.slice(2);
          const x = calculateX(frag1);
          const y = calculateY(frag2);
          const duration = calculateDuration(frag3);
          return { x, y, duration };
        }
        return { duration: blackNoteDuration };
      });
      return nodeConfig;
    }
    return;
  }

  function calculateX (char) {
    const x = NOTEID_LIST.findIndex(el => el === char.toLowerCase());
    return x + 1 || 1;
  }

  function calculateY (char) {
    return char || 1;
  }

  function calculateDuration (str) {
    if (!str) {
      return blackNoteDuration;
    }
    try {
      const num = parseFloat(str);
      if (Number.isInteger(num)) {
        const findItem = findMap(TIME_NODE_MAP, 'num', num);
        const ratio = findItem ? findItem.ratioWithBlackNode : 1;
        return blackNoteDuration * ratio;
      } else {
        const findItem = findMap(TIME_NODE_MAP, 'num', parseInt(num));
        const ratio = findItem ? findItem.ratioWithBlackNode : 1;
        return blackNoteDuration * ratio * 1.5;
      }
    } catch(e) {
      return blackNoteDuration;
    }
  }

  function playSheet (nodeConfig) {
    setTimeout(async () => {
      for (const { x, y, duration } of nodeConfig) {
        if (x && y) {
          const key = KEYBOARD_MATRIX[y - 1][x - 1];
          robotjsService.keyTap(key);
        }
        await delay(duration);
      }
    }, 5000)
  }

  async function delay (time) {
    return new Promise(res => setTimeout(() => res(), time));
  }

  function stop () {
  }

  function handleChange (e) {
    setSheet(e.target.value);
  }
  
  return <div>
  <div>
    <input value={blackNoteDuration} onChange={(e) => setBlackNoteDuration(e.target.value)} />
  </div>
    <div>
      <textarea rows="5" value={sheet} onChange={handleChange}></textarea>
    </div>
    <div>
      <button type="button" onClick={start}>start</button>
      <button type="button" onClick={stop}>stop</button>
    </div>
  </div>
}

export default App;
