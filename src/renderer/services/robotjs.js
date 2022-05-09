import nativeFactory from './nativeFactory';

const robotjsService = nativeFactory('robotjs', [
    'setMouseDelay', 
    'moveMouse', 
    'moveMouseSmooth', 
    'setMouseDelay', 
    'mouseClick', 
    'mouseToggle', 
    'dragMouse', 
    'getMousePos', 
    'scrollMouse', 

    'setKeyboardDelay', 
    'keyTap', 
    'keyToggle', 
    'typeString', 
    'typeStringDelayed', 

    'getPixelColor', 
    'getScreenSize', 
    'capture', 
]);
export default robotjsService;