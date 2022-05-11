import React, { useState, useRef } from 'react';
import './App.css';
import { DEFAULT_BLACKNOTEDURATION, EMPTY_NOTE, GUITAR_NOTE_MATRIX, KEYBOARD_MATRIX, NOTEID_LIST, SHEET_TYPE, TIME_NODE_MAP } from './const';
import { DATA_SHEET } from './data';
import nutjsService from './renderer/services/nutjs';
import robotjsService from './renderer/services/robotjs';
import { findMap } from './utils';

function App() {
  const [sheet, setSheet] = useState(DATA_SHEET);
  const [blackNoteDuration, setBlackNoteDuration] = useState(DEFAULT_BLACKNOTEDURATION);
  const [sheetType, setSheetType] = useState(SHEET_TYPE.POSITION);
  const isPlaying = useRef();
  const isPause = useRef();
  const resolvePause = useRef();

  function start () {
    
    // setTimeout(async () => {
    //   nutjsService.type('a');
    // }, 3000);
    // return;
    isPlaying.current = true;
    const nodeConfig = parseSheet();
    // return console.log('nodeConfig', nodeConfig);
    nodeConfig && playSheet(nodeConfig);
  }

  function parseSheet () {
    if (sheet) {
      const nodes = splitSheetToNode(sheet);
      // return;
      const nodeConfig = 
      nodes
      .filter(Boolean)
      .map(node => {
        if (node.length >= 2) {
          const notes = splitNode(node);
          const notePos = notes.map(note => getPosition(note));
          const frag3 = notes[notes.length - 1].slice(2);
          const duration = calculateDuration(frag3);
          return { notePos, duration };
        }
        return { duration: blackNoteDuration };
      });
      return nodeConfig;
    }
    return;
  }

  function splitSheetToNode (sheet) {
    const filterdSheet = sheet.split(/\n/).filter(line => line.trim().charAt(0) !== '#').join(' ');
    console.log('filterdSheet', filterdSheet);
    return filterdSheet.split(/\s+/);
  }

  function splitNode (node) {
    const notes = node.split('=');
    if (sheetType === SHEET_TYPE.GUITAR) {
      return notes.map(note => {
        if (note.length >= 2) {
          const frag1 = parseInt(note.charAt(0));
          const frag2 = parseInt(note.charAt(1));
          if (Number.isInteger(frag1) && Number.isInteger(frag2)) {
            const guitarNote = GUITAR_NOTE_MATRIX[frag1 - 1] && GUITAR_NOTE_MATRIX[frag1 - 1][frag2];
            if (guitarNote) {
              return guitarNote + note.slice(2);
            }
            return 'NA';
          }
          return 'NA';
        }
        return 'NA';
      })
    }
    return notes;
  }

  function getPosition (note) {
    if (note.length >= 2) {
      switch (sheetType) {
        case SHEET_TYPE.GUITAR:
        case SHEET_TYPE.NOTE: {
          const frag1 = note.charAt(0);
          const frag2 = note.charAt(1);
          const x = calculateX(frag1);
          const y = calculateY(frag2);
          return { x, y };
        }
        case SHEET_TYPE.POSITION: {
          const frag1 = note.charAt(0);
          const frag2 = note.charAt(1);
          const x = parseInt(frag1);
          const y = parseInt(frag2);
          return { x, y };
        }
      }
    }
    return {};
  }

  function calculateX (char) {
    const x = NOTEID_LIST.findIndex(el => el === char.toLowerCase());
    return x > -1 ? x : null;
  }

  function calculateY (char) {
    return parseInt(char) - 1;
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
      robotjsService.setKeyboardDelay(0);
      for (const { notePos, duration } of nodeConfig) {
        // const str = notePos.map(({x, y}) => {
        //   if (x && y) {
        //     const key = KEYBOARD_MATRIXf
        notePos.forEach(({x, y}, index) => {
            const key = isValidXY(x, y) ? KEYBOARD_MATRIX[y][x] : EMPTY_NOTE;
            if (index !== notePos.length - 1) {
              robotjsService.setKeyboardDelay(0);
            } else {
              robotjsService.setKeyboardDelay(duration);
            }
            const a = robotjsService.keyTap(key);
        });
        // for (const {x, y} of [{x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1}] ) {
        //   if (x && y) {
        //     const key = KEYBOARD_MATRIX[y - 1][x - 1];
        //     robotjsService.setKeyboardDelay(0);
        //     robotjsService.keyTap(key);
        //   }
        // }
        // robotjsService.setKeyboardDelay(duration);
        // await pause();
        // await sleep(duration);
      }
      
    isPlaying.current = false;
    }, 5000)
  }

  function isValidXY (x, y) {
    return [x, y].every(el => Number.isInteger(el));
  }

  async function sleep (time) {
    return new Promise(res => setTimeout(() => res(), time));
  }

  async function pause () {
    return new Promise(res => resolvePause.current = res);
  }

  function handleChange (e) {
    setSheet(e.target.value);
  }

  function handlePause (e) {
    isPause.current = !isPause.current;
    resolvePause.current();
  }
  
  return <div>
  <div>
    <input value={blackNoteDuration} onChange={(e) => setBlackNoteDuration(e.target.value)} />
  </div>
    <div>
      <textarea rows="5" value={sheet} onChange={handleChange}></textarea>
    </div>
    <div>
    <input type="radio" name="sheedType" value={SHEET_TYPE.NOTE} checked={sheetType === SHEET_TYPE.NOTE} onChange={(e) => setSheetType(e.target.value)}/>
  <label>A</label><br />
  <input type="radio" name="sheedType" value={SHEET_TYPE.POSITION} checked={sheetType === SHEET_TYPE.POSITION} onChange={(e) => setSheetType(e.target.value)}/>
  <label>B</label><br />
  <input type="radio" name="sheedType" value={SHEET_TYPE.GUITAR} checked={sheetType === SHEET_TYPE.GUITAR} onChange={(e) => setSheetType(e.target.value)}/>
  <label>C</label>

    </div>
    <div>
      <button type="button" onClick={start}>{isPlaying.current ? 'Playing...' : 'Start'}</button>
      {
      isPlaying.current && 
      <button type="button" onClick={handlePause}>{isPause ? 'Resume' : 'Pause'}</button>
      }
      
    </div>
  </div>
}

export default App;
